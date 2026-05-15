import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { Image, Prisma }        from '@prisma/client';
import { PrismaService }        from '@prisma/prisma.service';
import { PrismaException }      from '@prisma/prisma-catch';
import { UpdateImageDto }       from '@images/dto/update-image.dto';
import { FileManagerService }   from '@services/file-manager.service';
import { PaginationFilterDto }  from '@common/dto/pagination-filter.dto';
import { PaginatedResult }      from '@common/interfaces/paginated-result.interface';
import { getLastItem }          from '@common/utils/getLastItem';


@Injectable( )
export class ImagesService {

	constructor( 
		private readonly prisma             : PrismaService,
		private readonly fileManagerService : FileManagerService,
	) { }


	async create( name : string, file : Express.Multer.File ) {
		try {
			const baseUrl   = await this.fileManagerService.upload( file );
            // TODO: Hay que probar las imágenes
            const url       = getLastItem( baseUrl );
            // const url       = baseUrl.split( ENVS.FILE_MANAGER.FOLDER.BASE.replaceAll( '|', '/' ) ).pop()?.slice( 1 )!;
            // const url       = baseUrl.split( '/' ).at( -1 ) as string;

			return await this.prisma.image.create({
				data : {
					name : name,
					url,
				},
			});
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async findAll(
        paginationFilterDto : PaginationFilterDto
    ) : Promise<PaginatedResult<Image>> {
		const { page = 1, size = 10, name } = paginationFilterDto;

		const skip  = ( page - 1 ) * size;
		const take  = size;
		const where : Prisma.ImageWhereInput = {
			...( name && {
				name : {
					contains : name,
					mode     : 'insensitive'
				}
			})
		};

		const [ items, total ] = await Promise.all([
			this.prisma.image.findMany({
				skip    : skip,
				take    : take,
				where   : where,
				orderBy : {
					createdAt : 'desc'
				}
			}),
			this.prisma.image.count({ where })
		]);

		const totalPages = Math.ceil( total / size );

		return {
			data : items,
			meta : {
				total      : total,
				page       : page,
				size       : size,
				totalPages : totalPages,
			}
		};
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
            const templateImage = await this.prisma.templateImage.findFirst({
                where: {
                    imageId: id,
                },
                select :{
                    image: {
                        select: {
                            name: true
                        }
                    },
                }
            });

            if ( templateImage ) {
                throw new BadRequestException ( `La imagen "${ templateImage.image.name }" no puede ser eliminada porque esta asociada a un template` );
            }

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
