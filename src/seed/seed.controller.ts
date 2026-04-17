import { Controller, Get, Delete } from '@nestjs/common';

import { SeedService } from './seed.service';


@Controller( 'seed' )
export class SeedController {

	constructor( private readonly seedService : SeedService ) { }


	@Get( )
	executeSeed( ) {
		return this.seedService.runSeed( );
	}


	@Delete( )
	deleteAll( ) {
		return this.seedService.deleteAll( );
	}

}
