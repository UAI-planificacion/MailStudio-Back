import { $Enums } from "@prisma/client";

import { ENVS }             from "@config/envs";
import { TemplateContent }  from "./templateContent.model";


const validateSlashes = ( path : string ) : string => {
    return path.endsWith( '/' ) ? path : `${ path }/`;
};


const imageURL = `${ validateSlashes( ENVS.CLOUDINARY.IMAGE_URL ) }${ ENVS.FILE_MANAGER.FOLDER.BASE.replace( '|', '/' ) }`;
const rawURL   = `${ validateSlashes( ENVS.CLOUDINARY.RAW_URL )   }${ ENVS.FILE_MANAGER.FOLDER.BASE.replace( '|', '/' ) }`;
const videoURL = `${ validateSlashes( ENVS.CLOUDINARY.VIDEO_URL ) }${ ENVS.FILE_MANAGER.FOLDER.BASE.replace( '|', '/' ) }`;


const generateUrl = ( path : string ) => `${ imageURL }/${ path }`;


const REPLACE_BODY = '{{body}}';


const GLOBAL_BUTTON = ( externalUrl : string ) => `
    <div style="text-align:center;margin-top:20px;">
        <p style="margin-bottom:10px;color:#666;">¿Problemas para visualizar?</p>
        <a href="${ externalUrl }" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#0083bb;color:#fff;text-decoration:none;border-radius:5px;cursor:pointer;margin-bottom:20px">Ver contenido</a>
    </div>
`;


const baseTemplate = ( externalUrl : string ) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>Notificación UAI | MailStudio</title>
    </head>
    <body style="margin:0;font-family:sans-serif">
        <div style="max-width:800px;margin:0 auto">
            ${ GLOBAL_BUTTON( externalUrl ) }
            ${ REPLACE_BODY }
        </div>
    </body>
    </html>`.trim();


export function generateTemplate(
	templateContent : TemplateContent
) : string {
	const headerHtml = templateContent.headerImage
		? `<img src="${ generateUrl( templateContent.headerImage ) }" style="display:block;width:100%" alt="header">`
		: '';

	const footerHtml = templateContent.footerImage
		? `<img src="${ generateUrl( templateContent.footerImage ) }" style="display:block;width:100%" alt="footer">`
		: '';

    const content = `
    ${ headerHtml }
	<div style="display:block;clear:both;padding:20px 0">
        ${ templateContent.htmlContent }
    </div>
	${ footerHtml }`;

    return baseTemplate( '' )
        .replace( REPLACE_BODY, content )
        .replace( /\r?\n|\r|\s\s+/g, '' )
        .trim();
}


interface GenerateTemplateFile {
    url         : string;
    coverUrl    : string | null;
    type        : $Enums.AttachmentType;
}


export async function generateTemplateFile( templateFile: GenerateTemplateFile ) : Promise<string> {
    const { url, coverUrl, type } = templateFile;

    let contentUrl      = '';
    let coverFullUrl    = '';

    switch ( type ) {
        case $Enums.AttachmentType.IMAGE:
            contentUrl = `${ imageURL }/${ url }`;
        break;

        case $Enums.AttachmentType.VIDEO:
            contentUrl = `${ videoURL }/${ url }`;
        break;

        case $Enums.AttachmentType.PDF:
        case $Enums.AttachmentType.TXT:
        case $Enums.AttachmentType.HTML:
        case $Enums.AttachmentType.OTHER:
            contentUrl = `${ rawURL }/${ url }`;
        break;
    }

    if ( coverUrl && type === $Enums.AttachmentType.PDF ) {
        coverFullUrl = `${ imageURL }/${ coverUrl }`;
    }

    const content = {
        [ $Enums.AttachmentType.IMAGE ] : `<img src="${ contentUrl }" style="display:block;width:100%" alt="Image content">`,
        [ $Enums.AttachmentType.VIDEO ] : `<video src="${ contentUrl }" controls style="display:block;width:100%"></video>`,
        [ $Enums.AttachmentType.PDF ]   : coverFullUrl ? `<img src="${ coverFullUrl }" style="display:block;width:100%" alt="PDF cover">` : '',
        [ $Enums.AttachmentType.TXT ]   : `<div style="display:block;padding:10px 0">${ ( await getContent( contentUrl ) ).replace( /\r?\n|\r/g, '<br>' ) }</div>`,
        [ $Enums.AttachmentType.HTML ]  : await getContent( contentUrl ),
        [ $Enums.AttachmentType.OTHER ] : '',
    }[ type ] || '';

    return baseTemplate( type === $Enums.AttachmentType.HTML ? '' : contentUrl )
        .replace( REPLACE_BODY, content )
        .replace( /\r?\n|\r|\s\s+/g, '' )
        .trim();
};


async function getContent( url: string ) : Promise<string> {
    try {
        const response = await fetch( url );
        return await response.text();
    } catch ( error ) {
        return `<p>Error al cargar el contenido.</p>`;
    }
}
