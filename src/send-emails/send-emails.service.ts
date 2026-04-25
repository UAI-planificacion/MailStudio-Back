import { Injectable, OnModuleInit, OnModuleDestroy, NotFoundException } from '@nestjs/common';

import {
    ServiceBusClient,
    ServiceBusSender
}                       from '@azure/service-bus';
import * as cronParser  from 'cron-parser';
import { JobStatus }    from '@prisma/client';

import { ENVS }                 from '@config/envs';
import { transformToCron }      from '@send-emails/utils/cron-transformer';
import { PrismaService }        from '@prisma/prisma.service';
import { SendEmailDto }         from '@send-emails/dto/send-email.dto';
import { SendEmailWorkflowDto } from '@send-emails/dto/send-email-workflow.dto';


@Injectable()
export class SendEmailsService implements OnModuleInit, OnModuleDestroy {
    private sbClient        : ServiceBusClient;
    private sender          : ServiceBusSender;
    private recurrenceSender: ServiceBusSender;


    constructor( 
        private readonly prisma: PrismaService,
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
        const { students, templateId, subject, cc, bcc, priority, staffId } = payload;

        const template = await this.prisma.template.findUnique({
            where: {
                id: templateId,
                active: true
            },
            select : {
                content: true,
            }
        });

        if ( !template ) throw new NotFoundException( "Template no encontrado" );

        const sendEmailLog = await this.prisma.sendEmailLog.create({
            data: {
                templateId,
                subject,
                staffId,
                priority,
                cc              : cc    ?? [],
                bcc             : bcc   ?? [],
                content         : template.content!,
                studentEmails   : students.map( s => s.email ),
                status          : JobStatus.PROCESSING,
            }
        });

        this.sendMassiveEmails( payload, sendEmailLog.id )
            .then( async () => {
                await this.prisma.sendEmailLog.update({
                    where: {
                        id: sendEmailLog.id
                    },
                    data: {
                        status: JobStatus.COMPLETED
                    }
                });
            })
            .catch( async ( err ) => {
                await this.prisma.sendEmailLog.update({
                    where: {
                        id: sendEmailLog.id
                    },
                    data: {
                        status  : JobStatus.FAILED,
                        message : err.message ?? "Error desconocido"
                    }
                });
            })

        return {
            message     : "Proceso de envío programado exitosamente",
            notification: { sendEmailLog },
            count       : students.length,
        };
    }

    // ========================= MASIVOS (inmediatos) =========================
    async sendMassiveEmails( payload: SendEmailDto, sendEmailLogId: string ): Promise<void> {
        const { students, templateId, subject, cc, bcc, priority } = payload;

        let batch = await this.sender.createMessageBatch();

        const sendPromises: Promise<void>[] = [];

        for ( const student of students ) {
            const message = {
                contentType : "application/json",
                body        : {
                    student,
                    templateId,
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

    // ========================= PROGRAMADOS (UN SOLO ENVÍO) =========================
    // async sendScheduledEmails( messages: PayloadEmail[], sendAt: Date ): Promise<Long[]> {
    //     const allSequenceNumbers: Long[] = [];

    //     let currentBatch: ServiceBusMessage[] = [];

    //     for ( const emailData of messages ) {
    //         currentBatch.push({
    //             body        : emailData,
    //             contentType : "application/json"
    //         });

    //         if ( currentBatch.length === 100 ) {
    //             // Pasamos los mensajes y la fecha por separado para evitar el error de argumentos
    //             const ids = await this.sender.scheduleMessages( currentBatch, sendAt );

    //             // Convertimos cada ID (tipo Long) a string para guardarlo fácil en la BD
    //             allSequenceNumbers.push( ...ids.map(id => id ));

    //             currentBatch = [];
    //         }
    //     }

    //     if ( currentBatch.length > 0 ) {
    //         const ids = await this.sender.scheduleMessages( currentBatch, sendAt );

    //         allSequenceNumbers.push(...ids.map( id => id ));
    //     }

    //     console.log(`${messages.length} correos programados para el ${sendAt.toISOString()}`);

    //     return allSequenceNumbers;
    // }


    // async sendScheduledEmails(
    //     messages    : PayloadEmail[],
    //     sendAt      : Date
    // ): Promise<Long[]> {
    //     const allSequenceNumbers: Long[] = [];

    //     // Usamos createMessageBatch solo para calcular el tamaño permitido
    //     let tempBatch = await this.sender.createMessageBatch();
    //     let currentBatch: ServiceBusMessage[] = [];

    //     // Usaremos Promise.all para que las peticiones de programación no bloqueen el bucle
    //     const schedulePromises: Promise<Long[]>[] = [];

    //     for (const emailData of messages) {
    //         const busMessage: ServiceBusMessage = {
    //             body: emailData,
    //             contentType: "application/json"
    //         };

    //         // Verificamos si el mensaje cabe en el tamaño del lote
    //         if (!tempBatch.tryAddMessage(busMessage)) {
    //             // Si no cabe, mandamos el lote actual a programar
    //             schedulePromises.push(this.sender.scheduleMessages(currentBatch, sendAt));

    //             // Reiniciamos lote temporal y array de mensajes
    //             tempBatch = await this.sender.createMessageBatch();
    //             currentBatch = [];

    //             // Añadimos el mensaje que no cupo
    //             tempBatch.tryAddMessage(busMessage);
    //             currentBatch.push(busMessage);
    //         } else {
    //             // Si cabe, lo añadimos al array que realmente enviaremos
    //             currentBatch.push(busMessage);
    //         }

    //         // Control de concurrencia: No satures el socket de red si son miles
    //         if (schedulePromises.length >= 5) {
    //             const results = await Promise.all(schedulePromises);
    //             results.forEach(ids => allSequenceNumbers.push(...ids));
    //             schedulePromises.length = 0;
    //         }
    //     }

    //     // Procesar el último lote restante
    //     if (currentBatch.length > 0) {
    //         schedulePromises.push(this.sender.scheduleMessages(currentBatch, sendAt));
    //     }

    //     const finalResults = await Promise.all(schedulePromises);
    //     finalResults.forEach(ids => allSequenceNumbers.push(...ids));

    //     console.log(`✅ ${messages.length} correos programados para el ${sendAt.toISOString()}`);
    //     return allSequenceNumbers;
    // }



    // ========================= Programado con o sin recurrencia =========================
    async startEmailWorkflow( payload: SendEmailWorkflowDto ) {

        


    }



    async scheduleWorkflowRecurrence( workflowId: string ) {
        // 1. Buscas en la DB los datos que guardó el Admin
        const workflow = await this.prisma.workflow.findUnique({
            where: { id: workflowId }
        });

        if ( !workflow ) return;

        // 2. Mapeas los campos de tu DB al formato del Transformer
        const cronRule = transformToCron({
            frequency   : workflow.frequency as any,
            hour        : workflow.hour,
            minute      : workflow.minute,
            daysOfWeek  : workflow.daysOfWeek,
            dayOfMonth  : workflow.dayOfMonth
        });

        // 3. Calculas la PRIMERA ejecución (para el trigger inicial)
        // const interval = cronParser.parseExpression(cronRule);
        const interval = (cronParser as any).parseExpression(cronRule);
        const firstRun = interval.next().toDate();

        // 4. "LLAMAS" AL WORKER enviando el mensaje al Service Bus
        // Nota: Aquí es donde el Worker recibirá el cronRule y el ID
        await this.recurrenceSender.scheduleMessages([{
            body: { 
                workflowId, 
                cronRule  // El Worker ahora tiene el motor cron listo
            },
            contentType: 'application/json'
        }], firstRun);

        console.log(`✅ Workflow ${workflow.name} programado con Cron: ${cronRule}`);
    }


    async cancelScheduledEmails( sequenceNumbers: Long[] ) {
        const idsToCancel = sequenceNumbers.map( id => id );
        await this.sender.cancelScheduledMessages( idsToCancel );
    }


    async onModuleDestroy() {
        await this.sender.close();
        await this.recurrenceSender.close();
        await this.sbClient.close();
    }

}
