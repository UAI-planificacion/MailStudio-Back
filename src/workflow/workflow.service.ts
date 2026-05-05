import { Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus } from '@prisma/client';

import { PrismaService }         from '@prisma/prisma.service';
import { SELECT_EMAIL_LOG_SEND } from '@send-email-logs/utils/select';


@Injectable()
export class WorkflowService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}


    async findAll() {
        return await this.prisma.workflow.findMany();
    }


    async findOne( id: string ) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id },
            include: {
                template: {
                    select: {
                        id      : true,
                        content : true,
                    }
                }
            }
        });

        if ( !workflow ) throw new NotFoundException( "Workflow no encontrado" );

        return workflow;
    }


    /**
     * Llamado por el Worker para preparar la siguiente ejecución de un workflow recurrente.
     * - Verifica que el workflow siga activo
     * - Verifica límites de recurrencia (occurrences, repeatUntil)
     * - Crea un nuevo SendEmailLog (PENDING) para la próxima ejecución
     */
    async prepareExecution( workflowId: string ) {
        const workflow = await this.prisma.workflow.findUnique({
            where   : { id: workflowId },
            include : {
                template: {
                    select: {
                        content : true,
                    }
                }
            }
        });

        if ( !workflow ) {
            return { shouldStop: true, reason: "Workflow no encontrado" };
        }

        if ( !workflow.active ) {
            return { shouldStop: true, reason: "Workflow desactivado por el admin" };
        }

        // Verificar límite de occurrences
        if ( workflow.occurrences ) {
            const executionCount = await this.prisma.sendEmailLog.count({
                where: { workflowId }
            });

            if ( executionCount >= workflow.occurrences ) {
                await this.prisma.workflow.update({
                    where : { id: workflowId },
                    data  : { active: false },
                });

                return { shouldStop: true, reason: `Límite de ${workflow.occurrences} ejecuciones alcanzado` };
            }
        }

        // Verificar repeatUntil
        if ( workflow.repeatUntil && new Date() >= workflow.repeatUntil ) {
            await this.prisma.workflow.update({
                where : { id: workflowId },
                data  : { active: false },
            });

            return { shouldStop: true, reason: "Fecha de repeatUntil alcanzada" };
        }

        // Crear nuevo SendEmailLog para la próxima ejecución
        const students      = workflow.students as { email: string; name?: string }[];
        const studentEmails = students.map( s => s.email );

        const sendEmailLog = await this.prisma.sendEmailLog.create({
            data: {
                templateId    : workflow.templateId,
                subject       : workflow.subject ?? "",
                staffId       : workflow.createdBy,
                cc            : workflow.cc,
                bcc           : workflow.bcc,
                content       : workflow.template.content!,
                studentEmails,
                status        : JobStatus.PENDING,
                workflowId,
            },
            select: SELECT_EMAIL_LOG_SEND,
        });

        return {
            shouldStop     : false,
            sendEmailLogId : sendEmailLog.id,
        };
    }

}

