import { 
    IsOptional, 
    IsString, 
    Length 
}               from 'class-validator';


export class UpdateImageDto {

    @IsString()
    @IsOptional()
    @Length( 1, 50 )
    name : string;

}
