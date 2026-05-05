import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto }      from '@common/dto/pagination.dto';
import { RecurrenceFrequency } from '@prisma/client';
import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString
}                       from 'class-validator';
import { Transform }    from 'class-transformer';


export class FindAllWorkflowDto extends PaginationDto {

    @ApiPropertyOptional({ description: 'Filtrar por nombre' })
    @IsOptional()
    @IsString( { message: 'El nombre debe ser un string' } )
    name? : string;

    @ApiPropertyOptional({
        description : 'Filtrar por frecuencia',
        enum        : RecurrenceFrequency,
    })
    @IsOptional()
    @IsEnum( RecurrenceFrequency, { message: 'Frecuencia inválida' } )
    frequency? : RecurrenceFrequency;

    @ApiPropertyOptional({ description: 'Filtrar por ID del creador' })
    @IsOptional()
    @IsString( { message: 'El ID del creador debe ser un string' } )
    createdBy? : string;

    @ApiPropertyOptional({ description: 'Filtrar por estado activo' })
    @IsOptional()
    @Transform( ( { value } ) => value === 'true' || value === true )
    @IsBoolean( { message: 'El campo active debe ser un booleano' } )
    active? : boolean;

}
