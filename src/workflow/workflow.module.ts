import { Module } from '@nestjs/common';

import { WorkflowService }              from '@workflow/workflow.service';
import { WorkflowController }           from '@workflow/workflow.controller';
import { WorkflowValidationService }    from '@common/service/workflow';


@Module({
    controllers : [ WorkflowController ],
    providers   : [ WorkflowService, WorkflowValidationService ],
})
export class WorkflowModule {}
