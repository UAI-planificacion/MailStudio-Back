import { ApiPropertyOptional } from "@nestjs/swagger";

import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString
}                       from "class-validator";
import { Transform }    from "class-transformer";

import { TemplateType } from "@templates/interfaces/template-response.interface";


export class TemplateTypeDto {

    @IsString()
    @IsEnum( TemplateType )
    @IsOptional()
    type?: TemplateType = TemplateType.TEMPLATE;

    @ApiPropertyOptional({ description: 'Mostrar botón de contenido global', default: true })
    @IsOptional()
    @Transform( ( { value } ) => value === 'true' || value === true )
    @IsBoolean( { message: 'El campo showButtonContent debe ser un booleano' } )
    showButtonContent?: boolean = true;

}
