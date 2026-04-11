import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { TemplatesService }     from '@templates/templates.service';
import { CreateTemplateDto }    from '@templates/dto/create-template.dto';
import { UpdateTemplateDto }    from '@templates/dto/update-template.dto';


@Controller( 'templates' )
export class TemplatesController {

	constructor( private readonly templatesService: TemplatesService ) {}

	@Post()
	create(
        @Body() createTemplateDto: CreateTemplateDto
    ) {
		return this.templatesService.create( createTemplateDto );
	}


    @Get( '/staff/:id' )
	findAll(
        @Param( 'id' ) id: string
    ) {
		return this.templatesService.findAll( id );
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
