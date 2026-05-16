import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query
}                   from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';


import { PaginationFilterDto }  from '@common/dto/pagination-filter.dto';
import { TemplatesService }     from '@templates/templates.service';
import { CreateTemplateDto }    from '@templates/dto/create-template.dto';
import { UpdateTemplateDto }    from '@templates/dto/update-template.dto';
import { TemplateType }         from '@templates/interfaces/template-response.interface';
import { TemplateTypeDto }      from '@templates/dto/template-type.dto';


@Controller( 'templates' )
export class TemplatesController {

	constructor( private readonly templatesService : TemplatesService ) {}

	@Post()
	create(
        @Body() createTemplateDto : CreateTemplateDto
    ) {
		return this.templatesService.create( createTemplateDto );
	}


    @Get( '/generated/:id' )
    @ApiQuery({
        name: "type",
        description: "Type of template",
        enum: TemplateType,
        required: false,
        default: TemplateType.TEMPLATE
    })
	findGeneratedTemplate(
        @Param( 'id' ) id     : string,
        @Query() templateDto  : TemplateTypeDto,
    ) {
		return this.templatesService.findTemplate( id, templateDto.type! );
	}


    @Get( '/staff/:id' )
	findAll(
        @Param( 'id' ) id : string,
		@Query() paginationFilterDto : PaginationFilterDto,
    ) {
		return this.templatesService.findAll( id, paginationFilterDto );
	}


    @Get( ':id' )
	findOne(
        @Param( 'id' ) id: string
    ) {
		return this.templatesService.findOne( id );
	}


    @Patch( ':id' )
	update(
        @Param( 'id' ) id: string,
        @Body() updateTemplateDto: UpdateTemplateDto
    ) {
		return this.templatesService.update( id, updateTemplateDto );
	}


    @Delete( ':id' )
	remove(
        @Param( 'id' ) id: string
    ) {
		return this.templatesService.remove( id );
	}

}
