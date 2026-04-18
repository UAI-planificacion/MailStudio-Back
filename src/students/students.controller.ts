import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode
} from '@nestjs/common';

import { StudentsService }  from '@students/students.service';
import { SearchStudentDto } from '@students/dto/search-student.dto';


@Controller( 'students' )
export class StudentsController {
	constructor(
        private readonly studentsService : StudentsService
    ) {}


    @Post( 'search' )
	@HttpCode( 200 )
	search(
        @Body() filters : SearchStudentDto
    ) {
		return this.studentsService.findStudents( filters );
	}


    @Get( 'emails' )
	getEmails() {
		return this.studentsService.getEmails();
	}


    @Get( 'statuses' )
	getStatuses() {
		return this.studentsService.getStatuses();
	}


    @Get( 'cohorts' )
	getCohorts() {
		return this.studentsService.getCohorts();
	}
}
