import { Injectable, NotFoundException } from '@nestjs/common';

import {
    ERROR_MESSAGES,
    PrismaException
}                               from '@prisma/prisma-catch';
import { PrismaService }        from '@prisma/prisma.service';
import { CreateTemplateDto }    from '@templates/dto/create-template.dto';
import { UpdateTemplateDto }    from '@templates/dto/update-template.dto';
import { PaginationDto }        from '@common/dto/pagination.dto';
import { PaginatedResult }      from '@common/interfaces/paginated-result.interface';
import { generateTemplate }     from './utils/createTemplate';
import { TemplateContent }      from './utils/templateContent.model';


@Injectable( )
export class TemplatesService {

	constructor( private readonly prisma : PrismaService ) { }


	async create( createTemplateDto : CreateTemplateDto ) {
		try {
			const data = {
				...createTemplateDto,
				updatedBy : createTemplateDto.updatedBy || createTemplateDto.createdBy,
			};

			return await this.prisma.template.create({ data });
		} catch ( error ) {
			throw PrismaException.catch( error );
		}
	}


	async findAll(
		staffId       : string,
		paginationDto : PaginationDto,
		name?         : string
	) : Promise<PaginatedResult<any>> {
        // *TODO: tenemos que hacer algo con el staffId
		const { page = 1, size = 10 } = paginationDto;

		const skip  = ( page - 1 ) * size;
		const take  = size;
		const where : any = {
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
					updatedAt : 'desc'
				},
				select  : {
					id          : true,
					name        : true,
					content     : true,
					updatedAt   : true,
					createdAt   : true,
                    subject     : true,
                    cc          : true,
                    bcc         : true,
                    active      : true,
					creator     : {
						select : {
							id    : true,
							name  : true,
							email : true,
							role  : true,
						}
					},
					updater   : {
						select : {
							id    : true,
							name  : true,
							email : true,
							role  : true,
						}
					},
				},
			}),
			this.prisma.template.count({ where })
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


	async findOne( id : string ) {
		const template = await this.prisma.template.findUnique({
			where   : {
                id,
                // active : true
            },
			include : {
				creator : true,
				updater : true,
			},
		});

		if ( !template ) {
			throw new NotFoundException ( `Template with id ${ id } not found` );
		}

		return template;
	}


	async update( id : string, updateTemplateDto : UpdateTemplateDto ) {
		try {
			return await this.prisma.template.update({
				where : { id },
				data  : updateTemplateDto,
			});
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
