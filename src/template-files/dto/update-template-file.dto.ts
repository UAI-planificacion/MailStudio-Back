import { PartialType } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsString 
}                      from 'class-validator';

import { CreateTemplateFileDto } from './create-template-file.dto';


export class UpdateTemplateFileDto extends PartialType( CreateTemplateFileDto ) {

    @IsString()
    @IsNotEmpty()
    updatedBy : string;

}
