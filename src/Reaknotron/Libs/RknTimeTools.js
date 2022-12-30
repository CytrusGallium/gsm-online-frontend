function GetDateTimeDMYHM(ParamDate) {
    var d = new Date(ParamDate);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    var hour = '' + d.getHours();
    var minute = '' + d.getMinutes();

    if (month.length < 2)
        month = '0' + month;

    if (day.length < 2)
        day = '0' + day;

    if (hour.length < 2)
        hour = '0' + hour;

    if (minute.length < 2)
        minute = '0' + minute;

    return [day, month, year].join('-') + " " + [hour, minute].join(':');
}

function GetShortDate() {
    return (new Date()).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function GetTimeHM2Digits () {
    var d = new Date();
    var hour = '' + d.getHours();
    var minute = '' + d.getMinutes();

    if (hour.length < 2)
        hour = '0' + hour;

    if (minute.length < 2)
        minute = '0' + minute;

    return hour + ":" + minute;
}

module.exports = { GetDateTimeDMYHM, GetShortDate, GetTimeHM2Digits }