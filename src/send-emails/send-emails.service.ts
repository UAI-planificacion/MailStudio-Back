import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import {
    ServiceBusClient,
    ServiceBusMessage,
    ServiceBusSender
}                       from '@azure/service-bus';
import * as cronParser  from 'cron-parser';

import { ENVS }             from '@config/envs';
import { PayloadEmail }     from '@send-emails/models/payloadEmail.model';
import { transformToCron }  from '@send-emails/utils/cron-transformer';
import { PrismaService }    from '@prisma/prisma.service';


@Injectable()
export class SendEmailsService implements OnModuleInit, OnModuleDestroy {
    private sbClient        : ServiceBusClient;
    private sender          : ServiceBusSender;
    private recurrenceSender: ServiceBusSender;


    constructor( 
        private readonly prisma: PrismaService,
    ) { }


    private readonly connectString  : string = ENVS.AZURE_BUS.CONNECTION;
    private readonly queueName      : string = ENVS.AZURE_BUS.QUEUE_NAME;
    private readonly queueRecurrent : string = ENVS.AZURE_BUS.QUEUE_RECURRENT_NAME;


    async onModuleInit() {
        this.sbClient   = new ServiceBusClient( this.connectString );
        this.sender     = this.sbClient.createSender( this.queueName );

        this.recurrenceSender = this.sbClient.createSender( this.queueRecurrent );
    }

    // ========================= MASIVOS (inmediatos) =========================
    async sendMassiveEmails( messages: PayloadEmail[] ) {
        let batch = await this.sender.createMessageBatch();

        for ( const emailData of messages ) {
            const message = {
                body        : emailData,
                contentType : "application/json",
            };

            // Si el lote se llena, lo enviamos y creamos uno nuevo
            if ( !batch.tryAddMessage( message )) {
                await this.sender.sendMessages( batch );

                batch = await this.sender.createMessageBatch();

                batch.tryAddMessage( message );
            }
        }

        // Enviamos el último lote restante
        await this.sender.sendMessages( batch );

        console.log( `${ messages.length } correos encolados exitosamente.` );
    }


    // ========================= PROGRAMADOS (UN SOLO ENVÍO) =========================
    async sendScheduledEmails( messages: PayloadEmail[], sendAt: Date ): Promise<Long[]> {
        const allSequenceNumbers: Long[] = [];

        let currentBatch: ServiceBusMessage[] = [];

        for ( const emailData of messages ) {
            currentBatch.push({
                body        : emailData,
                contentType : "application/json"
            });

            if ( currentBatch.length === 100 ) {
                // Pasamos los mensajes y la fecha por separado para evitar el error de argumentos
                const ids = await this.sender.scheduleMessages( currentBatch, sendAt );

                // Convertimos cada ID (tipo Long) a string para guardarlo fácil en la BD
                allSequenceNumbers.push( ...ids.map(id => id ));

                currentBatch = [];
            }
        }

        if ( currentBatch.length > 0 ) {
            const ids = await this.sender.scheduleMessages( currentBatch, sendAt );

            allSequenceNumbers.push(...ids.map( id => id ));
        }

        console.log(`${messages.length} correos programados para el ${sendAt.toISOString()}`);

        return allSequenceNumbers;
    }


    async cancelScheduledEmails(sequenceNumbers: Long[]) {
        const idsToCancel = sequenceNumbers.map( id => id );
        await this.sender.cancelScheduledMessages( idsToCancel );
    }


    // ========================= RECURRENCIA =========================
    async scheduleCampaignRecurrence(campaignId: string) {
        // 1. Buscas en la DB los datos que guardó el Admin
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: campaignId }
        });

        if (!campaign ) return;

        // 2. Mapeas los campos de tu DB al formato del Transformer
        const cronRule = transformToCron({
            frequency   : campaign.frequency as any,
            hour        : campaign.hour,
            minute      : campaign.minute,
            daysOfWeek  : campaign.daysOfWeek,
            dayOfMonth  : campaign.dayOfMonth
        });

        // 3. Calculas la PRIMERA ejecución (para el trigger inicial)
        // const interval = cronParser.parseExpression(cronRule);
        const interval = (cronParser as any).parseExpression(cronRule);
        const firstRun = interval.next().toDate();

        // 4. "LLAMAS" AL WORKER enviando el mensaje al Service Bus
        // Nota: Aquí es donde el Worker recibirá el cronRule y el ID
        await this.recurrenceSender.scheduleMessages([{
            body: { 
                campaignId, 
                cronRule  // El Worker ahora tiene el motor cron listo
            },
            contentType: 'application/json'
        }], firstRun);

        console.log(`✅ Campaña ${campaign.name} programada con Cron: ${cronRule}`);
    }


    
    async onModuleDestroy() {
        await this.sender.close();
        await this.recurrenceSender.close();
        await this.sbClient.close();
    }

}
