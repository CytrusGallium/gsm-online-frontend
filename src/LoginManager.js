const IsLoggedIn = () => {
    let result = false;

    const storedValue = localStorage.getItem("isLoggedIn");

    if (storedValue && storedValue == "true")
        result = true;

    return result;
}

const Login = (ParamToken, ParamLevel) => {
    localStorage.setItem("token", ParamToken);
    localStorage.setItem("level", ParamLevel);
    localStorage.setItem("isLoggedIn", true);
}

const Logout = () => {
    localStorage.setItem("token", null);
    localStorage.setItem("level", null);
    localStorage.setItem("isLoggedIn", false);
}

const IsAdmin = () => {

    return true;

    const result = localStorage.getItem("level");

    if (result && result == "ADMIN")
        return true;
    else
        return false;
}

const IsManagerOrHigher = () => {
    const result = localStorage.getItem("level");

    if (result && (result == "ADMIN" || result == "MANAGER") )
        return true;
    else
        return false;
}

const IsEmployeeOrHigher = () => {
    const result = localStorage.getItem("level");

    if (result && (result == "ADMIN" || result == "MANAGER" || result == "EMPLOYEE") )
        return true;
    else
        return false;
}

module.exports = { IsLoggedIn, Login, Logout, IsAdmin, IsManagerOrHigher, IsEmployeeOrHigher };