import { ApiProperty } from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsString,
    Length
} from 'class-validator';


export class UpdateTemplateFileDto {

    @ApiProperty({
        description : 'ID del creador',
        example     : '01F8MECHZX3TBDSZ7XRADM79XE',
    })
    @IsString()
    @IsNotEmpty()
    @Length( 26, 26 )
    updatedBy : string;

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

}
