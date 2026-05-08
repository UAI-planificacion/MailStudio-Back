import {
    ArrayMaxSize,
    IsEmail,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    Length,
    MaxLength
} from 'class-validator';


export class CreateTemplateDto {

	@IsString({ message: 'El campo name debe ser un string' })
	@IsNotEmpty()
	@Length( 3, 50, { message: 'El campo name debe tener un mínimo de 3 y un máximo de 50 caracteres' } )
	name: string;

	@IsObject({ message: 'El campo content debe ser un objeto' })
	@IsNotEmpty({ message: 'El campo content no puede estar vacío' })
	content: Record<string, any>;

	@IsString({ message: 'El campo createdBy debe ser un string' })
	@IsNotEmpty({ message: 'El campo createdBy no puede estar vacío' })
    @Length( 26, 26, { message: 'El campo createdBy debe tener 26 caracteres' } )
	createdBy: string;

	@IsString({ message: 'El campo updatedBy debe ser un string' })
	@IsOptional()
    @Length( 26, 26, { message: 'El campo updatedBy debe tener un máximo de 26 caracteres' } )
	updatedBy?: string;

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

    @IsOptional()
    @IsString( { each: true, message: 'Todos los elementos de images deben ser strings' } )
    @Length( 26, 26, { each: true, message: 'Cada elemento de images debe ser un ID de imagen válido (26 caracteres)' } )
    @ArrayMaxSize( 20, { message: 'El campo images puede tener un máximo de 20 elementos' } )
    images?: string[];

}
