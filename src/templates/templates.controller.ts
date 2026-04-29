import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query
}                           from '@nestjs/common';

import { PaginationDto }    from '@common/dto/pagination.dto';
import { TemplatesService }  from '@templates/templates.service';
import { CreateTemplateDto } from '@templates/dto/create-template.dto';
import { UpdateTemplateDto } from '@templates/dto/update-template.dto';


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
	findGeneratedTemplate(
        @Param( 'id' ) id : string
    ) {
		return this.templatesService.findTemplate( id );
	}


    @Get( '/staff/:id' )
	findAll(
        @Param( 'id' ) id : string,
		@Query() paginationDto : PaginationDto,
		@Query( 'name' ) name? : string
    ) {
		return this.templatesService.findAll( id, paginationDto, name );
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
