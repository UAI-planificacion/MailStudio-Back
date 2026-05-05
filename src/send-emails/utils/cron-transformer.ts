import { RecurrenceFrequency } from '@prisma/client';
import * as cronParser         from 'cron-parser';


export type FRECUENCY = RecurrenceFrequency;


export interface RecurrenceSettings {
    frequency      : FRECUENCY;
    hour           : number;
    minute         : number;
    daysOfWeek?    : number[] | null; // [0-6]
    dayOfMonth?    : number | null;   // [1-31]
    lastDayOfMonth?: boolean | null;
}


export function transformToCron( settings: RecurrenceSettings ): string {
    const { frequency, hour, minute, daysOfWeek, dayOfMonth } = settings;

    switch ( frequency ) {
        case 'DAILY':
            // "Minuto Hora * * *" -> Todos los días a la misma hora
            return `${minute} ${hour} * * *`;

        case 'WEEKLY':
            // "Minuto Hora * * Días" -> Ej: 30 8 * * 1,3
            const days = daysOfWeek && daysOfWeek.length > 0 ? daysOfWeek.join(',') : '*';
            return `${minute} ${hour} * * ${days}`;

        case 'MONTHLY':
            // "Minuto Hora Día * *" -> Ej: 0 10 1 * *
            const day = dayOfMonth || 1;
            return `${minute} ${hour} ${day} * *`;

        case 'ONCE':
            // Si es una sola vez, realmente no es cron, pero para el bus sirve:
            return `${minute} ${hour} ${dayOfMonth} * *`;

        default:
            throw new Error( 'Frecuencia no soportada' );
    }
}


/**
 * Calcula la fecha del último día de un mes dado.
 */
function getLastDayOfMonth( year: number, month: number ): number {
    return new Date( year, month + 1, 0 ).getDate();
}


/**
 * Calcula la próxima fecha de ejecución.
 * Si `lastDayOfMonth` es true, calcula manualmente el último día del mes siguiente.
 * En caso contrario, usa cron-parser.
 */
export function calculateNextRunDate( settings: RecurrenceSettings ): Date {
    const { lastDayOfMonth, hour, minute } = settings;

    if ( lastDayOfMonth ) {
        const now       = new Date();
        let targetYear  = now.getFullYear();
        let targetMonth = now.getMonth() + 1; // Próximo mes

        if ( targetMonth > 11 ) {
            targetMonth = 0;
            targetYear++;
        }

        const lastDay = getLastDayOfMonth( targetYear, targetMonth );
        const nextRun = new Date( targetYear, targetMonth, lastDay, hour, minute, 0, 0 );

        // Si la fecha calculada ya pasó, avanzar un mes más
        if ( nextRun <= now ) {
            targetMonth++;
            if ( targetMonth > 11 ) {
                targetMonth = 0;
                targetYear++;
            }
            const nextLastDay = getLastDayOfMonth( targetYear, targetMonth );
            return new Date( targetYear, targetMonth, nextLastDay, hour, minute, 0, 0 );
        }

        return nextRun;
    }

    const cronRule = transformToCron( settings );
    const interval = ( cronParser as any ).parseExpression( cronRule );
    return interval.next().toDate();
}