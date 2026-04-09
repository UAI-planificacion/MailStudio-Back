import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars {
    PORT            : number;
    DATABASE_URL    : string;
    ALLOWED_ORIGINS : string;

    FILE_MANAGER_URL    : string;
    FILE_MANAGER_FOLDER : string;

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

    FILE_MANAGER_URL    : joi.string().required(),
    FILE_MANAGER_FOLDER : joi.string().required(),

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

    FILE_MANAGER_URL    : envVars.FILE_MANAGER_URL,
    FILE_MANAGER_FOLDER : envVars.FILE_MANAGER_FOLDER,
}
