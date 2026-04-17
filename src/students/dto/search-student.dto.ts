import {
    IsOptional,
    IsString,
    IsEnum,
    IsArray,
    IsDateString
}                           from 'class-validator';
import { Transform }        from 'class-transformer';
import { StudentStatus }    from '@prisma/client';


export class SearchStudentDto {
    // --- Filtros Directos Estudiante ---
    // @IsOptional()
    // @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    // @IsArray()
    // @IsString({ each: true })
    // names?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    emails?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsEnum(StudentStatus, { each: true })
    status?: StudentStatus[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    cohorts?: string[];

    // --- Filtros de Ubicación ---
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    regionIds?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    sedeIds?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    cityIds?: string[];

    // --- Filtros Académicos ---
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    facultyIds?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    careerIds?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    studyPlanIds?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    subjectIds?: string[];

    // --- Filtros de Planificación (Sección) ---
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    periodIds?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    buildingIds?: string[];

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    professorIds?: string[];

    // --- Filtros de Sesión y Espacio ---
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    spaceIds?: string[]; // IDs de salas

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    dayIds?: string[]; // Para filtrar Lunes, Martes (1, 2, etc.)

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    @IsArray()
    @IsString({ each: true })
    dayModuleIds?: string[]; // Módulos UAI

    // --- Filtros de Tiempo Exacto ---
    @IsOptional()
    @IsDateString()
    startTime?: string;

    @IsOptional()
    @IsDateString()
    endTime?: string;
}
