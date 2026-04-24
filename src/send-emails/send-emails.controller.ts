import { Controller, Post, Body, BadRequestException } from '@nestjs/common';

import {
    SendEmailDto,
    SendEmailScheduleDto
}                               from '@send-emails/dto/send-email.dto';
import { SendEmailsService }    from '@send-emails/send-emails.service';
import { PayloadEmail }         from '@send-emails/models/payloadEmail.model';
import { SendEmailWorkflowDto } from './dto/send-emal-workflow.dto';


@Controller( 'mail-sender' )
export class SendEmailsController {

    constructor(
        private readonly sendEmailsService: SendEmailsService
    ) {}

    @Post( 'massive' )
    async sendMassive(
        @Body() payload: SendEmailDto
    ) {
        return await this.sendEmailsService.startEmailJob( payload );
    }


    @Post( 'workflow' )
    async sendWorkflow(
        @Body() payload: SendEmailWorkflowDto
    ) {
        return await this.sendEmailsService.startEmailWorkflow( payload );
    }


    // @Post('schedule')
    // async scheduleCampaign(
    //     @Body() payload: SendEmailScheduleDto
    // ) {
    //     const scheduledDate = new Date( payload.sendAt );

    //     if ( scheduledDate <= new Date() ) {
    //         throw new BadRequestException( 'La fecha de programación debe ser futura.' );
    //     }

    //     const messages: PayloadEmail[] = payload.students.map( student => ({
    //         student,
    //         templateId  : payload.templateId,
    //         subject     : payload.subject
    //     }));

    //     await this.sendEmailsService.sendScheduledEmails( messages, scheduledDate );

    //     return {
    //         status          : 'Campaña programada exitosamente',
    //         totalEmails     : messages.length,
    //         scheduledFor    : scheduledDate.toISOString()
    //     };
    // }

}
