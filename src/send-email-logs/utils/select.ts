export const SELECT_EMAIL_LOG_SEND = {
    id            : true,
    subject       : true,
    priority      : true,
    status        : true,
    message       : true,
    content       : true,
    templateId    : true,
    cc            : true,
    bcc           : true,
    studentEmails : true,
    createdAt     : true,
    sender        : {
        select : {
            id    : true,
            name  : true,
            email : true,
            role  : true,
        }
    },
    workflow      : {
        select : {
            id          : true,
            name        : true,
            description : true,
        }
    },
}