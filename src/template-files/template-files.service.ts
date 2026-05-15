import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, TemplateFile, AttachmentType } from '@prisma/client';

import { PrismaService }            from '@prisma/prisma.service';
import { PrismaException }          from '@prisma/prisma-catch';
import { FileManagerService }       from '@services/file-manager.service';
import { PaginatedResult }          from '@common/interfaces/paginated-result.interface';
import { CreateTemplateFileDto }    from '@template-files/dto/create-template-file.dto';
import { UpdateTemplateFileDto }    from '@template-files/dto/update-template-file.dto';
import { FilterTemplateFileDto }    from '@template-files/dto/filter-template-file.dto';
import { getLastItem }              from '@common/utils/getLastItem';


@Injectable()
export class TemplateFilesService {

	constructor( 
		private readonly prisma             : PrismaService,
		private readonly fileManagerService : FileManagerService,
	) { }


	async create( createTemplateFileDto : CreateTemplateFileDto, file : Express.Multer.File ) {
		try {
			const { url, coverUrl } = await this.fileManagerService.uploadTemplateFile( file );

			let type: AttachmentType = AttachmentType.OTHER;

			if ( file.mimetype.startsWith( 'image/' )) {
				type = AttachmentType.IMAGE;
			} else if ( file.mimetype.startsWith( 'video/' )) {
				type = AttachmentType.VIDEO;
			} else if ( file.mimetype === 'application/pdf' ) {
				type = AttachmentType.PDF;
			} else if ( file.mimetype === 'text/html' ) {
				type = AttachmentType.HTML;
			} else if ( file.mimetype === 'text/plain' ) {
				type = AttachmentType.TXT;
			}

            const finalUrl      = getLastItem( url );
            const finalCoverUrl = getLastItem( coverUrl );

			return await this.prisma.templateFile.create({
				data : {
					name      : createTemplateFileDto.name,
					type      : type,
					url       : finalUrl,
					coverUrl  : finalCoverUrl,
					createdBy : createTemplateFileDto.createdBy,
					updatedBy : createTemplateFileDto.createdBy,
				},
			});
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async findAll( filterDto : FilterTemplateFileDto ) : Promise<PaginatedResult<TemplateFile>> {
		const { page = 1, size = 10, name, type } = filterDto;

		const skip  = ( page - 1 ) * size;
		const take  = size;
		const where : Prisma.TemplateFileWhereInput = {
			...( name && {
				name : {
					contains : name,
					mode     : 'insensitive'
				}
			}),
			...( type && { type })
		};

		const [ items, total ] = await Promise.all([
			this.prisma.templateFile.findMany({
				skip    : skip,
				take    : take,
				where   : where,
				orderBy : {
					createdAt : 'desc'
				}
			}),
			this.prisma.templateFile.count({ where })
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
		const templateFile = await this.prisma.templateFile.findUnique({
			where : { id },
		});

		if ( !templateFile ) {
			throw new NotFoundException( `TemplateFile con id ${ id } no encontrado` );
		}

		return templateFile;
	}


	async update( id : string, updateTemplateFileDto : UpdateTemplateFileDto ) {
		try {
			return await this.prisma.templateFile.update({
				where : { id },
				data  : updateTemplateFileDto,
			});
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async remove( id : string ) {
		try {
			const templateFile = await this.findOne( id );

			let resourceType : 'image' | 'video' | 'raw' = 'raw';

			if ( templateFile.type === 'IMAGE' ) {
				resourceType = 'image';
			} else if ( templateFile.type === 'VIDEO' ) {
				resourceType = 'video';
			}

			await this.fileManagerService.delete( templateFile.url, resourceType );

			if ( templateFile.coverUrl ) {
				await this.fileManagerService.delete( templateFile.coverUrl, 'image' );
			}

			return await this.prisma.templateFile.delete({
				where : { id },
			});
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}

}
