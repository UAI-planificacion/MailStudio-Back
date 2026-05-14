import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete,
    Query,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { TemplateFilesService }  from './template-files.service';
import { CreateTemplateFileDto } from './dto/create-template-file.dto';
import { UpdateTemplateFileDto } from './dto/update-template-file.dto';
import { FilterTemplateFileDto } from './dto/filter-template-file.dto';


@ApiTags( 'Template Files' )
@Controller( 'template-files' )
export class TemplateFilesController {

	constructor( private readonly templateFilesService : TemplateFilesService ) {}


	@Post()
    @ApiConsumes( 'multipart/form-data' )
    @ApiBody({ type : CreateTemplateFileDto })
    @UseInterceptors( FileInterceptor( 'file' ))
	create(
		@Body() createTemplateFileDto : CreateTemplateFileDto,
        @UploadedFile( ) file         : Express.Multer.File,
	) {
		return this.templateFilesService.create( createTemplateFileDto, file );
	}


	@Get()
	findAll(
		@Query() filterDto : FilterTemplateFileDto
	) {
		return this.templateFilesService.findAll( filterDto );
	}


	@Get( ':id' )
	findOne( @Param( 'id' ) id : string ) {
		return this.templateFilesService.findOne( id );
	}


	@Patch( ':id' )
	update( 
		@Param( 'id' ) id             : string, 
		@Body() updateTemplateFileDto : UpdateTemplateFileDto 
	) {
		return this.templateFilesService.update( id, updateTemplateFileDto );
	}


	@Delete( ':id' )
	remove( @Param( 'id' ) id : string ) {
		return this.templateFilesService.remove( id );
	}

}
