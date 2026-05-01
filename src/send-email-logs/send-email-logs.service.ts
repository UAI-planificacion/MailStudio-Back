import { Injectable } from '@nestjs/common';
import { JobStatus }  from '@prisma/client';

import { PrismaService }            from '@prisma/prisma.service';
import { PaginationDto }            from '@common/dto/pagination.dto';
import { PaginatedResult }          from '@common/interfaces/paginated-result.interface';
import { SELECT_EMAIL_LOG_SEND }    from '@send-email-logs/utils/select';


@Injectable()
export class SendEmailLogsService {

	constructor( private readonly prisma: PrismaService ) {}


	async findAll(
		paginationDto : PaginationDto,
		emailDetails  : boolean = false,
		status?       : JobStatus
	) : Promise<PaginatedResult<any>> {
		const { page = 1, size = 10 } = paginationDto;

		const skip  = ( page - 1 ) * size;
		const take  = size;
		const where = status ? { status } : {};

		const [ items, total ] = await Promise.all([
			this.prisma.sendEmailLog.findMany({
                select  : SELECT_EMAIL_LOG_SEND,
				skip    : skip,
				take    : take,
				where   : where,
				orderBy : {
					createdAt : 'desc',
				},
			}),
			this.prisma.sendEmailLog.count({ where })
		]);

		const totalPages = Math.ceil( total / size );

		const data = items.map( ( item ) => {
			if ( !emailDetails ) {
				return {
					...item,
					studentEmails : item.studentEmails.length,
				};
			}

			return item;
		});

		return {
			data : data,
			meta : {
				total      : total,
				page       : page,
				size       : size,
				totalPages : totalPages,
			}
		};
	}

}
