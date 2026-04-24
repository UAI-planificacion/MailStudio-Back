export interface Student {
    name?       : string;
    lastName?   : string;
    email?      : string;
}


export interface PayloadEmail {
    student     : Student;
    templateId  : string;
    subject     : string;
}
