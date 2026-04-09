import { Module }             from '@nestjs/common';

import { ImagesService }        from '@images/images.service';
import { ImagesController }     from '@images/images.controller';
import { FileManagerService }   from '@services/file-manager.service';


@Module ( {
    controllers : [ ImagesController ],
    providers   : [ ImagesService, FileManagerService ],
} )
export class ImagesModule {}
