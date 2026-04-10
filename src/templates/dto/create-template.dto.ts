import {
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    Length
}               from 'class-validator';


export class CreateTemplateDto {

	@IsString()
	@IsNotEmpty()
    @Length( 3, 50 )
	name: string;

	@IsObject()
	@IsNotEmpty()
	content: Record<string, any>;

	@IsString()
	@IsNotEmpty()
    @Length( 26, 26 )
	createdBy: string;

	@IsString()
	@IsOptional()
    @Length( 26, 26 )
	updatedBy?: string;

}
