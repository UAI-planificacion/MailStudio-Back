import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsString,
    Length
} from "class-validator";


export class SendEmailDto {

    @IsArray( { message: 'El campo emails debe ser un array' } )
    @IsString( { each: true, message: 'Todos los elementos de emails deben ser strings' } )
    @IsNotEmpty( { message: 'El campo emails no puede estar vacío' } )
    @ArrayMinSize( 1, { message: 'El campo emails debe tener al menos 1 correo' } )
    @ArrayMaxSize( 500000, { message: 'El campo emails puede tener un máximo de 500,000 correos' } )
    @IsEmail( {}, { each: true, message: 'Todos los correos deben tener un formato válido' } )
    @Length( 5, 200, { each: true, message: 'Cada correo debe tener entre 5 y 200 caracteres' } )
    emails: string[];

    @IsString( { message: 'El campo template debe ser un string' } )
    @IsNotEmpty( { message: 'El campo template no puede estar vacío' } )
    @Length( 1, 10000, { message: 'El campo template debe tener al menos 1 caracter y maximo 10000' } )
    template: string;

    @IsString( { message: 'El campo subject debe ser un string' } )
    @IsNotEmpty( { message: 'El campo subject no puede estar vacío' } )
    @Length( 1, 100, { message: 'El campo subject debe tener al menos 1 caracter y maximo 100' } )
    subject: string;

}


export class SendEmailScheduleDto extends SendEmailDto {
    @IsString( { message: 'El campo sendAt debe ser un string' } )
    @IsNotEmpty( { message: 'El campo sendAt no puede estar vacío' } )
    @Length( 1, 100, { message: 'El campo sendAt debe tener al menos 1 caracter y maximo 100' } )
    sendAt: string;
}