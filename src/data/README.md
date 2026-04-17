# Servicios de Metadatos (Módulo Data)

Este documento describe los servicios disponibles para obtener la información necesaria para poblar selectores, grupos de botones y filtros en el frontend. El endpoint base es `/data`.

## Información General

- **Método**: `GET` para todos los recursos.
- **Formato de Respuesta**: Lista de objetos JSON (`[]`).
- **Propósito**: Proveer los "maestros" de datos para que el usuario pueda filtrar estudiantes u otras entidades.

---

## 🌎 Geografía y Ubicación
Utiliza estos servicios para poblar filtros de residencia o localización de sedes.

| Endpoint | Descripción | Ejemplo de Uso |
| :--- | :--- | :--- |
| `GET /data/regions` | Lista de regiones del país. | Selector de Región. |
| `GET /data/cities` | Lista de ciudades. | Selector de Ciudad (filtrable por ID de región). |

---

## 🏗️ Infraestructura y Espacios
Datos sobre el campus físico y capacidades de sala.

| Endpoint | Descripción | Ejemplo de Uso |
| :--- | :--- | :--- |
| `GET /data/buildings` | Edificios disponibles en las sedes. | Filtro de Edificio. |
| `GET /data/sizes` | Tamaños y capacidades de sala (XS, S, M, L, XL). | Filtro de capacidad. |

---

## 🎓 Estructura Académica
Jerarquía necesaria para segmentar alumnos por carrera o facultad.

| Endpoint | Descripción | Ejemplo de Uso |
| :--- | :--- | :--- |
| `GET /data/faculties` | Facultades (ej: Ingeniería, Diseño). | Filtro primario académico. |
| `GET /data/careers` | Carreras de la universidad. | Filtro secundario académico. |
| `GET /data/study-plans` | Planes de estudio específicos. | Segmentación por versión de carrera. |
| `GET /data/grades` | Grados académicos o jornadas. | Filtro de jornada (Diurno/Vespertino). |

---

## 📅 Planificación y Horarios
Bases para los filtros de agenda y búsqueda por bloques horarios.

| Endpoint | Descripción | Ejemplo de Uso |
| :--- | :--- | :--- |
| `GET /data/periods` | Semestres o periodos (ej: 2026-01). | Selector de temporada. |
| `GET /data/subjects` | Listado maestro de asignaturas. | Búsqueda por materia. |
| `GET /data/professors` | Listado de docentes. | Búsqueda por profesor. |
| `GET /data/days` | Días de la semana (Lunes-Domingo). | Filtro de día. |
| `GET /data/modules` | Bloques horarios (startHour, endHour). | Filtro de hora específica. |
| `GET /data/day-modules` | Combinación única de día y bloque. | Selección de slot en agenda. |

---

## ⚙️ Operaciones (Secciones y Sesiones)
Datos ya instanciados de la planificación actual.

| Endpoint | Descripción | Ejemplo de Uso |
| :--- | :--- | :--- |
| `GET /data/sections` | Secciones específicas de clases. | Filtro por NRC o código de grupo. |
| `GET /data/sessions` | Sesiones individuales de clase. | Verificación de disponibilidad de sala. |

---

## Notas para el Front-end (IA Friendly)

1. **Relaciones**: Los objetos retornados son planos. Si necesitas filtrar ciudades por región en el front, usa el campo `regionId` presente en el objeto City.
2. **Carga Inicial**: Se recomienda cargar estos recursos al inicio de la aplicación o del módulo de filtros y cachearlos, ya que son datos semi-estáticos.
3. **Consistencia**: Todos los IDs retornados en estos servicios son compatibles con los parámetros esperados por el servicio de búsqueda dinámica de estudiantes (`/students/search`).

---

> [!IMPORTANT]
> Todos los IDs son de tipo `String` (formato ULID) o `Int` según corresponda al esquema de base de datos. Asegúrate de enviar el tipo de dato correcto en los filtros de búsqueda.
