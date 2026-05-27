import { Module } from '@nestjs/common';

import { SendEmailLogsService }     from '@send-email-logs/send-email-logs.service';
import { SendEmailLogsController }  from '@send-email-logs/send-email-logs.controller';
import { PrismaModule }             from '@prisma/prisma.module';
import { SseModule }                from '@sse/sse.module';


@Module( {
	imports     : [ PrismaModule, SseModule ],
	controllers : [ SendEmailLogsController ],
	providers   : [ SendEmailLogsService ],
} )
export class SendEmailLogsModule {}
