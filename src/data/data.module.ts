import { Module } from '@nestjs/common';

import { PrismaModule }     from '@prisma/prisma.module';
import { DataController }   from '@data/data.controller';
import { DataService }      from '@data/data.service';

@Module({
	imports     : [ PrismaModule ],
	controllers : [ DataController ],
	providers   : [ DataService ],
})
export class DataModule {}
