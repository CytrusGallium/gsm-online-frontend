const GetBackEndUrl = () => {
    let result = "http://localhost:4000";

    const storedValue = localStorage.getItem("serverAddress");

    if (storedValue && storedValue != "")
        result = storedValue;

    // return "https://uttermost-first-gravity.glitch.me";
    return result;
}

export default GetBackEndUrl;