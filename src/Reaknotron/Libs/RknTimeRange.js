function GetTodayDateRange() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).setHours(0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).setHours(23, 59, 59, 999);

    return { start: new Date(startOfDay), end: new Date(endOfDay) };
}

function GetYesterdayDateRange() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).setHours(0, 0, 0, 0);
    const endOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).setHours(23, 59, 59, 999);

    return { start: new Date(startOfDay), end: new Date(endOfDay) };
}

function GetLast30DaysDateRange() {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).setHours(23, 59, 59, 999); // end date is today's date
    const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // start date is 30 days ago
    return { start: new Date(startDate), end: new Date(endDate) };
}

function GetLast24HoursDateRange() {
    const today = new Date();
    const endDate = new Date(today.getTime());
    const startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000); // start date is 24 hours ago
    return { start: new Date(startDate), end: new Date(endDate) };
}

function GetCurrentWeekDateRange() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)).setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)).setHours(23, 59, 59, 999);
    return { start: new Date(startOfWeek), end: new Date(endOfWeek) };
}

function GetLast7DaysDateRange() {
    const today = new Date();
    const endDate = new Date(today.getTime()).setHours(23, 59, 59, 999);
    const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0); // start date is 7 days ago
    return { start: new Date(startDate), end: new Date(endDate) };
}

function GetCurrentMonthDateRange() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // start date is the first day of this month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).setHours(23, 59, 59, 999); // end date is the last day of this month
    return { start: new Date(startOfMonth), end: new Date(endOfMonth) };
}

function GetCurrentYearDateRange() {
    const year = new Date().getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31).setHours(23, 59, 59, 999);
    return { start: new Date(firstDayOfYear), end: new Date(lastDayOfYear) };
}

function GetLastYearDateRange() {
    const year = new Date().getFullYear() - 1;
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31).setHours(23, 59, 59, 999);
    return { start: new Date(firstDayOfYear), end: new Date(lastDayOfYear) };
}

function StringToDateRange(ParamString) {
    if (ParamString === "TODAY")
        return GetTodayDateRange();
    else if (ParamString === "YESTERDAY")
        return GetYesterdayDateRange();
    else if (ParamString === "LAST_24_HOURS")
        return GetLast24HoursDateRange();
    else if (ParamString === "THIS_WEEK")
        return GetCurrentWeekDateRange();
    else if (ParamString === "LAST_WEEK")
        return GetLast7DaysDateRange();
    else if (ParamString === "THIS_MONTH")
        return GetCurrentMonthDateRange();
    else if (ParamString === "LAST_MONTH")
        return GetLast30DaysDateRange();
    else if (ParamString === "THIS_YEAR")
        return GetCurrentYearDateRange();
    else if (ParamString === "LAST_YEAR")
        return GetLastYearDateRange();

    return null;
}

module.exports = {
    StringToDateRange
}