import { Controller, Get, Param } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {

    constructor(
        private readonly workflowService: WorkflowService
    ) {}


    @Get()
    async getAll() {
        return await this.workflowService.findAll();
    }


    @Get( ':id' )
    async getOne( @Param( 'id' ) id: string ) {
        return await this.workflowService.findOne( id );
    }

}
