import { Injectable, OnModuleInit, OnModuleDestroy, NotFoundException, BadRequestException } from '@nestjs/common';

import {
    ServiceBusClient,
    ServiceBusSender
}                       from '@azure/service-bus';
import {
    JobStatus,
    RecurrenceFrequency,
}                       from '@prisma/client';

import {
    transformToCron,
    calculateNextRunDate
}                                   from '@send-emails/utils/cron-transformer';
import { ENVS }                     from '@config/envs';
import { PrismaService }            from '@prisma/prisma.service';
import { SendEmailDto }             from '@send-emails/dto/send-email.dto';
import { SendEmailWorkflowDto }     from '@send-emails/dto/send-email-workflow.dto';
import { SELECT_EMAIL_LOG_SEND }    from '@send-email-logs/utils/select';
import { SseService }               from '@sse/sse.service';
import { EnumAction, Entity }       from '@sse/sse.model';
import { SELECT_WORKFLOW }          from '@workflow/utils/select';


@Injectable()
export class SendEmailsService implements OnModuleInit, OnModuleDestroy {
    private sbClient        : ServiceBusClient;
    private sender          : ServiceBusSender;
    private recurrenceSender: ServiceBusSender;


    constructor(
        private readonly prisma: PrismaService,
        private readonly sseService: SseService,
    ) { }


    private readonly connectString          : string = ENVS.AZURE_BUS.CONNECTION;
    private readonly queueName              : string = ENVS.AZURE_BUS.QUEUE_NAME;
    private readonly queueRecurrent         : string = ENVS.AZURE_BUS.AZURE_QUEUE_RECURRENCE_NAME;
    private readonly maxConcurrentBatches   : number = ENVS.AZURE_BUS.MAX_CONCURRENT_BATCHES || 10


    async onModuleInit() {
        this.sbClient   = new ServiceBusClient( this.connectString );
        this.sender     = this.sbClient.createSender( this.queueName );

        this.recurrenceSender = this.sbClient.createSender( this.queueRecurrent );
    }


    async startEmailJob( payload: SendEmailDto ) {
        const {
            students,
            templateId,
            templateFileId,
            subject,
            cc,
            bcc,
            priority,
            staffId,
            filters
        } = payload;

        if ( templateId && templateFileId ) {
            throw new BadRequestException( "No puede enviar templateId y templateFileId al mismo tiempo" );
        }

        if ( !templateId && !templateFileId ) {
            throw new BadRequestException( "Debe enviar templateId o templateFileId" );
        }

        let template: { content: any } | null = null;

        if ( templateId  ) {
            template = await this.prisma.template.findUnique({
                where: {
                    id      : templateId,
                    active  : true,
                },
                select : {
                    content: true,
                }
            });

            if ( !template ) throw new NotFoundException( "Template no encontrado" );
        } else if ( templateFileId ) {
            const templateFile = await this.prisma.templateFile.findUnique({
                where: {
                    id: templateFileId,
                },
            });

            if ( !templateFile ) throw new NotFoundException( "TemplateFile no encontrado" );
        }

        const sendEmailLog = await this.prisma.sendEmailLog.create({
            data: {
                templateId,
                templateFileId,
                subject,
                staffId,
                filters,
                priority,
                cc              : cc    ?? [],
                bcc             : bcc   ?? [],
                content         : templateId ? ( template as { content: any }).content : undefined,
                studentEmails   : students.map( s => s.email ),
                status          : JobStatus.PROCESSING,
            },
            select: SELECT_EMAIL_LOG_SEND,
        });

        this.sendMassiveEmails( payload, sendEmailLog.id )
            .then( async () => {
                const sendEmail = await this.prisma.sendEmailLog.update({
                    where: {
                        id: sendEmailLog.id
                    },
                    data: {
                        status: JobStatus.COMPLETED
                    },
                    select : SELECT_EMAIL_LOG_SEND
                });

				this.sseService.emitEvent({
					message : sendEmail,
					action  : EnumAction.UPDATE,
					entity  : Entity.EMAIL_LOG,
				});
            })
            .catch( async ( err ) => {
                const sendEmail = await this.prisma.sendEmailLog.update({
                    where: {
                        id: sendEmailLog.id
                    },
                    data: {
                        status  : JobStatus.FAILED,
                        message : err.message ?? "Error desconocido"
                    },
                    select: SELECT_EMAIL_LOG_SEND
                });

				this.sseService.emitEvent({
					message : sendEmail,
					action  : EnumAction.UPDATE,
					entity  : Entity.EMAIL_LOG,
				});
            });

        return {
            message     : "Proceso de envío programado exitosamente",
            notification: { sendEmailLog },
            count       : students.length,
            sendEmailLog
        };
    }

    // ========================= MASIVOS (inmediatos) =========================
    async sendMassiveEmails( payload: SendEmailDto, sendEmailLogId: string ): Promise<void> {
        const { students, templateId, templateFileId, subject, cc, bcc, priority } = payload;

        let batch = await this.sender.createMessageBatch();

        const sendPromises: Promise<void>[] = [];

        for ( const student of students ) {
            const message = {
                contentType : "application/json",
                body        : {
                    student,
                    templateId,
                    templateFileId,
                    subject,
                    notificationId: sendEmailLogId,
                    ...( priority   && { priority }),
                    ...( cc         && { cc }),
                    ...( bcc        && { bcc })
                },
            };

            // Si no cabe en el lote actual
            if ( !batch.tryAddMessage( message )) {
                // Guardamos la promesa del envío y seguimos creando el siguiente lote
                sendPromises.push( this.sender.sendMessages( batch ));

                // Creamos nuevo lote y añadimos el mensaje que no cupo
                batch = await this.sender.createMessageBatch();

                batch.tryAddMessage( message );
            }

            if ( sendPromises.length >= this.maxConcurrentBatches ) {
                await Promise.all( sendPromises );
                sendPromises.length = 0;
            }
        }

        // Enviar el último lote y esperar a que terminen los pendientes
        if ( batch.count > 0 ) {
            sendPromises.push( this.sender.sendMessages( batch ));
        }

        await Promise.all( sendPromises );

        console.log(`${students.length} correos procesados.`);
    }


    // ========================= WORKFLOW (programado / recurrente) =========================
    async startEmailWorkflow( payload: SendEmailWorkflowDto ) {
        const {
            name, description, templateId, templateFileId, subject, cc, bcc,
            students, createdBy, frequency, date,
            hour, minute, interval, daysOfWeek, dayOfMonth, monthOfYear,
            lastDayOfMonth, occurrences, repeatUntil, neverEnds, filters
        } = payload;

        if ( templateId && templateFileId ) {
            throw new BadRequestException( "No puede enviar templateId y templateFileId al mismo tiempo" );
        }

        if ( !templateId && !templateFileId ) {
            throw new BadRequestException( "Debe enviar templateId o templateFileId" );
        }

        let resolvedSubject: string | null | undefined = subject;
        let templateContent: any           = undefined;

        if ( templateId ) {
            const template = await this.prisma.template.findUnique( {
                where  : { id: templateId, active: true },
                select : { content: true, name: true },
            });

            if ( !template ) throw new NotFoundException( "Template no encontrado" );

            resolvedSubject = subject ?? template.name;
            templateContent = template.content;
        } else if ( templateFileId ) {
            const templateFile = await this.prisma.templateFile.findUnique( {
                where  : { id: templateFileId },
                select : { name: true }
            });

            if ( !templateFile ) throw new NotFoundException( "TemplateFile no encontrado" );

            resolvedSubject = subject ?? templateFile.name;
        }

        if ( !resolvedSubject ) {
            throw new BadRequestException( "Se requiere un asunto. Provéelo en el payload o en el template." );
        }

        // 3. Determinar frecuencia (default ONCE)
        const resolvedFrequency = frequency ?? RecurrenceFrequency.ONCE;
        const isOnce            = resolvedFrequency === RecurrenceFrequency.ONCE;

        // 4. Calcular fecha de primera ejecución y validar fecha para ONCE
        let firstRun: Date;
        let cronRule: string | null = null;

        if ( isOnce ) {
            if ( date ) {
                firstRun = new Date( date );
            } else {
                const now = new Date();
                firstRun  = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    hour,
                    minute,
                    0,
                    0
                );
            }

            if ( firstRun <= new Date() ) {
                throw new BadRequestException( "La fecha de programación debe ser futura." );
            }
        } else {
            // Recurrente: calcular primera ejecución con cron / lastDayOfMonth
            const recurrenceSettings = {
                frequency       : resolvedFrequency,
                hour,
                minute,
                daysOfWeek,
                dayOfMonth,
                lastDayOfMonth,
            };

            cronRule = lastDayOfMonth ? null : transformToCron( recurrenceSettings );
            firstRun = calculateNextRunDate( recurrenceSettings, date );
        }

        // 5. Crear Workflow en DB
        const workflow = await this.prisma.workflow.create({
            data : {
                name            : name,
                description     : description,
                subject         : resolvedSubject,
                cc              : cc  ?? [],
                bcc             : bcc ?? [],
                templateId      : templateId,
                templateFileId  : templateFileId,
                students        : students.map( s => ( { email: s.email, name: s.name } ) ),
                date            : isOnce ? firstRun : null,
                frequency       : resolvedFrequency,
                interval        : interval,
                daysOfWeek      : daysOfWeek    ?? [],
                dayOfMonth      : dayOfMonth,
                monthOfYear     : monthOfYear,
                hour            : hour,
                minute          : minute,
                lastDayOfMonth  : lastDayOfMonth ?? false,
                occurrences     : occurrences,
                repeatUntil     : repeatUntil,
                neverEnds       : isOnce ? false : ( neverEnds ?? false ),
                createdBy       : createdBy,
                filters
            },
            select : SELECT_WORKFLOW
        });

        // 6. Crear SendEmailLog (PENDING) vinculado al Workflow
        const sendEmailLog = await this.prisma.sendEmailLog.create( {
            data : {
                templateId      : templateId,
                templateFileId  : templateFileId,
                subject         : resolvedSubject,
                staffId         : createdBy,
                cc              : cc  ?? [],
                bcc             : bcc ?? [],
                content         : templateContent,
                studentEmails   : students.map( s => s.email ),
                status          : JobStatus.PENDING,
                workflowId      : workflow.id,
                filters         : filters ?? []
            },
            select : SELECT_EMAIL_LOG_SEND,
        });

        await this.recurrenceSender.scheduleMessages([{
            body: {
                workflowId      : workflow.id,
                cronRule,
                sendEmailLogId  : sendEmailLog.id,
            },
            contentType: 'application/json',
        }], firstRun );

        console.log( `✅ Workflow "${workflow.name}" programado para: ${firstRun.toISOString()}` );

        return {
            message     : isOnce
                ? "Envío único programado exitosamente"
                : "Workflow recurrente creado exitosamente",
            workflow,
            sendEmailLog,
            scheduledFor: firstRun.toISOString(),
            count       : students.length,
        };
    }


    async onModuleDestroy() {
        await this.sender.close();
        await this.recurrenceSender.close();
        await this.sbClient.close();
    }

}
