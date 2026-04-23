import { Controller, Post, Body, BadRequestException } from '@nestjs/common';

import {
    SendEmailDto,
    SendEmailScheduleDto
}                               from '@send-emails/dto/send-email.dto';
import { SendEmailsService }    from '@send-emails/send-emails.service';
import { PayloadEmail }         from '@send-emails/models/payloadEmail.model';


@Controller( 'mail-sender' )
export class SendEmailsController {

    constructor(
        private readonly sendEmailsService: SendEmailsService
    ) {}

    @Post( 'massive' )
    async sendMassive(
        @Body() payload: SendEmailDto
    ) {
        const messages = payload.emails.map(email => ({
            email       : email,
            template    : payload.template
        }));

        await this.sendEmailsService.sendMassiveEmails( messages );

        return {
            status  : 'Encolado exitosamente',
            count   : messages.length
        };
    }


    @Post('schedule')
    async scheduleCampaign(
        @Body() payload: SendEmailScheduleDto
    ) {
        const scheduledDate = new Date( payload.sendAt );

        if ( scheduledDate <= new Date() ) {
            throw new BadRequestException( 'La fecha de programación debe ser futura.' );
        }

        const messages: PayloadEmail[] = payload.emails.map( email => ({
            email       : email,
            template    : payload.template
        }));

        await this.sendEmailsService.sendScheduledEmails( messages, scheduledDate );

        return {
            status          : 'Campaña programada exitosamente',
            totalEmails     : messages.length,
            scheduledFor    : scheduledDate.toISOString()
        };
    }

}
