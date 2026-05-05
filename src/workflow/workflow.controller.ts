import { Controller, Get, Post, Param } from '@nestjs/common';
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


    @Post( ':id/prepare-execution' )
    async prepareExecution( @Param( 'id' ) id: string ) {
        return await this.workflowService.prepareExecution( id );
    }

}
