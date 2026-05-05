import { BadRequestException, Injectable } from '@nestjs/common';

import { RecurrenceFrequency } from '@prisma/client';

import { SendEmailWorkflowDto } from '@send-emails/dto/send-email-workflow.dto';
import { UpdateWorkflowDto }    from '@workflow/dto/update-workflow.dto';


@Injectable()
export class WorkflowValidationService {

    #frecuencyDaily( workflow: SendEmailWorkflowDto | UpdateWorkflowDto ): void {
        if ( 
            ( workflow.daysOfWeek && workflow.daysOfWeek.length > 0 ) || 
            workflow.dayOfMonth || 
            workflow.monthOfYear || 
            workflow.lastDayOfMonth 
        ) {
            throw new BadRequestException( 'Para frecuencia DIARIA, solo puede configurar el intervalo. No envíe daysOfWeek, dayOfMonth, monthOfYear ni lastDayOfMonth.' );
        }
    }


    #frecuencyWeekly( workflow: SendEmailWorkflowDto | UpdateWorkflowDto ): void {
        if ( workflow.dayOfMonth || workflow.monthOfYear || workflow.lastDayOfMonth ) {
            throw new BadRequestException( 'Para frecuencia SEMANAL, no envíe dayOfMonth, monthOfYear ni lastDayOfMonth.' );
        }

        if ( !workflow.daysOfWeek || workflow.daysOfWeek.length === 0 ) {
            throw new BadRequestException( 'Para frecuencia SEMANAL, debe especificar daysOfWeek.' );
        }
    }


    #frecuencyMonthly( workflow: SendEmailWorkflowDto | UpdateWorkflowDto ): void {
        if (( workflow.daysOfWeek && workflow.daysOfWeek.length > 0 ) || workflow.monthOfYear ) {
            throw new BadRequestException( 'Para frecuencia MENSUAL, no envíe daysOfWeek ni monthOfYear.' );
        }

        if ( workflow.dayOfMonth && workflow.lastDayOfMonth ) {
            throw new BadRequestException( 'Para frecuencia MENSUAL, no puede enviar dayOfMonth y lastDayOfMonth al mismo tiempo.' );
        }

        if ( !workflow.dayOfMonth && !workflow.lastDayOfMonth ) {
            throw new BadRequestException( 'Para frecuencia MENSUAL, debe especificar dayOfMonth o lastDayOfMonth.' );
        }
    }


    #frecuencyYearly( workflow: SendEmailWorkflowDto | UpdateWorkflowDto ): void {
        if (( workflow.daysOfWeek && workflow.daysOfWeek.length > 0 ) || workflow.lastDayOfMonth ) {
            throw new BadRequestException( 'Para frecuencia ANUAL, no envíe daysOfWeek ni lastDayOfMonth.' );
        }

        if ( !workflow.monthOfYear || !workflow.dayOfMonth ) {
            throw new BadRequestException( 'Para frecuencia ANUAL, debe especificar monthOfYear y dayOfMonth.' );
        }
    }


    #frecuencyOnce( workflow: SendEmailWorkflowDto | UpdateWorkflowDto ): void {
        if ( !workflow.date ) {
            throw new BadRequestException( 'Para ejecución ÚNICA (ONCE), debe especificar la fecha (date).' );
        }

        if ( new Date( workflow.date ) <= new Date() ) {
            throw new BadRequestException( 'La fecha debe ser mayor a la fecha actual.' );
        }

        if (
            workflow.interval
            || ( workflow.daysOfWeek && workflow.daysOfWeek.length > 0 )
            || workflow.dayOfMonth
            || workflow.monthOfYear
            || workflow.lastDayOfMonth
        ) {
            throw new BadRequestException( 'Para ejecución ÚNICA, no aplican campos de recurrencia (interval, daysOfWeek, etc.).' );
        }
    }


    validate( workflow: SendEmailWorkflowDto | UpdateWorkflowDto ): void {
        // 1. Validar condiciones de finalización (occurrences, repeatUntil, neverEnds)
        // Solo puede venir UNO de los 3.
        let endConditionsCount = 0;

        if ( workflow.occurrences !== undefined && workflow.occurrences !== null ) {
            endConditionsCount++;
        }

        if ( workflow.repeatUntil !== undefined && workflow.repeatUntil !== null ) {
            endConditionsCount++;
        }

        if ( workflow.neverEnds === true ) {
            endConditionsCount++;
        }

        if ( endConditionsCount > 1 ) {
            throw new BadRequestException( 'Solo puede definir una condición de finalización: occurrences, repeatUntil o neverEnds.' );
        }

        // 2. Validar restricciones lógicas según la frecuencia
        const frequency = workflow.frequency || RecurrenceFrequency.ONCE;

        switch ( frequency ) {
            case RecurrenceFrequency.DAILY:
                this.#frecuencyDaily( workflow );
            break;

            case RecurrenceFrequency.WEEKLY:
                this.#frecuencyWeekly( workflow );
            break;

            case RecurrenceFrequency.MONTHLY:
                this.#frecuencyMonthly( workflow );
            break;

            case RecurrenceFrequency.YEARLY:
                this.#frecuencyYearly( workflow );
            break;

            case RecurrenceFrequency.ONCE:
                this.#frecuencyOnce( workflow );
            break;

            default:
                throw new BadRequestException( `Frecuencia inválida: ${workflow.frequency}` );
        }
    }

}
