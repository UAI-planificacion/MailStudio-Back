import { PartialType } from '@nestjs/mapped-types';
import {
    IsBoolean,
    IsOptional,
    IsString
} from 'class-validator';

import { SendEmailWorkflowDto } from '@send-emails/dto/send-email-workflow.dto';


export class UpdateWorkflowDto extends PartialType( SendEmailWorkflowDto ) {

    @IsBoolean( { message: 'El campo active debe ser un booleano' } )
    @IsOptional()
    active?: boolean;

    @IsString( { message: 'El campo updatedBy debe ser un string' } )
    @IsOptional()
    updatedBy?: string;

}
