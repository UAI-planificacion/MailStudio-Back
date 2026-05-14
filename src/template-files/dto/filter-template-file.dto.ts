import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsEnum, 
    IsOptional 
}                              from 'class-validator';
import { AttachmentType }      from '@prisma/client';

import { PaginationFilterDto } from '@common/dto/pagination-filter.dto';


export class FilterTemplateFileDto extends PaginationFilterDto {

    @ApiPropertyOptional({
        description : 'Tipo de archivo adjunto',
        enum        : AttachmentType,
        example     : AttachmentType.PDF,
    })
    @IsOptional()
    @IsEnum( AttachmentType )
    type? : AttachmentType;

}
