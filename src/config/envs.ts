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
    }
}
