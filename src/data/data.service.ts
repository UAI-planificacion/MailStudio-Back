import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';


@Injectable()
export class DataService {
	constructor( private prisma : PrismaService ) {}

	// Geography
	findAllRegions() { return this.prisma.region.findMany(); }
	findAllCities() { return this.prisma.city.findMany(); }

	// Infrastructure
	findAllBuildings() { return this.prisma.building.findMany(); }
	findAllSizes() { return this.prisma.size.findMany(); }

	// Academic Hierarchy
	findAllFaculties() { return this.prisma.faculty.findMany(); }
	findAllCareers() { return this.prisma.career.findMany(); }
	findAllStudyPlans() { return this.prisma.studyPlan.findMany(); }
	findAllGrades() { return this.prisma.grade.findMany(); }

	// Schedule Basis
	findAllPeriods() { return this.prisma.period.findMany(); }
	findAllSubjects() { return this.prisma.subject.findMany(); }
	findAllProfessors() { return this.prisma.professor.findMany(); }
	findAllDays() { return this.prisma.day.findMany(); }
	findAllModules() { return this.prisma.module.findMany(); }
	findAllDayModules() { return this.prisma.dayModule.findMany(); }

	// Operational
	findAllSections() { return this.prisma.section.findMany(); }
	findAllSessions() { return this.prisma.session.findMany(); }
}
