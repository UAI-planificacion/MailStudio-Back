import { PartialType } from '@nestjs/mapped-types';

import { CreateImageDto } from '@images/dto/create-image.dto';


export class UpdateImageDto extends PartialType( CreateImageDto ) {}
