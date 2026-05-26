export enum EnumAction {
	CREATE = 'create',
	UPDATE = 'update',
	DELETE = 'delete',
}


export enum Entity {
	TEST      = 'test',
	EMAIL_LOG = 'emailLog',
	TEMPLATE  = 'template',
}


export interface EmitEvent {
	message : any;
	action  : EnumAction;
	entity  : Entity;
	origin? : string | undefined;
}
