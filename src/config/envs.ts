import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars {
    PORT            : number;
    DATABASE_URL    : string;
    ALLOWED_ORIGINS : string;

    FILE_MANAGER_URL            : string;
    FILE_MANAGER_ENDPOINT_ADMIN : string;
    FILE_MANAGER_ENDPOINT_IMAGE : string;
    FILE_MANAGER_ENDPOINT_VIDEO : string;
    FILE_MANAGER_ENDPOINT_RAW   : string;

    FILE_MANAGER_FOLDER             : string;
    FILE_MANAGER_FOLDER_IMAGE       : string;
    FILE_MANAGER_FOLDER_IMAGE_RAW   : string;
    FILE_MANAGER_FOLDER_VIDEO       : string;
    FILE_MANAGER_FOLDER_PDF         : string;
    FILE_MANAGER_FOLDER_TXT         : string;
    FILE_MANAGER_FOLDER_HTML        : string;
    FILE_MANAGER_FOLDER_OTHER       : string;

    FILE_MANAGER_FORMAT      : string;
    FILE_MANAGER_QUALITY     : number;
    FILE_MANAGER_MAX_RETRIES : number;
    FILE_MANAGER_RETRY_DELAY : number;

    PGHOST      : string;
    PGPORT      : number;
    PGDATABASE  : string;
    PGUSER      : string;
    PGPASSWORD  : string;

    AZURE_BUS_CONNECTION    : string;
    AZURE_QUEUE_NAME        : string;
    AZURE_QUEUE_RECURRENCE_NAME : string;

    IMAGE_CLOUDINARY_URL    : string;
    VIDEO_CLOUDINARY_URL    : string;
    RAW_CLOUDINARY_URL      : string;

    MAX_CONCURRENT_BATCHES: number;

    FRONTEND_URL     : string;
    PREVIEW_ENDPOINT : string;
}


const envsSchema = joi.object({
    PORT            : joi.number().required(),
    DATABASE_URL    : joi.string().required(),
    ALLOWED_ORIGINS : joi.string().required(),

    FILE_MANAGER_URL            : joi.string().required(),
    FILE_MANAGER_ENDPOINT_ADMIN : joi.string().required(),
    FILE_MANAGER_ENDPOINT_IMAGE : joi.string().required(),
    FILE_MANAGER_ENDPOINT_VIDEO : joi.string().required(),
    FILE_MANAGER_ENDPOINT_RAW   : joi.string().required(),

    FILE_MANAGER_FOLDER             : joi.string().optional().default( 'uai|mailstudio' ),
    FILE_MANAGER_FOLDER_IMAGE       : joi.string().optional().default( 'images' ),
    FILE_MANAGER_FOLDER_IMAGE_RAW   : joi.string().optional().default( 'files|image' ),
    FILE_MANAGER_FOLDER_VIDEO       : joi.string().optional().default( 'files|video' ),
    FILE_MANAGER_FOLDER_PDF         : joi.string().optional().default( 'files|pdf' ),
    FILE_MANAGER_FOLDER_TXT         : joi.string().optional().default( 'files|txt' ),
    FILE_MANAGER_FOLDER_HTML        : joi.string().optional().default( 'files|html' ),
    FILE_MANAGER_FOLDER_OTHER       : joi.string().optional().default( 'files|other' ),

    FILE_MANAGER_MAX_RETRIES : joi.number().optional().default( 3 ),
    FILE_MANAGER_RETRY_DELAY : joi.number().optional().default( 2000 ),
    FILE_MANAGER_FORMAT      : joi.string().optional().default( 'avif' ),
    FILE_MANAGER_QUALITY     : joi.number().optional().default( 50 ),

    PGHOST      : joi.string().required(),
    PGPORT      : joi.number().required(),
    PGDATABASE  : joi.string().required(),
    PGUSER      : joi.string().required(),
    PGPASSWORD  : joi.string().required(),

    AZURE_BUS_CONNECTION        : joi.string().required(),
    AZURE_QUEUE_NAME            : joi.string().required(),
    AZURE_QUEUE_RECURRENCE_NAME : joi.string().required(),

    IMAGE_CLOUDINARY_URL    : joi.string().required(),
    VIDEO_CLOUDINARY_URL    : joi.string().required(),
    RAW_CLOUDINARY_URL      : joi.string().required(),

    MAX_CONCURRENT_BATCHES : joi.number().optional(),

    FRONTEND_URL     : joi.string().required(),
    PREVIEW_ENDPOINT : joi.string().required(),

})
.unknown( true );


const { error, value } = envsSchema.validate( process.env );


if ( error ) throw new Error( `Config validation error: ${ error.message }` );


const envVars: EnvVars = value;


export const ENVS = {
    PORT            : envVars.PORT,
    DATABASE_URL    : envVars.DATABASE_URL,
    ALLOWED_ORIGINS : envVars.ALLOWED_ORIGINS.split( ',' ),

    FILE_MANAGER : {
        URL         : envVars.FILE_MANAGER_URL,
        FOLDER      : {
            BASE        : envVars.FILE_MANAGER_FOLDER,
            IMAGE       : envVars.FILE_MANAGER_FOLDER_IMAGE,
            IMAGE_RAW   : envVars.FILE_MANAGER_FOLDER_IMAGE_RAW,
            VIDEO       : envVars.FILE_MANAGER_FOLDER_VIDEO,
            PDF         : envVars.FILE_MANAGER_FOLDER_PDF,
            TXT         : envVars.FILE_MANAGER_FOLDER_TXT,
            HTML        : envVars.FILE_MANAGER_FOLDER_HTML,
            OTHER       : envVars.FILE_MANAGER_FOLDER_OTHER,
        },
        ENDPOINT    : {
            ADMIN       : envVars.FILE_MANAGER_ENDPOINT_ADMIN,
            IMAGE       : envVars.FILE_MANAGER_ENDPOINT_IMAGE,
            VIDEO       : envVars.FILE_MANAGER_ENDPOINT_VIDEO,
            RAW         : envVars.FILE_MANAGER_ENDPOINT_RAW,
        },
        FORMAT      : envVars.FILE_MANAGER_FORMAT,
        QUALITY     : envVars.FILE_MANAGER_QUALITY,
        MAX_RETRIES : envVars.FILE_MANAGER_MAX_RETRIES,
        RETRY_DELAY : envVars.FILE_MANAGER_RETRY_DELAY,
    },

    AZURE_BUS : {
        CONNECTION                  : envVars.AZURE_BUS_CONNECTION,
        QUEUE_NAME                  : envVars.AZURE_QUEUE_NAME,
        AZURE_QUEUE_RECURRENCE_NAME : envVars.AZURE_QUEUE_RECURRENCE_NAME,
        MAX_CONCURRENT_BATCHES      : envVars.MAX_CONCURRENT_BATCHES,
    },

    CLOUDINARY : {
        IMAGE_URL   : envVars.IMAGE_CLOUDINARY_URL,
        VIDEO_URL   : envVars.VIDEO_CLOUDINARY_URL,
        RAW_URL     : envVars.RAW_CLOUDINARY_URL,
    },

	FRONTEND : {
		URL              : envVars.FRONTEND_URL,
		PREVIEW_ENDPOINT : envVars.PREVIEW_ENDPOINT,
	}
}
