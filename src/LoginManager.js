const IsLoggedIn = () => {
    let result = false;

    const storedValue = localStorage.getItem("isLoggedIn");
    
    if (storedValue && storedValue == "true")
        result = true;

    return result;
}

const Login = (ParamToken) => {
    localStorage.setItem("token", ParamToken);
    localStorage.setItem("isLoggedIn", true);
}

const Logout = () => {
    localStorage.setItem("token", null);
    localStorage.setItem("isLoggedIn", false);
}

module.exports = { IsLoggedIn, Login, Logout };