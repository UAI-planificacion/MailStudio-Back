import { ENVS }             from "@config/envs";
import { TemplateContent }  from "./templateContent.model";


const validateSlashes = ( path : string ) : string => {
	if ( !path ) return '';

    return path.endsWith( '/' ) ? path : `${ path }/`;
};


const generateUrl = ( path : string ) => `${ validateSlashes( ENVS.IMAGE_UPLOAD_URL ) }${ ENVS.FILE_MANAGER.FOLDER.replace( '|', '/' ) }/${ path }`;


export const generateTemplate = (
	templateContent : TemplateContent
) : string => {
	const headerHtml = templateContent.headerImage
		? `<img src="${ generateUrl( templateContent.headerImage ) }" style="display:block;width:100%" alt="header">`
		: '';

	const footerHtml = templateContent.footerImage
		? `<img src="${ generateUrl( templateContent.footerImage ) }" style="display:block;width:100%" alt="footer">`
		: '';

	const html = `
		<!DOCTYPE html>
		<html lang="es">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width,initial-scale=1.0">
			<title>Notificación UAI | MailStudio</title>
		</head>
		<body style="margin:0;font-family:sans-serif">
			<div style="max-width:800px;margin:0 auto">
				${ headerHtml }
				<div style="display:block;clear:both;padding:20px 0">${ templateContent.htmlContent }</div>
				${ footerHtml }
			</div>
		</body>
		</html>`.trim();

	return html.replace( /\r?\n|\r|\s\s+/g, '' ).trim();
};
