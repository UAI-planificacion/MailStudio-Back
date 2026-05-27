import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RecurrenceFrequency }              from "@prisma/client";

import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Length,
	Max,
	Min,
	ValidateNested
}               from "class-validator";
import { Type } from "class-transformer";

import { StudentDto } from "./send-email.dto";


export class SendEmailWorkflowDto {

	@ApiProperty( {
		description	: 'El nombre del flujo de trabajo',
		example		: 'Flujo de trabajo de Correo Semanal'
	} )
	@IsString( { message: 'El nombre debe ser texto' } )
	@Length( 5, 50, { message: 'El nombre debe tener entre 5 y 50 caracteres' } )
	@IsNotEmpty( { message: 'El nombre es requerido' } )
	name: string;

	@ApiPropertyOptional( {
		description	: 'La descripción del flujo de trabajo',
		example		: 'Flujo para enviar correos de seguimiento a los estudiantes'
	} )
	@IsString( { message: 'La descripción debe ser texto' } )
	@Length( 5, 200, { message: 'La descripción debe tener entre 5 y 200 caracteres' } )
	@IsOptional()
	description?: string;

	@ApiPropertyOptional( {
		description	: 'El asunto que tendrán los correos enviados',
		example		: 'Novedades de la semana'
	} )
	@IsString( { message: 'El asunto debe ser texto' } )
	@Length( 5, 50, { message: 'El asunto debe tener entre 5 y 50 caracteres' } )
	@IsOptional()
	subject?: string;

	@ApiPropertyOptional( {
		description	: 'Destinatarios en copia (CC)',
		example		: [ 'copia@ejemplo.com' ]
	} )
	@IsArray( { message: 'El CC debe ser un array' } )
	@IsString( { each: true, message: 'El CC debe ser un array de strings' } )
	@IsEmail( {}, { each: true, message: 'Todos los correos en cc deben ser válidos' } )
	@IsOptional()
	cc?: string[];

	@ApiPropertyOptional( {
		description	: 'Destinatarios en copia oculta (BCC)',
		example		: [ 'oculto@ejemplo.com' ]
	} )
	@IsArray( { message: 'El BCC debe ser un array' } )
	@IsString( { each: true, message: 'El BCC debe ser un array de strings' } )
	@IsEmail( {}, { each: true, message: 'Todos los correos en cc deben ser válidos' } )
	@IsOptional()
	bcc?: string[];

	@ApiPropertyOptional( {
		description	: 'El ID de la plantilla que se usará para el correo (ULID)',
		example		: '01F8MECHZX3TBDFTGDHG4K1122'
	} )
	@IsString( { message: 'El ID de la plantilla debe ser texto' } )
	@IsOptional()
	@Length( 26, 26, { message: 'El ID de la plantilla debe tener 26 caracteres' } )
	templateId?: string;

	@ApiPropertyOptional( {
		description	: 'El ID del archivo de plantilla de Excel que se usará (ULID)',
		example		: '01F8MECHZX3TBDFTGDHG4K1133'
	} )
	@IsString( { message: 'El ID de la plantilla de archivo debe ser texto' } )
	@IsOptional()
	@Length( 26, 26, { message: 'El ID de la plantilla de archivo debe tener 26 caracteres' } )
	templateFileId?: string;

	@ApiPropertyOptional( {
		description	: 'Fecha de inicio del envío o de la recurrencia',
		example		: '2026-05-27T15:37:39Z'
	} )
	@IsDate( { message: 'La fecha debe ser una fecha válida' } )
	@IsOptional()
	@Type( () => Date )
	date?: Date;

	@ApiPropertyOptional( {
		description	: 'Frecuencia de la recurrencia del envío',
		enum		: RecurrenceFrequency,
		example		: 'WEEKLY'
	} )
	@IsEnum( RecurrenceFrequency, { message: `La frecuencia debe ser una de las siguientes: ${Object.values( RecurrenceFrequency ).join( ', ' )}` } )
	@IsOptional()
	frequency?: RecurrenceFrequency;

	@ApiPropertyOptional( {
		description	: 'El intervalo de tiempo entre recurrencias',
		example		: 1
	} )
	@IsNumber( {}, { message: 'El intervalo debe ser un número' } )
	@IsOptional()
	@Min( 1 )
	@Max( 999999 )
	interval?: number;

	@ApiPropertyOptional( {
		description	: 'Los días de la semana en los que se enviará el correo (1 para Lunes, 7 para Domingo)',
		example		: [ 1, 3, 5 ]
	} )
	@IsArray( { message: 'Los días de la semana deben ser un array' } )
	@IsNumber( {}, { each: true, message: 'Los días de la semana deben ser números' } )
	@Min( 1, { each: true, message: 'Los días de la semana deben ser números entre 1 y 7' } )
	@Max( 7, { each: true, message: 'Los días de la semana deben ser números entre 1 y 7' } )
	@IsOptional()
	daysOfWeek?: number[];

	@ApiPropertyOptional( {
		description	: 'El día del mes en el que se enviará el correo (1 al 31)',
		example		: 15
	} )
	@IsNumber( {}, { message: 'El día del mes debe ser un número' } )
	@IsOptional()
	@Min( 1 )
	@Max( 31 )
	dayOfMonth?: number;

	@ApiPropertyOptional( {
		description	: 'El mes del año en el que se enviará el correo (1 al 12)',
		example		: 12
	} )
	@IsNumber( {}, { message: 'El mes debe ser un número' } )
	@IsOptional()
	@Min( 1 )
	@Max( 12 )
	monthOfYear?: number;

	@ApiProperty( {
		description	: 'La hora del día en la que se enviará el correo (0 a 23)',
		example		: 9
	} )
	@IsNumber( {}, { message: 'La hora debe ser un número' } )
	@IsNotEmpty( { message: 'La hora es requerida' } )
	@Min( 0 )
	@Max( 23 )
	hour: number;

	@ApiProperty( {
		description	: 'El minuto de la hora en el que se enviará el correo (0 a 59)',
		example		: 30
	} )
	@IsNumber( {}, { message: 'El minuto debe ser un número' } )
	@IsNotEmpty( { message: 'El minuto es requerido' } )
	@Min( 0 )
	@Max( 59 )
	minute: number;

	@ApiPropertyOptional( {
		description	: 'Indica si el envío recurrente debe realizarse el último día del mes',
		example		: false
	} )
	@IsBoolean( { message: 'El campo lastDayOfMonth debe ser un booleano' } )
	@IsOptional()
	lastDayOfMonth?: boolean;

	@ApiPropertyOptional( {
		description	: 'Número máximo de veces que se ejecutará el envío recurrente',
		example		: 10
	} )
	@IsNumber( {}, { message: 'El campo occurrences debe ser un número' } )
	@IsOptional()
	@Min( 0 )
	@Max( 999999 )
	occurrences?: number;

	@ApiPropertyOptional( {
		description	: 'Fecha límite hasta la cual se repetirá el envío recurrent',
		example		: '2026-12-31T23:59:59Z'
	} )
	@IsDate( { message: 'El campo repeatUntil debe ser una fecha válida' } )
	@IsOptional()
	@Type( () => Date )
	repeatUntil?: Date;

	@ApiPropertyOptional( {
		description	: 'Indica si el envío recurrente nunca expira',
		example		: true
	} )
	@IsBoolean( { message: 'El campo neverEnds debe ser un booleano' } )
	@IsOptional()
	neverEnds?: boolean;

	@ApiProperty( {
		description	: 'Lista de estudiantes destinatarios del envío de correo',
		type		: [ StudentDto ]
	} )
	@IsArray( { message: 'El campo students debe ser un array' } )
	@IsNotEmpty( { message: 'El campo students no puede estar vacío' } )
	@ArrayMinSize( 1, { message: 'El campo students debe tener al menos 1 estudiante' } )
	@ArrayMaxSize( 500000, { message: 'El campo students puede tener un máximo de 500,000 estudiantes' } )
	@ValidateNested( { each: true } )
	@Type( () => StudentDto )
	students: StudentDto[];

	@ApiPropertyOptional( {
		description	: 'Filtros aplicados para segmentar a los estudiantes',
		example		: { carrera: [ 'Ingeniería' ] }
	} )
	@IsObject( { message: 'El campo filters debe ser un objeto' } )
	@IsOptional()
	filters?: Record<string, string[]>;

	@ApiProperty( {
		description	: 'El ID del usuario que creó el flujo de trabajo (ULID)',
		example		: '01F8MECHZX3TBDFTGDHG4K1122'
	} )
	@IsString( { message: 'El campo createdBy debe ser un string' } )
	@Length( 26, 26, { message: 'El campo createdBy debe tener 26 caracteres' } )
	@IsNotEmpty( { message: 'El campo createdBy no puede estar vacío' } )
	createdBy: string;

}
