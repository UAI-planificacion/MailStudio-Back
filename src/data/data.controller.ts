import { Controller, Get } from '@nestjs/common';

import { DataService } from '@data/data.service';


@Controller( 'data' )
export class DataController {
	constructor( private readonly dataService : DataService ) {}

	// Geography
	@Get( 'regions' )
	findAllRegions() { return this.dataService.findAllRegions(); }

	@Get( 'cities' )
	findAllCities() { return this.dataService.findAllCities(); }

	// Infrastructure
	@Get( 'buildings' )
	findAllBuildings() { return this.dataService.findAllBuildings(); }

	@Get( 'sizes' )
	findAllSizes() { return this.dataService.findAllSizes(); }

	// Academic Hierarchy
	@Get( 'faculties' )
	findAllFaculties() { return this.dataService.findAllFaculties(); }

	@Get( 'careers' )
	findAllCareers() { return this.dataService.findAllCareers(); }

	@Get( 'study-plans' )
	findAllStudyPlans() { return this.dataService.findAllStudyPlans(); }

	@Get( 'grades' )
	findAllGrades() { return this.dataService.findAllGrades(); }

	// Schedule Basis
	@Get( 'periods' )
	findAllPeriods() { return this.dataService.findAllPeriods(); }

	@Get( 'subjects' )
	findAllSubjects() { return this.dataService.findAllSubjects(); }

	@Get( 'professors' )
	findAllProfessors() { return this.dataService.findAllProfessors(); }

	@Get( 'days' )
	findAllDays() { return this.dataService.findAllDays(); }

	@Get( 'modules' )
	findAllModules() { return this.dataService.findAllModules(); }

	@Get( 'day-modules' )
	findAllDayModules() { return this.dataService.findAllDayModules(); }

	// Operational
	@Get( 'sections' )
	findAllSections() { return this.dataService.findAllSections(); }

	@Get( 'sessions' )
	findAllSessions() { return this.dataService.findAllSessions(); }
}
