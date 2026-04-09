import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTemplateDto {

	@IsString()
	@IsNotEmpty()
	name		: string;

	@IsObject()
	@IsNotEmpty()
	content		: Record<string, any>;

	@IsString()
	@IsNotEmpty()
	createdBy	: string;

	@IsString()
	@IsOptional()
	updatedBy?	: string;

}
