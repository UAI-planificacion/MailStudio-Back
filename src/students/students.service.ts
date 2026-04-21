import { Injectable } from '@nestjs/common';

import { Prisma, Headquarters, StudentStatus } from '@prisma/client';

import { PrismaService }    from '@prisma/prisma.service';
import { SearchStudentDto } from '@students/dto/search-student.dto';

@Injectable()
export class StudentsService {
	constructor( private prisma : PrismaService ) {}

	async findStudents( filters : SearchStudentDto ) {
		const {
			// emails,
            status, cohorts,
			regionIds, sedeIds, cityIds,
			facultyIds, careerIds, studyPlanIds,
			periodIds, subjectIds, buildingNames, professorIds,
			spaceIds, dayIds, dayModuleIds,
			startTime, endTime,
		} = filters;

		const where : Prisma.StudentWhereInput = {};

		// 1. Filtros Directos
		// if ( emails ) {
		// 	where.email = { in : emails };
		// }

        if ( status ) {
			where.status = { in : status };
		}

        if ( cohorts ) {
			where.cohort = { in : cohorts };
		}

        if ( cityIds ) {
			where.cityId = { in : cityIds };
		}

        if ( studyPlanIds ) {
			where.studyPlanId = { in : studyPlanIds };
		}

		// Mapeo de Sedes (Enum)
		if ( sedeIds ) {
			where.headquarter = { in : sedeIds as Headquarters[] };
		}

		// Filtro de Región (Deep Location)
		if ( regionIds ) {
			where.city = {
				regionId : { in : regionIds },
			};
		}

		// 2. Filtros Académicos Profundos
		if ( facultyIds || careerIds ) {
			where.studyPlan = {
				career : {
					...( careerIds && { id : { in : careerIds } }),
					...( facultyIds && { facultyId : { in : facultyIds } }),
				},
			};
		}

		// 3. Filtros de Sección y Sesión
		if ( periodIds || subjectIds || buildingNames || professorIds || spaceIds || dayIds || dayModuleIds || ( startTime && endTime ) ) {
			where.sections = {
				some : {
					...( periodIds     && { periodId    : { in : periodIds } } ),
					...( subjectIds    && { subjectId   : { in : subjectIds } } ),
					...( buildingNames && { building    : { name : { in : buildingNames } } } ),
					...( professorIds  && { professorId : { in : professorIds } } ),

					// Filtros de Sesión profunda
					...( ( spaceIds || dayIds || dayModuleIds || ( startTime && endTime )) && {
						sessions : {
							some : {
								...( spaceIds && { spaceId : { in : spaceIds } }),
								...( startTime && endTime && {
									startTime : { gte : new Date( startTime ) },
									endTime   : { lte : new Date( endTime ) },
								}),
								// Filtro por Día y Módulo
								...( ( dayIds || dayModuleIds ) && {
									dayModule : {
										...( dayIds && { dayId : { in : dayIds.map( ( id ) => Number( id ) ) } }),
										...( dayModuleIds && { moduleId : { in : dayModuleIds.map( ( id ) => Number( id ) ) } }),
									},
								}),
							},
						},
					}),
				},
			};
		}

		const students = await this.prisma.student.findMany({
			where,
			select : {
                id: true,
                studyPlanId: true,
                cityId: true,
                name: true,
                email: true,
                status: true,
                cohort: true,
                birthDate: true,
                rut: true,
                headquarter: true,
				city      : {
                    select : {
                        regionId : true
                    }
                },
				studyPlan : {
					select : {
						careerId : true,
						career   : { select : { facultyId : true } },
					},
				},
				sections : {
					select : {
						id        : true,
						periodId  : true,
						building  : { select : { name : true } },
						subject   : { select : { id: true, gradeId : true } },
					},
				},
			},
		});

		return students.map(( student ) => ({
            ...student,
			regionId      : student.city.regionId,
			facultyId     : student.studyPlan.career.facultyId,
			careerId      : student.studyPlan.careerId,
			buildingNames : [ ...new Set( student.sections.map(( sec ) => sec.building?.name ).filter( Boolean ) ) ],
			gradeIds      : [ ...new Set( student.sections.map(( sec ) => sec.subject.gradeId ).filter( Boolean ) ) ],
			periodIds     : [ ...new Set( student.sections.map(( sec ) => sec.periodId ) ) ],
			subjectIds    : [ ...new Set( student.sections.map(( sec ) => sec.subject.id ) ) ],
			sectionIds    : [ ...new Set( student.sections.map(( sec ) => sec.id ) ) ],
		}));
	}


    async getEmails() : Promise<string[]> {
		const students = await this.prisma.student.findMany({
			distinct : [ 'email' ],
			select   : { email : true },
		});

		return students.map(( s ) => s.email );
	}


    async getStatuses() : Promise<{ value : StudentStatus, label : string }[]> {
		const translations : Record<StudentStatus, string> = {
			[ StudentStatus.ACTIVE ]    : 'Activo',
			[ StudentStatus.SUSPENDED ] : 'Suspendido',
			[ StudentStatus.INACTIVE ]  : 'Inactivo',
			[ StudentStatus.GRADUATED ] : 'Graduado',
		};

		return Object.values( StudentStatus ).map(( status ) => ({
			value : status,
			label : translations[ status ],
		}));
	}


    async getCohorts() : Promise<string[]> {
		const result = await this.prisma.student.findMany({
			distinct : [ 'cohort' ],
			select   : { cohort : true },
		});

		return result.map(( s ) => s.cohort );
	}
}

