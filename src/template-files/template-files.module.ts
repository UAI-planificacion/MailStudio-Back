import { Module } from '@nestjs/common';

import { TemplateFilesService }     from '@template-files/template-files.service';
import { TemplateFilesController }  from '@template-files/template-files.controller';
import { FileManagerService }       from '@services/file-manager.service';

@Module({
    controllers : [ TemplateFilesController ],
    providers   : [ TemplateFilesService, FileManagerService ],
})
export class TemplateFilesModule {}
