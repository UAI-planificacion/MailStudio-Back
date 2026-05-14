import { TemplateContent } from '@templates/utils/templateContent.model';


export interface StaffResponse {
	id    : string;
	name  : string;
	email : string;
	role  : string;
}


export interface TemplateResponse {
	id        : string;
	name      : string;
	content   : TemplateContent;
	updatedAt : Date;
	createdAt : Date;
	cc        : string[];
	bcc       : string[];
	active    : boolean;
	images    : string[];
	creator   : StaffResponse;
	updater   : StaffResponse;
}
