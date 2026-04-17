import { ModuleDifference } from '@prisma/client';

export const modules = [
	{
		id         : 1,
		code       : 'M1',
		difference : 'A' as ModuleDifference,
		startHour  : '08:30',
		endHour    : '09:40',
		isActive   : true,
	},
	{
		id         : 2,
		code       : 'M2',
		difference : 'B' as ModuleDifference,
		startHour  : '09:50',
		endHour    : '11:00',
		isActive   : true,
	},
	{
		id         : 3,
		code       : 'M3',
		difference : 'C' as ModuleDifference,
		startHour  : '11:10',
		endHour    : '12:20',
		isActive   : true,
	},
	{
		id         : 4,
		code       : 'M4',
		difference : 'D' as ModuleDifference,
		startHour  : '12:30',
		endHour    : '13:40',
		isActive   : true,
	},
	{
		id         : 5,
		code       : 'M5',
		difference : 'E' as ModuleDifference,
		startHour  : '14:30',
		endHour    : '15:40',
		isActive   : true,
	},
	{
		id         : 6,
		code       : 'M6',
		difference : 'F' as ModuleDifference,
		startHour  : '15:50',
		endHour    : '17:00',
		isActive   : true,
	},
];
