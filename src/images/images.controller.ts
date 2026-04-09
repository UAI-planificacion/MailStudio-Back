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
import { FileInterceptor }  from '@nestjs/platform-express';

import { ImagesService }    from '@images/images.service';
import { CreateImageDto }   from '@images/dto/create-image.dto';
import { UpdateImageDto }   from '@images/dto/update-image.dto';


@Controller( 'images' )
export class ImagesController {

    constructor( private readonly imagesService : ImagesService ) {}


    @Post()
    @UseInterceptors( FileInterceptor( 'file' ))
    create (
        @Body() createImageDto : CreateImageDto,
        @UploadedFile() file   : Express.Multer.File,
    ) {
        return this.imagesService.create( createImageDto, file );
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
