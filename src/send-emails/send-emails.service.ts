import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import {
    ServiceBusClient,
    ServiceBusMessage,
    ServiceBusSender
} from '@azure/service-bus';

import { PayloadEmail } from '@send-emails/models/payloadEmail.model';
import { ENVS }         from '@config/envs';


@Injectable()
export class SendEmailsService implements OnModuleInit, OnModuleDestroy {
    private sbClient        : ServiceBusClient;
    private sender          : ServiceBusSender;

    private readonly connectString  : string = ENVS.AZURE_BUS.CONNECTION;
    private readonly queueName      : string = ENVS.AZURE_BUS.QUEUE_NAME;


    async onModuleInit() {
        this.sbClient   = new ServiceBusClient( this.connectString );
        this.sender     = this.sbClient.createSender( this.queueName );
    }


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


    async onModuleDestroy() {
        await this.sender.close();
        await this.sbClient.close();
    }

}
