import { ApiProperty } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsString, 
    Length 
}               from 'class-validator';


export class ImageParamsDto {

    @ApiProperty({ 
        description : 'Nombre de la imagen en la URL',
        example     : 'mi-imagen-01',
        minLength   : 1,
        maxLength   : 50,
    })
    @IsString()
    @IsNotEmpty()
    @Length( 1, 50 )
    nameImg : string;

}
