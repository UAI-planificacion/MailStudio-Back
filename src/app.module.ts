import { Module } from '@nestjs/common';

import { AppController }    from '@app/app.controller';
import { PrismaModule }     from '@prisma/prisma.module';
import { StaffModule }      from '@staff/staff.module';
import { ImagesModule }     from '@images/images.module';
import { TemplatesModule }  from '@templates/templates.module';
import { StudentsModule }   from '@students/students.module';
import { SendEmailsModule } from '@send-emails/send-emails.module';
import { SeedModule }       from '@seed/seed.module';
import { DataModule }       from '@data/data.module';


@Module({
    imports     : [ 
        PrismaModule, 
        StaffModule, 
        ImagesModule, 
        TemplatesModule, 
        StudentsModule, 
        SendEmailsModule,
        SeedModule,
        DataModule 
    ],
    controllers : [ AppController ],
})
export class AppModule {}
