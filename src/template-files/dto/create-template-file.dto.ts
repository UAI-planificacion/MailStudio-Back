import { ApiProperty } from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsString,
    Length
} from 'class-validator';

import { UploadFileDto } from '@common/dto/upload-file.dto';


export class CreateTemplateFileDto extends UploadFileDto {

    @ApiProperty({
        description : 'Nombre del archivo',
        example     : 'mi-archivo',
        minLength   : 1,
        maxLength   : 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length( 1, 100 )
    name : string;

    @ApiProperty({
        description : 'ID del creador',
        example     : '01F8MECHZX3TBDSZ7XRADM79XE',
    })
    @IsString()
    @IsNotEmpty()
    createdBy : string;

}
