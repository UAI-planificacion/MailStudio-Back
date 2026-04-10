import { Injectable, BadRequestException } from '@nestjs/common';

import
connectRequest, {
    isApiError
}                   from '@services/fetch.service';
import { ENVS }     from '@config/envs';
import { METHOD }   from '@services/http-codes';


interface RespondeFileManager {
    result : string;
}


@Injectable()
export class FileManagerService {

    private readonly baseUrl = ENVS.FILE_MANAGER_URL;
    private readonly folder  = ENVS.FILE_MANAGER_FOLDER;


    async upload( file : Express.Multer.File ) : Promise<string> {
        if ( !file ) {
            throw new BadRequestException( 'Archivo no proporcionado' );
        }

        try {
            const formData = new FormData();
            const blob     = new Blob([ new Uint8Array( file.buffer ) ], { type : file.mimetype });
            //TODO: Agregar los parametros de formato y calidad en el .env
            const endpoint = `${ this.baseUrl }/upload/${ encodeURIComponent( this.folder ) }?format=avif&quality=50`;

            formData.append( 'file', blob, file.originalname );

            const response = await connectRequest<any>({
                endpoint,
                method : METHOD.POST,
                body   : formData as any,
            });

            return ( response as any ).secure_url as string;
        } catch ( error ) {
            throw new BadRequestException( `Error en el servicio de archivos` );
        }
    }


    async delete( imageUrl : string ) : Promise<void> {
        try {
            const deletePath    = `${ this.folder }|${ imageUrl.split ( '.' )[0] }`;
            const endpoint      = `${ this.baseUrl }/delete/${ deletePath }`;

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

            if ( response.result !== 'ok' )  {
                throw new BadRequestException( 'Error al eliminar archivo' );
            }
        } catch ( error ) {
            throw new BadRequestException( `Error al eliminar archivo` );
        }
    }

}
