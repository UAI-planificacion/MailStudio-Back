import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseInterceptors, 
    UploadedFile,
    Query
}                           from '@nestjs/common';
import { 
    ApiBody, 
    ApiConsumes, 
    ApiTags 
}                           from '@nestjs/swagger';
import { FileInterceptor }  from '@nestjs/platform-express';

import { ImagesService }        from '@images/images.service';
import { UpdateImageDto }       from '@images/dto/update-image.dto';
import { ImageParamsDto }       from '@images/dto/image-params.dto';
import { PaginationFilterDto }  from '@common/dto/pagination-filter.dto';
import { UploadFileDto }        from '@common/dto/upload-file.dto';


@ApiTags( 'Images' )
@Controller( 'images' )
export class ImagesController {

    constructor( private readonly imagesService : ImagesService ) { }


    @Post( ':nameImg' )
    @ApiConsumes( 'multipart/form-data' )
    @ApiBody({ type : UploadFileDto })
    @UseInterceptors( FileInterceptor( 'file' ))
    upload(
        @Param( ) params        : ImageParamsDto,
        @UploadedFile( ) file   : Express.Multer.File,
    ) {
        return this.imagesService.create( params.nameImg, file );
    }


    @Get()
    findAll(
        @Query() paginationFilterDto : PaginationFilterDto
    ) {
        return this.imagesService.findAll( paginationFilterDto );
    }


    @Get( ':id' )
    findOne(
        @Param( 'id' ) id : string
    ) {
        return this.imagesService.findOne( id );
    }


    @Patch( ':id' )
    update(
        @Param( 'id' ) id       : string,
        @Body() updateImageDto  : UpdateImageDto
    ) {
        return this.imagesService.update( id, updateImageDto );
    }


    @Delete( ':id' )
    remove(
        @Param( 'id' ) id : string
    ) {
        return this.imagesService.remove( id );
    }

}
