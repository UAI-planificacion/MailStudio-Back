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
        select: {
            imageId: true
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


export function transformTemplateResponse( templates: any[] ): any[] {
    return templates.map( TRANSFORM );
}


export function transformOneTemplateResponse( template: any ): any {
    return TRANSFORM( template )
}


const TRANSFORM = ( template : any ) => ({
    ...template,
    images:  ( template?.images?.length ?? 0 ) > 0
        ? template.images.map((image : any) => image.imageId)
        : [],
});
