import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService }    from '@prisma/prisma.service';
import { CreateStaffDto }   from '@staff/dto/create-staff.dto';
import { UpdateStaffDto }   from '@staff/dto/update-staff.dto';


@Injectable( )
export class StaffService {

	constructor( private readonly prisma : PrismaService ) { }


	async create( createStaffDto : CreateStaffDto ) {
		return await this.prisma.staff.create({
			data	: createStaffDto,
		});
	}


	async findAll( ) {
		return await this.prisma.staff.findMany( );
	}


	async findOne( id : string ) {
		const staff = await this.prisma.staff.findUnique({
			where : { id },
		});

		if ( !staff ) {
			throw new NotFoundException ( `Staff with id ${ id } not found` );
		}

		return staff;
	}


	async update( id : string, updateStaffDto : UpdateStaffDto ) {
		await this.findOne( id );

		return await this.prisma.staff.update({
			where	: { id },
			data	: updateStaffDto,
		});
	}


	async remove( id : string ) {
		await this.findOne( id );

		return await this.prisma.staff.delete({
			where : { id },
		});
	}

}
