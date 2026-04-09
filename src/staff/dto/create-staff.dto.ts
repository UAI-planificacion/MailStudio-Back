import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateStaffDto {

	@IsString()
	@IsNotEmpty()
	name	: string;

	@IsEmail()
	@IsNotEmpty()
	email	: string;

	@IsEnum( Role )
	@IsNotEmpty()
	role	: Role;

}
