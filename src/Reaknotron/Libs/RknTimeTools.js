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

const GetShortDate = () => {
    return (new Date()).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function GetTimeHM2Digits() {
    var d = new Date();
    var hour = '' + d.getHours();
    var minute = '' + d.getMinutes();

    if (hour.length < 2)
        hour = '0' + hour;

    if (minute.length < 2)
        minute = '0' + minute;

    return hour + ":" + minute;
}

function ConvertMsToDHMS(ParamMilliseconds) {

    const days = Math.floor(ParamMilliseconds / (24 * 60 * 60 * 1000));
    const daysMod = Math.floor(ParamMilliseconds % (24 * 60 * 60 * 1000));
    const hours = Math.floor(daysMod / (60 * 60 * 1000));
    const hoursMod = Math.floor(daysMod % (60 * 60 * 1000));
    const minutes = Math.floor(hoursMod / (60 * 1000));
    const minutesMod = Math.floor(hoursMod % (60 * 1000));
    const seconds = Math.floor(minutesMod / 1000);

    return days + ":" + hours + ":" + minutes + ":" + seconds;
}

module.exports = {
    GetDateTimeDMYHM,
    GetTimeHM2Digits,
    GetShortDate,
    ConvertMsToDHMS
}