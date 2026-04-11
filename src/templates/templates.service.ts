import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService }     from '@prisma/prisma.service';
import { PrismaException }   from '@prisma/prisma-catch';
import { CreateTemplateDto } from '@templates/dto/create-template.dto';
import { UpdateTemplateDto } from '@templates/dto/update-template.dto';


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


	async findAll( staffId : string ) {
        // *TODO: tenemos que hacer algo con el staffId

		return await this.prisma.template.findMany({
            select : {
                id          : true,
                name        : true,
                content     : true,
                updatedAt   : true,
                createdAt   : true,
                creator     : {
                    select: {
                        id      : true,
                        name    : true,
                        email   : true,
                        role    : true,
                    }
                },
                updater: {
                    select : {
                        id      : true,
                        name    : true,
                        email   : true,
                        role    : true,
                    }
                },
            }
		});
	}


	async findOne( id : string ) {
		const template = await this.prisma.template.findUnique({
			where   : { id },
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
			throw PrismaException.catch( error );
		}
	}

}
