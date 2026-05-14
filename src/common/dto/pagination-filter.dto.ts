import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsOptional, 
    IsString, 
    Length 
}                             from 'class-validator';

import { PaginationDto }      from '@common/dto/pagination.dto';


export class PaginationFilterDto extends PaginationDto {

    @ApiPropertyOptional({
        description : 'Nombre a buscar',
        example     : 'mi-imagen',
        minLength   : 1,
        maxLength   : 100,
    })
    @IsOptional()
    @IsString()
    @Length( 0, 100 )
    name? : string;

}
