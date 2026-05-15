import { Injectable, BadRequestException } from '@nestjs/common';

import { convertToPipe }                from '@common/utils/getLastItem';
import { ENVS }                         from '@config/envs';
import connectRequest, { isApiError }   from '@services/fetch.service';
import { METHOD }                       from '@services/http-codes';


interface RespondeFileManager {
    result : string;
}


@Injectable()
export class FileManagerService {

    private readonly baseUrl        = ENVS.FILE_MANAGER.URL;
    private readonly baseFolder     = ENVS.FILE_MANAGER.FOLDER.BASE;
    private readonly admin          = `${this.baseUrl}/${ENVS.FILE_MANAGER.ENDPOINT.ADMIN}`;
    private readonly image          = `${this.baseUrl}/${ENVS.FILE_MANAGER.ENDPOINT.IMAGE}`;
    private readonly video          = `${this.baseUrl}/${ENVS.FILE_MANAGER.ENDPOINT.VIDEO}`;
    private readonly raw            = `${this.baseUrl}/${ENVS.FILE_MANAGER.ENDPOINT.RAW}`;
    private readonly MAX_RETRIES    = ENVS.FILE_MANAGER.MAX_RETRIES;
    private readonly RETRY_DELAY    = ENVS.FILE_MANAGER.RETRY_DELAY;
    private readonly FORMAT         = ENVS.FILE_MANAGER.FORMAT;
    private readonly QUALITY        = ENVS.FILE_MANAGER.QUALITY;

    private readonly IMAGE_FOLDER       = encodeURIComponent( `${ this.baseFolder }|${ ENVS.FILE_MANAGER.FOLDER.IMAGE }` );
    private readonly IMAGE_RAW_FOLDER   = encodeURIComponent( `${ this.baseFolder }|${ ENVS.FILE_MANAGER.FOLDER.IMAGE_RAW }` );
    private readonly VIDEO_FOLDER       = encodeURIComponent( `${ this.baseFolder }|${ ENVS.FILE_MANAGER.FOLDER.VIDEO }` );
    private readonly PDF_FOLDER         = encodeURIComponent( `${ this.baseFolder }|${ ENVS.FILE_MANAGER.FOLDER.PDF }` );
    private readonly TXT_FOLDER         = encodeURIComponent( `${ this.baseFolder }|${ ENVS.FILE_MANAGER.FOLDER.TXT }` );
    private readonly HTML_FOLDER        = encodeURIComponent( `${ this.baseFolder }|${ ENVS.FILE_MANAGER.FOLDER.HTML }` );
    private readonly OTHER_FOLDER       = encodeURIComponent( `${ this.baseFolder }|${ ENVS.FILE_MANAGER.FOLDER.OTHER }` );


    private async withRetry<T>( operation : () => Promise<T> ) : Promise<T> {
        let lastError : unknown;

        for ( let attempt = 1; attempt <= this.MAX_RETRIES; attempt++ ) {
            try {
                return await operation();
            } catch ( error ) {
                lastError = error;

                if ( attempt < this.MAX_RETRIES ) {
                    const delay = this.RETRY_DELAY * attempt;
                    await new Promise( resolve => setTimeout( resolve, delay ));
                }
            }
        }

        throw lastError;
    }


    async upload( file : Express.Multer.File ) : Promise<string> {
        if ( !file ) {
            throw new BadRequestException( 'Archivo no proporcionado' );
        }

        try {
            return await this.withRetry( async () => {
                const formData = new FormData();
                const blob     = new Blob([ new Uint8Array( file.buffer ) ], { type : file.mimetype });
                const endpoint = `${ this.image }/${ this.IMAGE_FOLDER }?format=${ this.FORMAT }&quality=${ this.QUALITY }`;

                formData.append( 'file', blob, file.originalname );

                const response = await connectRequest<any>({
                    endpoint,
                    method : METHOD.POST,
                    body   : formData as any,
                });

                return ( response as any ).secure_url as string;
            });
        } catch ( error ) {
            throw new BadRequestException( `Error en el servicio de archivos, ${ error }` );
        }
    }


    async uploadTemplateFile( file : Express.Multer.File ) : Promise<{ url : string; coverUrl? : string }> {
        try {
            return await this.withRetry( async () => {
                const formData = new FormData();
                const blob     = new Blob([ new Uint8Array( file.buffer ) ], { type : file.mimetype });

                let endpoint = '';

                if ( file.mimetype.startsWith( 'image/' )) {
                    endpoint = `${ this.image }/${ this.IMAGE_RAW_FOLDER }?format=${ this.FORMAT }&quality=${ this.QUALITY }`;
                } else if ( file.mimetype.startsWith( 'video/' )) {
                    endpoint = `${ this.video }/${ this.VIDEO_FOLDER }?auto=true`;
                } else if ( file.mimetype === 'application/pdf' ) {
                    endpoint = `${ this.raw }/${ this.PDF_FOLDER }?optimize=true&generate_cover=true&format=avif`;
                } else if ( file.mimetype === 'text/html' ) {
                    endpoint = `${ this.raw }/${ this.HTML_FOLDER }`;
                } else if ( file.mimetype === 'text/plain' ) {
                    endpoint = `${ this.raw }/${ this.TXT_FOLDER }`;
                } else {
                    endpoint = `${ this.raw }/${ this.OTHER_FOLDER }`;
                }

                formData.append( 'file', blob, file.originalname );

                const response = await connectRequest<any>({
                    endpoint,
                    method : METHOD.POST,
                    body   : formData as any,
                });

                if ( file.mimetype === 'application/pdf' ) {
                    return {
                        url      : response.document.secure_url as string,
                        coverUrl : response.cover?.secure_url   as string,
                    };
                }

                return {
                    url : response.secure_url as string,
                };
            });
        } catch ( error ) {
            throw new BadRequestException( `Error al subir el archivo de template, ${ error }` );
        }
    }


    async delete( imageUrl : string, resourceType : 'image' | 'video' | 'raw' = 'image' ) : Promise<void> {
        try {
            await this.withRetry( async () => {
                const fileName   = resourceType === 'raw' ? convertToPipe( imageUrl ) : convertToPipe( imageUrl.split( '.' )[0] );
                const deletePath = encodeURIComponent( `${ this.baseFolder }|${ fileName }` );
                const endpoint   = `${ this.admin }/${ deletePath }?resource_type=${ resourceType }`;

                const response = await connectRequest<RespondeFileManager>({
                    endpoint,
                    method : METHOD.DELETE,
                });

                if ( !response ) {
                    throw new BadRequestException( 'Error al eliminar archivo' );
                }

                if ( isApiError( response )) {
                    throw new BadRequestException( 'Error al eliminar archivo' );
                }

                if ( response.result !== 'ok' ) {
                    throw new BadRequestException( 'Error al eliminar archivo' );
                }
            });
        } catch ( error ) {
            throw new BadRequestException( `Error al eliminar archivo` );
        }
    }

}
