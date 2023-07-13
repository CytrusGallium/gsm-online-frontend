// import AppData from '../App.json';

const GetBackEndUrl = () => {

    const AppData = require('./App.json');
    
    if (AppData.FORCED_BACKEND_URL)
        return AppData.FORCED_BACKEND_URL;

    let result = "http://localhost:4000";

    const storedValue = localStorage.getItem("serverAddress");

    if (storedValue && storedValue != "")
        result = storedValue;

    return result;
}

const GetPrintServerAddress = () => {
    let result = "http://localhost:5000/print";

    const storedValue = localStorage.getItem("printServerAddress");

    if (storedValue && storedValue != "")
        result = storedValue;

    return result;
}

const GetPrinterName = () => {
    let result = "Default Printer";

    const storedValue = localStorage.getItem("printerName");

    if (storedValue && storedValue != "")
        result = storedValue;

    return result;
}

const GetIfReducedPerformance = () => {
    let result = false;

    const storedValue = localStorage.getItem("reducedPerformance");

    if (storedValue && storedValue != "")
        result = storedValue;

    return result;
}

module.exports = { GetBackEndUrl, GetPrintServerAddress, GetPrinterName, GetIfReducedPerformance };