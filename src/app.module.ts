import { Module } from '@nestjs/common';

import { AppController }    from '@app/app.controller';
import { PrismaModule }     from '@prisma/prisma.module';
import { StaffModule }      from '@staff/staff.module';
import { ImagesModule }     from '@images/images.module';
import { TemplatesModule }  from '@templates/templates.module';
import { StudentsModule }   from '@students/students.module';
import { SendEmailsModule } from '@send-emails/send-emails.module';


@Module({
    imports     : [ 
        PrismaModule, 
        StaffModule, 
        ImagesModule, 
        TemplatesModule, 
        StudentsModule, 
        SendEmailsModule 
    ],
    controllers : [ AppController ],
})
export class AppModule {}
