import { Injectable } from '@nestjs/common';

import { Prisma, Headquarters } from '@prisma/client';

import { PrismaService }    from '@prisma/prisma.service';
import { SearchStudentDto } from '@students/dto/search-student.dto';


@Injectable()
export class StudentsService {
	constructor( private prisma : PrismaService ) {}

	async findStudents( filters : SearchStudentDto ) {
		const {
			emails, status, cohorts,
			regionIds, sedeIds, cityIds,
			facultyIds, careerIds, studyPlanIds,
			periodIds, subjectIds, buildingIds, professorIds,
			spaceIds, dayIds, dayModuleIds,
			startTime, endTime,
		} = filters;

		const where : Prisma.StudentWhereInput = {};

		// 1. Filtros Directos
		if ( emails ) {
			where.email = { in : emails };
		}

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
		if ( periodIds || subjectIds || buildingIds || professorIds || spaceIds || dayIds || dayModuleIds || ( startTime && endTime ) ) {
			where.sections = {
				some : {
					...( periodIds && { periodId : { in : periodIds } }),
					...( subjectIds && { subjectId : { in : subjectIds } }),
					...( buildingIds && { buildingId : { in : buildingIds } }),
					...( professorIds && { professorId : { in : professorIds } }),

					// Filtros de Sesión profunda
					...( ( spaceIds || dayIds || dayModuleIds || ( startTime && endTime ) ) && {
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

		return this.prisma.student.findMany({
			where,
		});
	}
}
