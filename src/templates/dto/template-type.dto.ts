import { IsEnum, IsOptional, IsString } from "class-validator";

import { TemplateType } from "@templates/interfaces/template-response.interface";


export class TemplateTypeDto {

    @IsString()
    @IsEnum( TemplateType )
    @IsOptional()
    type?: TemplateType = TemplateType.TEMPLATE;

}

