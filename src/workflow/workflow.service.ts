import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, JobStatus, Workflow } from '@prisma/client';

import { PaginatedResult }          from '@common/interfaces/paginated-result.interface';

import { PrismaService }            from '@prisma/prisma.service';
import { SELECT_EMAIL_LOG_SEND }    from '@send-email-logs/utils/select';
import { UpdateWorkflowDto }        from '@workflow/dto/update-workflow.dto';
import { StudentDto }               from '@send-emails/dto/send-email.dto';
import { SendEmailWorkflowDto }     from '@send-emails/dto/send-email-workflow.dto';
import { WorkflowValidationService } from '@common/service/workflow';
import { FindAllWorkflowDto }        from './dto/find-all-workflow.dto';


@Injectable()
export class WorkflowService {

    #studentsToJson( students: StudentDto[] ) {
        return students.map( student => ({
            email : student.email,
            name  : student.name,
        }));
    }

    constructor(
        private readonly prisma: PrismaService,
        private readonly workflowValidationService: WorkflowValidationService,
    ) {}


    async findAll( query: FindAllWorkflowDto ): Promise<PaginatedResult<Workflow>> {
        const { page = 1, size = 10, name, frequency, createdBy, active } = query;

        const where: Prisma.WorkflowWhereInput = {
            name      : name ? { contains: name, mode: 'insensitive' } : undefined,
            frequency : frequency,
            createdBy : createdBy,
            active    : active,
        };

        const [ total, data ] = await Promise.all([
            this.prisma.workflow.count( { where } ),
            this.prisma.workflow.findMany({
                where,
                skip    : ( page - 1 ) * size,
                take    : size,
                orderBy : { createdAt: 'desc' },
            }),
        ]);

        return {
            data,
            meta : {
                total,
                page,
                size,
                totalPages : Math.ceil( total / size ),
            },
        };
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


    async create( createWorkflowDto: SendEmailWorkflowDto ) {
        this.workflowValidationService.validate( createWorkflowDto );

        return await this.prisma.workflow.create({
            data : {
                ...createWorkflowDto,
                students : this.#studentsToJson( createWorkflowDto.students ),
            }
        });
    }


    async update( id: string, updateWorkflowDto: UpdateWorkflowDto ) {
        this.workflowValidationService.validate( updateWorkflowDto );

        await this.findOne( id );

        return await this.prisma.workflow.update({
            where : { id },
            data  : {
                ...updateWorkflowDto,
                students : updateWorkflowDto.students
                    ? this.#studentsToJson( updateWorkflowDto.students )
                    : undefined,
            }
        });
    }


    async remove( id: string ) {
        await this.findOne( id );

        const hasLogs = await this.prisma.sendEmailLog.findFirst({
            where: { workflowId: id }
        });

        if ( hasLogs ) {
            return await this.prisma.workflow.update({
                where : { id },
                data  : { active: false }
            });
        }

        return await this.prisma.workflow.delete({
            where: { id }
        });
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
