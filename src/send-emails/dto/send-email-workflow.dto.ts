import { RecurrenceFrequency } from "@prisma/client";

import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    ValidateNested
}               from "class-validator";
import { Type } from "class-transformer";

import { StudentDto } from "./send-email.dto";


export class SendEmailWorkflowDto {

    @IsString({ message: 'El nombre debe ser texto' })
    @Length( 5, 50, { message: 'El nombre debe tener entre 5 y 50 caracteres' } )
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;

    @IsString({ message: 'La descripción debe ser texto' })
    @Length( 5, 200, { message: 'La descripción debe tener entre 5 y 200 caracteres' } )
    @IsOptional()
    description?: string;

    @IsString({ message: 'El asunto debe ser texto' })
    @Length( 5, 50, { message: 'El asunto debe tener entre 5 y 50 caracteres' } )
    @IsOptional()
    subject?: string;

    @IsArray( { message: 'El CC debe ser un array' } )
    @IsString({ each: true, message: 'El CC debe ser un array de strings' })
    @IsOptional()
    cc?: string[];

    @IsArray({ message: 'El BCC debe ser un array' })
    @IsString({ each: true, message: 'El BCC debe ser un array de strings' })
    @IsOptional()
    bcc?: string[];

    @IsString({ message: 'El ID de la plantilla debe ser texto' })
    @IsNotEmpty({ message: 'El ID de la plantilla es requerido' })
    @Length( 26, 26, { message: 'El ID de la plantilla debe tener 26 caracteres' } )
    templateId: string;

    @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
    @IsOptional()
    @Type( () => Date )
    date?: Date;

    @IsEnum( RecurrenceFrequency, { message: `La frecuencia debe ser una de las siguientes: ${Object.values( RecurrenceFrequency ).join( ', ' )}` })
    @IsOptional()
    frequency?: RecurrenceFrequency;

    @IsNumber({}, { message: 'El intervalo debe ser un número' })
    @IsOptional()
    interval?: number;

    @IsArray({ message: 'Los días de la semana deben ser un array' })
    @IsNumber({}, { each: true, message: 'Los días de la semana deben ser números' })
    @IsOptional()
    daysOfWeek?: number[];

    @IsNumber({}, { message: 'El día del mes debe ser un número' })
    @IsOptional()
    dayOfMonth?: number;

    @IsNumber({}, { message: 'El mes debe ser un número' })
    @IsOptional()
    monthOfYear?: number;

    @IsNumber({}, { message: 'La hora debe ser un número' })
    @IsNotEmpty({ message: 'La hora es requerida' })
    hour: number;

    @IsNumber({}, { message: 'El minuto debe ser un número' })
    @IsNotEmpty({ message: 'El minuto es requerido' })
    minute: number;

    @IsBoolean({ message: 'El campo lastDayOfMonth debe ser un booleano' })
    @IsOptional()
    lastDayOfMonth?: boolean;

    @IsNumber({}, { message: 'El campo occurrences debe ser un número' })
    @IsOptional()
    occurrences?: number;

    @IsDateString({}, { message: 'El campo repeatUntil debe ser una fecha válida' })
    @IsOptional()
    @Type( () => Date )
    repeatUntil?: Date;

    @IsBoolean({ message: 'El campo neverEnds debe ser un booleano' })
    @IsOptional()
    neverEnds?: boolean;

    @IsArray( { message: 'El campo students debe ser un array' } )
    @IsNotEmpty( { message: 'El campo students no puede estar vacío' } )
    @ArrayMinSize( 1, { message: 'El campo students debe tener al menos 1 estudiante' } )
    @ArrayMaxSize( 500000, { message: 'El campo students puede tener un máximo de 500,000 estudiantes' } )
    @ValidateNested( { each: true } )
    @Type( () => StudentDto )
    students: StudentDto[];

    @IsString( { message: 'El campo createdBy debe ser un string' } )
    @Length( 26, 26, { message: 'El campo createdBy debe tener 26 caracteres' } )
    @IsNotEmpty( { message: 'El campo createdBy no puede estar vacío' } )
    createdBy: string;

}
