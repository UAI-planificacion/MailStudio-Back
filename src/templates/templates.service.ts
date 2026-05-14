import { Injectable, NotFoundException } from '@nestjs/common';

import {
    ERROR_MESSAGES,
    PrismaException
}                               from '@prisma/prisma-catch';
import {
    SELECT_TEMPLATE,
    transformOneTemplateResponse,
    transformTemplateResponse
}                               from '@templates/utils/selectTemplate';
import { PaginationFilterDto }  from '@common/dto/pagination-filter.dto';
import { PaginatedResult }      from '@common/interfaces/paginated-result.interface';
import { Prisma }               from '@prisma/client';
import { PrismaService }        from '@prisma/prisma.service';
import { CreateTemplateDto }    from '@templates/dto/create-template.dto';
import { UpdateTemplateDto }    from '@templates/dto/update-template.dto';
import { TemplateResponse }     from '@templates/interfaces/template-response.interface';
import { generateTemplate }     from '@templates/utils/createTemplate';
import { TemplateContent }      from '@templates/utils/templateContent.model';


@Injectable( )
export class TemplatesService {

	constructor( private readonly prisma : PrismaService ) { }


	async create( createTemplateDto : CreateTemplateDto ) : Promise<TemplateResponse> {
		try {
			const { images, ...templateData } = createTemplateDto;

			const data = {
				...templateData,
				updatedBy : templateData.updatedBy || templateData.createdBy,
			};

			const newTemplate = await this.prisma.template.create({ data });

			if ( ( images?.length ?? 0 ) > 0 ) {
				const foundImages = await this.prisma.image.findMany({
					where  : { url : { in : images } },
					select : { id  : true }
				});

				const data = foundImages.map( ( image ) => ({
					templateId : newTemplate.id,
					imageId    : image.id,
				}));

				await this.prisma.templateImage.createMany({
					data
				});
			}

			const template = await this.prisma.template.findUnique({
				where  : { id : newTemplate.id },
				select : SELECT_TEMPLATE
			});

			return transformOneTemplateResponse( template! );
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async findAll(
		staffId             : string,
		paginationFilterDto : PaginationFilterDto
	) : Promise<PaginatedResult<TemplateResponse>> {
        // *TODO: tenemos que hacer algo con el staffId
		const { page = 1, size = 10, name } = paginationFilterDto;

		const skip  = ( page - 1 ) * size;
		const take  = size;
		const where : Prisma.TemplateWhereInput = {
			// active : true,
			...( name && {
				name : {
					contains : name,
					mode     : 'insensitive'
				}
			})
		};

		const [ items, total ] = await Promise.all([
			this.prisma.template.findMany({
				skip    : skip,
				take    : take,
				where   : where,
				orderBy : {
					createdAt : 'desc'
				},
				select  : SELECT_TEMPLATE
			}),
			this.prisma.template.count({ where })
		]);

		const totalPages = Math.ceil( total / size );

		return {
			// data :items.map( transformTemplateResponse ),
			data :transformTemplateResponse( items ),
			meta : {
				total      : total,
				page       : page,
				size       : size,
				totalPages : totalPages,
			}
		};
	}


	async findTemplate( id : string ) {
		const template = await this.prisma.template.findUnique({
			where : { id, active : true },
			select: {
				content: true
			},
		});

		if ( !template ) {
			throw new NotFoundException ( `Template with id ${ id } not found` );
		}

        const templateContent : TemplateContent = template.content as any as TemplateContent;

		return generateTemplate( templateContent );
	}


	async findOne( id : string ) : Promise<TemplateResponse> {
		const template = await this.prisma.template.findUnique({
			where   : {
                id,
                // active : true
            },
			// include : {
			// 	creator : true,
			// 	updater : true,
			// },
            select : SELECT_TEMPLATE
		});

		if ( !template ) {
			throw new NotFoundException ( `Template with id ${ id } not found` );
		}

		return transformOneTemplateResponse( template );
	}


	async update( id : string, updateTemplateDto : UpdateTemplateDto ) : Promise<TemplateResponse> {
		try {
			const { images, ...data } = updateTemplateDto;

			await this.prisma.template.update({
				where : { id },
				data  : data,
			});

			if ( images ) {
				const foundImages = await this.prisma.image.findMany({
					where  : { url : { in : images } },
					select : { id  : true }
				});

				const incomingIds = foundImages.map( ( i ) => i.id ).sort();

				const currentImages = await this.prisma.templateImage.findMany({
					where  : { templateId : id },
					select : { imageId    : true },
				});

				const currentIds = currentImages.map( ( ti ) => ti.imageId ).sort();

				if ( JSON.stringify( currentIds ) !== JSON.stringify( incomingIds ) ) {
					if ( currentImages.length > 0 ) {
						await this.prisma.templateImage.deleteMany({
							where : { templateId : id },
						});
					}

					if ( incomingIds.length > 0 ) {
						const imageData = incomingIds.map( ( imageId ) => ({
							templateId : id,
							imageId    : imageId,
						}) );

						await this.prisma.templateImage.createMany({
							data : imageData,
						});
					}
				}
			}

			const updatedTemplate = await this.prisma.template.findUnique({
				where  : { id },
				select : SELECT_TEMPLATE
			});

			return transformOneTemplateResponse( updatedTemplate! );
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async remove( id : string ) {
		try {
			return await this.prisma.template.delete({
				where : { id },
			});
		} catch ( error ) {
            if ( error.code === ERROR_MESSAGES.NOT_FOUND ) {
                const template = await this.findOne( id );

                if ( !template.active ) {
                    throw new NotFoundException ( `Template with id ${ id } not found` );
                }

                return await this.update( id, { active: false });
            }

			throw PrismaException.catch( error );
		}
	}

}
