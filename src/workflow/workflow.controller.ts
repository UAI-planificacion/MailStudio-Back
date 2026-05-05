import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query
} from '@nestjs/common';

import { WorkflowService }      from '@workflow/workflow.service';
import { UpdateWorkflowDto }    from '@workflow/dto/update-workflow.dto';
import { SendEmailWorkflowDto } from '@send-emails/dto/send-email-workflow.dto';
import { FindAllWorkflowDto }   from './dto/find-all-workflow.dto';


@Controller( 'workflow' )
export class WorkflowController {

    constructor(
        private readonly workflowService: WorkflowService
    ) {}


    @Get()
    async getAll( @Query() query: FindAllWorkflowDto ) {
        return await this.workflowService.findAll( query );
    }


    @Get( ':id' )
    async getOne( @Param( 'id' ) id: string ) {
        return await this.workflowService.findOne( id );
    }


    @Post()
    async create( @Body() createWorkflowDto: SendEmailWorkflowDto ) {
        return await this.workflowService.create( createWorkflowDto );
    }


    @Patch( ':id' )
    async update(
        @Param( 'id' ) id: string,
        @Body() updateWorkflowDto: UpdateWorkflowDto
    ) {
        return await this.workflowService.update( id, updateWorkflowDto );
    }


    @Delete( ':id' )
    async remove( @Param( 'id' ) id: string ) {
        return await this.workflowService.remove( id );
    }


    @Post( ':id/prepare-execution' )
    async prepareExecution( @Param( 'id' ) id: string ) {
        return await this.workflowService.prepareExecution( id );
    }

}
