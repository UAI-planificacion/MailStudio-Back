import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService }    from '@prisma/prisma.service';
import { PrismaException }  from '@prisma/prisma-catch';
import { CreateStaffDto }   from '@staff/dto/create-staff.dto';
import { UpdateStaffDto }   from '@staff/dto/update-staff.dto';


@Injectable( )
export class StaffService {

	constructor( private readonly prisma : PrismaService ) { }


	async create( createStaffDto : CreateStaffDto ) {
        try {
            return await this.prisma.staff.create({
                data	: createStaffDto,
            });
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
	}


	async findAll( ) {
		return await this.prisma.staff.findMany( );
	}


	async findOneByEmail( email : string ) {
		const staff = await this.prisma.staff.findUnique({
			where : { email },
		});

		if ( !staff ) {
			throw new NotFoundException ( `Staff with email ${ email } not found` );
		}

		return staff;
	}


	async update( id : string, updateStaffDto : UpdateStaffDto ) {
        try {
            return await this.prisma.staff.update({
                where	: { id },
                data	: updateStaffDto,
            });
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
	}


	async remove( id : string ) {
        try {
            return await this.prisma.staff.delete({
                where : { id },
            });
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
	}

}
