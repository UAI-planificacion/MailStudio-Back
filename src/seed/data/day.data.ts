import { DayName } from '@prisma/client';

export const days = [
	{
		id         : 1,
		name       : 'Lunes' as DayName,
		shortName  : 'L',
		mediumName : 'Lun',
	},
	{
		id         : 2,
		name       : 'Martes' as DayName,
		shortName  : 'M',
		mediumName : 'Mar',
	},
	{
		id         : 3,
		name       : 'Miercoles' as DayName,
		shortName  : 'W',
		mediumName : 'Mie',
	},
	{
		id         : 4,
		name       : 'Jueves' as DayName,
		shortName  : 'J',
		mediumName : 'Jue',
	},
	{
		id         : 5,
		name       : 'Viernes' as DayName,
		shortName  : 'V',
		mediumName : 'Vie',
	},
	{
		id         : 6,
		name       : 'Sabado' as DayName,
		shortName  : 'S',
		mediumName : 'Sab',
	},
	{
		id         : 7,
		name       : 'Domingo' as DayName,
		shortName  : 'D',
		mediumName : 'Dom',
	},
];
