import { ENVS } from "@config/envs";

const baseUrl = ENVS.FILE_MANAGER.FOLDER.BASE.replaceAll( '|', '/' );

export const getLastItem = ( url : string | undefined ): string =>
    url?.split( baseUrl ).pop()!.slice( 1 )!;



export const convertToPipe = ( url : string ) : string => url.replaceAll( '/', '|' );