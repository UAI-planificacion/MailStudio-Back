import {
	Controller,
	Get,
	Query,
	ParseIntPipe,
	DefaultValuePipe,
	ParseBoolPipe,
} from '@nestjs/common';
import { JobStatus } from '@prisma/client';

import { SendEmailLogsService } from '@send-email-logs/send-email-logs.service';


@Controller( 'send-email-logs' )
export class SendEmailLogsController {

	constructor( private readonly sendEmailLogsService: SendEmailLogsService ) {}

	@Get()
	async findAll(
		@Query( 'page', new DefaultValuePipe( 1 ), ParseIntPipe ) page: number,
		@Query( 'size', new DefaultValuePipe( 10 ), ParseIntPipe ) size: number,
		@Query( 'emailDetails', new DefaultValuePipe( false ), ParseBoolPipe ) emailDetails: boolean,
		@Query( 'status' ) status?: JobStatus
	) {
		return this.sendEmailLogsService.findAll( page, size, emailDetails, status );
	}

}
