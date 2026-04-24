import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class WorkflowService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    
    async findAll() {
        return await this.prisma.workflow.findMany();
    }

    async findOne( id: string ) {
        return await this.prisma.workflow.findUnique({
            where: {
                id
            }
        });
    }

}
