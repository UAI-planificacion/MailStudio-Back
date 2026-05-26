import { Module } from '@nestjs/common';

import { SendEmailsController } from '@send-emails/send-emails.controller';
import { SendEmailsService }    from '@send-emails/send-emails.service';
import { SseModule }            from '@sse/sse.module';


@Module({
    controllers : [ SendEmailsController ],
    providers   : [ SendEmailsService ],
    imports     : [ SseModule ]
})
export class SendEmailsModule {}
