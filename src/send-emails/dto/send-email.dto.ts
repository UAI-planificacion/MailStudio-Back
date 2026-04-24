import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    ValidateNested
} from "class-validator";


export class StudentDto {
    @IsString( { message: 'El campo name debe ser un string' } )
    @IsNotEmpty( { message: 'El campo name no puede estar vacío' } )
    @Length( 1, 100, { message: 'El campo name debe tener al menos 1 caracter y maximo 100' } )
    name: string;

    @IsString( { message: 'El campo email debe ser un string' } )
    @IsNotEmpty( { message: 'El campo email no puede estar vacío' } )
    @Length( 1, 200, { message: 'El campo email debe tener al menos 1 caracter y maximo 200' } )
    @IsEmail( {}, { message: 'El email debe tener un formato válido' } )
    email: string;
}


export enum Priority {
    NORMAL = "NORMAL",
    HIGH   = "HIGH"
}


export class SendEmailDto {

    @IsArray( { message: 'El campo students debe ser un array' } )
    @IsNotEmpty( { message: 'El campo students no puede estar vacío' } )
    @ArrayMinSize( 1, { message: 'El campo students debe tener al menos 1 estudiante' } )
    @ArrayMaxSize( 500000, { message: 'El campo students puede tener un máximo de 500,000 estudiantes' } )
    @ValidateNested( { each: true } )
    @Type( () => StudentDto )
    students: StudentDto[];

    @IsString( { message: 'El campo templateId debe ser un string' } )
    @IsNotEmpty( { message: 'El campo templateId no puede estar vacío' } )
    @Length( 26, 26, { message: 'El campo templateId debe tener 26 caracteres' } )
    templateId: string;

    @IsString( { message: 'El campo subject debe ser un string' } )
    @IsNotEmpty( { message: 'El campo subject no puede estar vacío' } )
    @Length( 1, 100, { message: 'El campo subject debe tener al menos 1 caracter y maximo 100' } )
    subject: string;


    @IsEnum( Priority, { message: 'El campo priority debe ser NORMAL o HIGH' } )
    @IsOptional()
    priority?: Priority;


    @IsOptional()
    @IsString( { each: true, message: 'Todos los elementos de cc deben ser strings' } )
    @ArrayMaxSize( 10, { message: 'El campo cc puede tener un máximo de 10 destinatarios' } )
    @IsEmail( {}, { each: true, message: 'Todos los correos deben tener un formato válido' } )
    cc?: string[];

    @IsOptional()
    @IsString( { each: true, message: 'Todos los elementos de bcc deben ser strings' } )
    @ArrayMaxSize( 10, { message: 'El campo bcc puede tener un máximo de 10 destinatarios' } )
    @IsEmail( {}, { each: true, message: 'Todos los correos deben tener un formato válido' } )
    bcc?: string[];


    @IsString( { message: 'El campo staffId debe ser un string' } )
    @Length( 26, 26, { message: 'El campo staffId debe tener 26 caracteres' } )
    @IsNotEmpty( { message: 'El campo staffId no puede estar vacío' } )
    staffId: string;
}


export class SendEmailScheduleDto extends SendEmailDto {
    @IsString( { message: 'El campo sendAt debe ser un string' } )
    @IsNotEmpty( { message: 'El campo sendAt no puede estar vacío' } )
    @Length( 1, 100, { message: 'El campo sendAt debe tener al menos 1 caracter y maximo 100' } )
    sendAt: string;
}