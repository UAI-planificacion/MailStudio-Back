import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    Length
}               from 'class-validator';
import { Role } from '@prisma/client';


export class CreateStaffDto {

	@IsString()
	@IsNotEmpty()
    @Length( 3, 50 )
	name: string;

	@IsEmail()
	@IsNotEmpty()
    @Length( 3, 50 )
	email: string;

	@IsEnum( Role )
	@IsNotEmpty()
	role: Role;

}
