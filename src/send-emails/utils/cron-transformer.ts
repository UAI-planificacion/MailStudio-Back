import { RecurrenceFrequency } from '@prisma/client';


export type FRECUENCY = RecurrenceFrequency;


export interface RecurrenceSettings {
    frequency   : FRECUENCY;
    hour        : number;
    minute      : number;
    daysOfWeek? : number[] | null; // [0-6]
    dayOfMonth? : number | null;   // [1-31]
}


export function transformToCron( settings:  RecurrenceSettings ): string {
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