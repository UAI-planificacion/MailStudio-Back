import { TemplateResponse } from '@templates/interfaces/template-response.interface';


export const SELECT_TEMPLATE = {
    id          : true,
    name        : true,
    content     : true,
    updatedAt   : true,
    createdAt   : true,
    cc          : true,
    bcc         : true,
    active      : true,
    images      : {
        select : {
            image : {
                select : {
                    url : true
                }
            }
        }
    },
    creator     : {
        select : {
            id    : true,
            name  : true,
            email : true,
            role  : true,
        }
    },
    updater   : {
        select : {
            id    : true,
            name  : true,
            email : true,
            role  : true,
        }
    },
}


export function transformTemplateResponse( templates : any[] ) : TemplateResponse[] {
    return templates.map( TRANSFORM );
}


export function transformOneTemplateResponse( template : any ) : TemplateResponse {
    return TRANSFORM( template )
}


const TRANSFORM = ( template : any ) : TemplateResponse => ({
    ...template,
    images : ( template?.images?.length ?? 0 ) > 0
        ? template.images.map( ( image : any ) => image.image.url )
        : [],
});
