import { Module } from '@nestjs/common';

import { SendEmailsController } from '@send-emails/send-emails.controller';
import { SendEmailsService }    from '@send-emails/send-emails.service';


@Module({
    controllers : [ SendEmailsController ],
    providers   : [ SendEmailsService ]
})
export class SendEmailsModule {}
