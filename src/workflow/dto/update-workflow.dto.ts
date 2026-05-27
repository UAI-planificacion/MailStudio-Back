import { PartialType } from '@nestjs/mapped-types';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length
} from 'class-validator';

import { SendEmailWorkflowDto } from '@send-emails/dto/send-email-workflow.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


// export class UpdateWorkflowDto extends PartialType( SendEmailWorkflowDto ) {
export class UpdateWorkflowDto {

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

    @ApiProperty({
        description : "Si está activo",
        example     : "Debe proporcionar un valor boolean"
    })
    @IsBoolean( { message: 'El campo active debe ser un booleano' } )
    @IsOptional()
    active?: boolean;

    @ApiPropertyOptional( {
		description	: 'El ID del usuario que actualizó el flujo de trabajo (ULID)',
		example		: '01F8MECHZX3TBDFTGDHG4K1122'
	})
    @IsString( { message: 'El campo updatedBy debe ser un string' } )
    @IsOptional()
    updatedBy?: string;

}
