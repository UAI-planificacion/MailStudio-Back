import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { regions }    from './data/region.data';
import { cities }     from './data/city.data';
import { buildings }  from './data/building.data';
import { faculties }  from './data/faculty.data';
import { grades }     from './data/grade.data';
import { periods }    from './data/period.data';
import { days }       from './data/day.data';
import { modules }    from './data/module.data';
import { dayModules } from './data/day-module.data';
import { careers }    from './data/career.data';
import { studyPlans } from './data/study-plan.data';
import { subjects }   from './data/subject.data';
import { professors } from './data/professor.data';
import { students }   from './data/student.data';
import { sections }   from './data/section.data';
import { sessions }   from './data/session.data';
import { sizes }      from './data/size.data';


@Injectable( )
export class SeedService {

	constructor( private readonly prisma : PrismaService ) { }


	async runSeed( ) {
		// 1. Limpiar base de datos
		await this.deleteAll( );

		// 2. Lote 1: Entidades Independientes
		await this.prisma.region.createMany({ data : regions });
		await this.prisma.day.createMany({ data : days });
		await this.prisma.module.createMany({ data : modules });
		await this.prisma.professor.createMany({ data : professors });
		await this.prisma.period.createMany({ data : periods });
		await this.prisma.faculty.createMany({ data : faculties });
		await this.prisma.grade.createMany({ data : grades });
		await this.prisma.size.createMany({ data : sizes });
		await this.prisma.building.createMany({ data : buildings });

		// 3. Lote 2: Geografía y Tiempo (Dependientes de Lote 1)
		await this.prisma.city.createMany({ data : cities });
		await this.prisma.dayModule.createMany({ data : dayModules });

		// 4. Lote 3: Estructura Académica (Dependientes de Lote 1)
		await this.prisma.career.createMany({ data : careers });

		// 5. Lote 4: Planes de Estudio y Asignaturas
		await this.prisma.studyPlan.createMany({ data : studyPlans });
		await this.prisma.subject.createMany({ data : subjects });

		// 6. Lote 5: Vincular Asignaturas a Planes de Estudio (M:N)
		// Vinculamos todas las asignaturas de la misma facultad a los planes de estudio
		for ( const plan of studyPlans ) {
			const career     = careers.find( ( c ) => c.id === plan.careerId );
			const facultyId  = career?.facultyId;

			if ( facultyId ) {
				const planSubjects = subjects.filter( ( s ) => s.facultyId === facultyId );
				await this.prisma.studyPlan.update({
					where : { id : plan.id },
					data  : {
						subjects : {
							connect : planSubjects.map( ( s ) => ({ id : s.id })),
						},
					},
				});
			}
		}

		// 7. Lote 6: Secciones
		await this.prisma.section.createMany({ data : sections });

		// 8. Lote 7: Estudiantes
		await this.prisma.student.createMany({ data : students });

		// 9. Lote 8: Sesiones
		await this.prisma.session.createMany({ data : sessions });

		// 10. Lote 9: Asignación Automática Estudiante - Sección (M:N)
		// Para cada estudiante, lo inscribimos en una sección de cada asignatura de su plan
		for ( const student of students ) {
			const plan = await this.prisma.studyPlan.findUnique({
				where   : { id : student.studyPlanId },
				include : { subjects : true },
			});

			if ( plan && plan.subjects.length > 0 ) {
				const subjectIds = plan.subjects.map( ( s ) => s.id );
				
				// Buscamos todas las secciones de las asignaturas del plan
				const availableSections = await this.prisma.section.findMany({
					where : { subjectId : { in : subjectIds } },
				});

				// Agrupamos secciones por asignatura para elegir solo una sección por ramo
				const sectionsToConnect : { id : string }[ ] = [ ];
				const processedSubjects                      = new Set( );

				for ( const section of availableSections ) {
					if ( !processedSubjects.has( section.subjectId ) ) {
						sectionsToConnect.push({ id : section.id });
						processedSubjects.add( section.subjectId );
					}
				}

				if ( sectionsToConnect.length > 0 ) {
					await this.prisma.student.update({
						where : { id : student.id },
						data  : {
							sections : {
								connect : sectionsToConnect,
							},
						},
					});
				}
			}
		}

		return { message : 'Seed executed successfully' };
	}


	async deleteAll( ) {
		// El orden de eliminación es inverso a la dependencia para evitar errores de FK
		// Primero tablas de unión o con muchas FK
		await this.prisma.session.deleteMany( );
		await this.prisma.student.deleteMany( ); // StudentSections se limpia automáticamente al ser implícita
		await this.prisma.section.deleteMany( );
		await this.prisma.subject.deleteMany( );
		await this.prisma.studyPlan.deleteMany( );
		await this.prisma.career.deleteMany( );
		await this.prisma.dayModule.deleteMany( );
		await this.prisma.city.deleteMany( );

		// Luego tablas base
		await this.prisma.building.deleteMany( );
		await this.prisma.professor.deleteMany( );
		await this.prisma.period.deleteMany( );
		await this.prisma.faculty.deleteMany( );
		await this.prisma.grade.deleteMany( );
		await this.prisma.size.deleteMany( );
		await this.prisma.module.deleteMany( );
		await this.prisma.day.deleteMany( );
		await this.prisma.region.deleteMany( );

		return { message : 'All data deleted successfully' };
	}

}
