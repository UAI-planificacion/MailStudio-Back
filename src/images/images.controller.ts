import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseInterceptors, 
    UploadedFile 
}                           from '@nestjs/common';
import { 
    ApiBody, 
    ApiConsumes, 
    ApiParam, 
    ApiTags 
}                           from '@nestjs/swagger';
import { FileInterceptor }  from '@nestjs/platform-express';

import { ImagesService }    from '@images/images.service';
import { CreateImageDto }   from '@images/dto/create-image.dto';
import { UpdateImageDto }   from '@images/dto/update-image.dto';
import { ImageParamsDto }   from '@images/dto/image-params.dto';


@ApiTags( 'Images' )
@Controller( 'images' )
export class ImagesController {

    constructor( private readonly imagesService : ImagesService ) { }


    @Post( ':nameImg' )
    @ApiConsumes( 'multipart/form-data' )
    @ApiParam({ name : 'nameImg', type : 'string', description : 'Nombre de la imagen' })
    @ApiBody({ type : CreateImageDto })
    @UseInterceptors( FileInterceptor( 'file' ))
    upload(
        @Param( ) params        : ImageParamsDto,
        @UploadedFile( ) file   : Express.Multer.File,
    ) {
        return this.imagesService.create( params.nameImg, file );
    }


    @Get()
    findAll() {
        return this.imagesService.findAll();
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
