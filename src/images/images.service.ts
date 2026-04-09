import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService }      from '@prisma/prisma.service';
import { PrismaException }    from '@prisma/prisma-catch';
import { CreateImageDto }     from '@images/dto/create-image.dto';
import { UpdateImageDto }     from '@images/dto/update-image.dto';
import { FileManagerService } from '@services/file-manager.service';


@Injectable( )
export class ImagesService {

	constructor( 
		private readonly prisma             : PrismaService,
		private readonly fileManagerService : FileManagerService,
	) { }


	async create( createImageDto : CreateImageDto, file : Express.Multer.File ) {
		try {
			const imageUrl = await this.fileManagerService.upload( file );

			return await this.prisma.image.create({
				data : {
					name : createImageDto.name,
					url  : imageUrl,
				},
			});
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async findAll( ) {
		return await this.prisma.image.findMany( );
	}


	async findOne( id : string ) {
		const image = await this.prisma.image.findUnique({
			where : { id },
		});

		if ( !image ) {
			throw new NotFoundException ( `Imagen con id ${ id } no encontrada` );
		}

		return image;
	}


	async update( id : string, updateImageDto : UpdateImageDto ) {
		try {
			await this.findOne( id );

			return await this.prisma.image.update({
				where : { id },
				data  : {
					name : updateImageDto.name,
				},
			});
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async remove( id : string ) {
		try {
			const image = await this.findOne( id );

			await this.fileManagerService.delete( image.url );

			return await this.prisma.image.delete({
				where : { id },
			});
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}

}
