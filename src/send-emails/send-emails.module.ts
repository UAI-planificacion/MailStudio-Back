import { Module } from '@nestjs/common';
import { SendEmailsService } from './send-emails.service';
import { SendEmailsController } from './send-emails.controller';

@Module({
  controllers: [SendEmailsController],
  providers: [SendEmailsService],
})
export class SendEmailsModule {}
