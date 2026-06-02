export const SELECT_WORKFLOW = {
    id              : true,
    name            : true,
    active          : true,
    students        : true,
    subject         : true,
    bcc             : true,
    cc              : true,
    frequency       : true,
    hour            : true,
    minute          : true,
    daysOfWeek      : true,
    dayOfMonth      : true,
    lastDayOfMonth  : true,
    occurrences     : true,
    repeatUntil     : true,
    neverEnds       : true,
    templateFileId  : true,
    date            : true,
    filters         : true,
    template        : {
        select: {
            id      : true,
            content : true,
        }
    },
    templateFile : {
        select: {
            id          : true,
            name        : true,
            url         : true,
            coverUrl    : true,
            type        : true,
        }
    }
}
