import {
	Controller,
	Get,
	Query,
	DefaultValuePipe,
	ParseBoolPipe,
	ParseEnumPipe,
	Param,
	Body,
	Patch,
} from '@nestjs/common';

import { JobStatus } from '@prisma/client';

import { PaginationDto }        from '@common/dto/pagination.dto';
import { SendEmailLogsService } from '@send-email-logs/send-email-logs.service';


@Controller( 'send-email-logs' )
export class SendEmailLogsController {

	constructor(
		private readonly sendEmailLogsService : SendEmailLogsService
	) {}


	@Patch( ':id/status' )
	async updateStatus(
		@Param( 'id' ) id: string,
		@Body( 'status', new ParseEnumPipe( JobStatus ) ) status: JobStatus,
		@Body( 'message' ) message?: string,
	) {
		return this.sendEmailLogsService.updateStatus( id, status, message );
	}


	@Get()
	async findAll(
		@Query() paginationDto : PaginationDto,
		@Query( 'emailDetails', new DefaultValuePipe( false ), ParseBoolPipe ) emailDetails : boolean,
		@Query( 'status', new ParseEnumPipe( JobStatus, { optional : true } ) ) status? : JobStatus
	) {
		return this.sendEmailLogsService.findAll( paginationDto, emailDetails, status );
	}

}
