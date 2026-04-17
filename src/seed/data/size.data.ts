import { SizeValue } from '@prisma/client';

export const sizes = [
	{
		id          : 'XS' as SizeValue,
		detail      : 'Extra Small',
		min         : 1,
		max         : 10,
		lessThan    : 11,
		greaterThan : 0,
	},
	{
		id          : 'S' as SizeValue,
		detail      : 'Small',
		min         : 11,
		max         : 25,
		lessThan    : 26,
		greaterThan : 10,
	},
	{
		id          : 'M' as SizeValue,
		detail      : 'Medium',
		min         : 26,
		max         : 50,
		lessThan    : 51,
		greaterThan : 25,
	},
	{
		id          : 'L' as SizeValue,
		detail      : 'Large',
		min         : 51,
		max         : 100,
		lessThan    : 101,
		greaterThan : 50,
	},
	{
		id          : 'XL' as SizeValue,
		detail      : 'Extra Large',
		min         : 101,
		max         : 200,
		lessThan    : 201,
		greaterThan : 100,
	},
];
