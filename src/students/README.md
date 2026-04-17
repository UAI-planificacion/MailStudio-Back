# Guía de Búsqueda Dinámica de Estudiantes

Este documento detalla el uso del servicio de búsqueda dinámica de estudiantes en el backend. Está diseñado para que tanto desarrolladores como IAs en el front-end puedan implementar interfaces de filtrado potentes y precisas.

## Información del Endpoint

- **Ruta**: `/students/search`
- **Método**: `POST`
- **Código de Éxito**: `200 OK`

## Estructura del Payload (`SearchStudentDto`)

La búsqueda utiliza una lógica de conjuntos (**IN**). Todos los campos marcados como arreglos (`string[]`) permiten enviar múltiples valores simultáneamente.

### 1. Filtros Directos (Atributos base del Estudiante)
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `emails` | `string[]` | Lista de correos electrónicos exactos. |
| `status` | `StudentStatus[]` | Estados del alumno: `ACTIVE`, `SUSPENDED`, `INACTIVE`, `GRADUATED`. |
| `cohorts` | `string[]` | Años de ingreso (ej: `["2023", "2024"]`). |

### 2. Filtros de Ubicación (Geografía)
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `regionIds` | `string[]` | IDs de las regiones. |
| `sedeIds` | `string[]` | IDs de sedes (Enum: `ERRAZURIZ`, `PENALOLEN`, `VINADELMAR`, `VITACURA`). |
| `cityIds` | `string[]` | IDs de las ciudades específicas. |

### 3. Filtros Académicos
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `facultyIds` | `string[]` | IDs de facultades (Ingeniería, Derecho, etc.). |
| `careerIds` | `string[]` | IDs de carreras específicas. |
| `studyPlanIds` | `string[]` | IDs de planes de estudio específicos. |
| `subjectIds` | `string[]` | IDs de asignaturas (Materias). |

### 4. Filtros de Planificación (Secciones y Salas)
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `periodIds` | `string[]` | IDs de periodos académicos (ej: `2026-01`). |
| `buildingIds` | `string[]` | IDs de edificios físicos. |
| `professorIds` | `string[]` | IDs de profesores a cargo. |
| `spaceIds` | `string[]` | IDs de salas o auditorios específicos. |

### 5. Filtros de Horario (Bloques y Tiempo)
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `dayIds` | `string[]` | IDs de días de la semana (1 = Lunes, 7 = Domingo). |
| `dayModuleIds` | `string[]` | IDs de módulos horarios (Bloques UAI). |
| `startTime` | `ISO Date` | Rango inicial (ISO 8601). |
| `endTime` | `ISO Date` | Rango final (ISO 8601). |

---

## Lógica de Funcionamiento (IA Friendly)

1. **Multi-selección**: Si envías `["2023", "2024"]` en `cohorts`, el servicio retornará estudiantes de AMBOS años (operador `OR` interno por campo).
2. **Intersección de Filtros**: Si envías `sedeIds` y `facultyIds`, el servicio retornará estudiantes que pertenezcan a esa sede **Y** a esa facultad (operador `AND` entre distintos campos).
3. **Búsqueda por Tiempo**: Para filtrar por una hora exacta, envía tanto `startTime` como `endTime`. El servicio buscará sesiones que ocurran *dentro* de ese rango.
4. **Relaciones Profundas**: El servicio navega automáticamente por las relaciones. Por ejemplo, filtrar por `facultyIds` buscará a través de `Student -> StudyPlan -> Career -> Faculty`.

## Ejemplo de Petición Completa

```json
{
  "status": ["ACTIVE"],
  "sedeIds": ["PENALOLEN"],
  "facultyIds": ["FAC-ING-01"],
  "dayIds": ["1", "3"],
  "dayModuleIds": ["1", "2"]
}
```
*Traducción: "Estudiantes activos de Ingeniería en Peñalolén que tengan clases Lunes o Miércoles en los bloques 1 o 2".*

---

> [!TIP]
> **Formato de Respuesta**: Por defecto, el servicio retorna la lista de objetos `Student` planos. Si se requieren relaciones adicionales (como el nombre de la carrera o la ciudad), el servicio puede extenderse para incluir esos datos en el objeto de respuesta.
