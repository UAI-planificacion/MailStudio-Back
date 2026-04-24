import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars {
    PORT            : number;
    DATABASE_URL    : string;
    ALLOWED_ORIGINS : string;

    FILE_MANAGER_URL            : string;
    FILE_MANAGER_FOLDER         : string;
    FILE_MANAGER_FORMAT         : string;
    FILE_MANAGER_QUALITY        : number;
    FILE_MANAGER_MAX_RETRIES    : number;
    FILE_MANAGER_RETRY_DELAY    : number;

    PGHOST      : string;
    PGPORT      : number;
    PGDATABASE  : string;
    PGUSER      : string;
    PGPASSWORD  : string;

    AZURE_BUS_CONNECTION    : string;
    AZURE_QUEUE_NAME        : string;
    AZURE_QUEUE_RECURRENCE_NAME        : string;


    IMAGE_UPLOAD_URL: string;

    MAX_CONCURRENT_BATCHES: number;
}


const envsSchema = joi.object({
    PORT            : joi.number().required(),
    DATABASE_URL    : joi.string().required(),
    ALLOWED_ORIGINS : joi.string().required(),

    FILE_MANAGER_URL            : joi.string().required(),
    FILE_MANAGER_FOLDER         : joi.string().required(),
    FILE_MANAGER_FORMAT         : joi.string().optional(),
    FILE_MANAGER_QUALITY        : joi.number().optional(),
    FILE_MANAGER_MAX_RETRIES    : joi.number().optional(),
    FILE_MANAGER_RETRY_DELAY    : joi.number().optional(),

    PGHOST      : joi.string().required(),
    PGPORT      : joi.number().required(),
    PGDATABASE  : joi.string().required(),
    PGUSER      : joi.string().required(),
    PGPASSWORD  : joi.string().required(),

    AZURE_BUS_CONNECTION        : joi.string().required(),
    AZURE_QUEUE_NAME            : joi.string().required(),
    AZURE_QUEUE_RECURRENCE_NAME : joi.string().required(),

    IMAGE_UPLOAD_URL : joi.string().required(),

    MAX_CONCURRENT_BATCHES : joi.number().optional(),

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
        FOLDER      : envVars.FILE_MANAGER_FOLDER,
        FORMAT      : envVars.FILE_MANAGER_FORMAT,
        QUALITY     : envVars.FILE_MANAGER_QUALITY,
        MAX_RETRIES : envVars.FILE_MANAGER_MAX_RETRIES,
        RETRY_DELAY : envVars.FILE_MANAGER_RETRY_DELAY,
    },

    AZURE_BUS : {
        CONNECTION                  : envVars.AZURE_BUS_CONNECTION,
        QUEUE_NAME                  : envVars.AZURE_QUEUE_NAME,
        AZURE_QUEUE_RECURRENCE_NAME : envVars.AZURE_QUEUE_RECURRENCE_NAME,
        MAX_CONCURRENT_BATCHES          : envVars.MAX_CONCURRENT_BATCHES,
    },

    IMAGE_UPLOAD_URL: envVars.IMAGE_UPLOAD_URL,
}
