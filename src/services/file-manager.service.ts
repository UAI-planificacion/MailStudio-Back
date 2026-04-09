import { Injectable, BadRequestException } from '@nestjs/common';

import { ENVS }          from '@config/envs';
import { METHOD }        from '@services/http-codes';
import connectRequest    from '@services/fetch.service';


@Injectable ( )
export class FileManagerService {

    private readonly baseUrl = ENVS.FILE_MANAGER_URL;
    private readonly folder  = ENVS.FILE_MANAGER_FOLDER;


    async upload( file : Express.Multer.File ) : Promise<string> {
        if ( !file ) {
            throw new BadRequestException( 'Archivo no proporcionado' );
        }

        try {
            const formData = new FormData();
            const blob     = new Blob ([ new Uint8Array ( file.buffer ) ], { type : file.mimetype });
            const endpoint = `${ this.baseUrl }/upload/${ encodeURIComponent ( this.folder ) }?format=avif`;

            formData.append( 'file', blob, file.originalname );

            const response = await connectRequest<any>({
                endpoint,
                method : METHOD.POST,
                body   : formData as any,
            });

            return( response as any ).secure_url;
        } catch ( error ) {
            throw new BadRequestException( `Error en el servicio de archivos : ${ error.message || error }` );
        }
    }


    async delete( imageUrl : string ) : Promise<void> {
        try {
            const urlParts   = imageUrl.split ( '/' );
            const lastPart   = urlParts[ urlParts.length - 1 ];
            const fileName   = lastPart.split ( '.' )[ 0 ];
            const deletePath = `${ this.folder }|${ fileName }`;

            const endpoint = `${ this.baseUrl }/delete/${ encodeURIComponent ( deletePath ) }`;

            await connectRequest({
                endpoint,
                method : METHOD.DELETE,
            });
        } catch ( error ) {
            console.error( `Error al intentar eliminar archivo : ${ error.message || error }` );
        }
    }

}
