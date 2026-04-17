import { Headquarters } from '@prisma/client';

export const grades = [
	{
		id             : '01JK7YV1W7Z5Y8X9T2V4R6M1G1',
		name           : 'Pregrado Diurno',
		headquartersId : 'PENALOLEN' as Headquarters,
	},
	{
		id             : '01JK7YV1W7Z5Y8X9T2V4R6M1G2',
		name           : 'Postgrado',
		headquartersId : 'VITACURA' as Headquarters,
	},
	{
		id             : '01JK7YV1W7Z5Y8X9T2V4R6M1G3',
		name           : 'Executive',
		headquartersId : 'ERRAZURIZ' as Headquarters,
	},
	{
		id             : '01JK7YV1W7Z5Y8X9T2V4R6M1G4',
		name           : 'Pregrado Vespertino',
		headquartersId : 'PENALOLEN' as Headquarters,
	},
];
