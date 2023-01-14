const GetBaseUrl = () => {
    var baseUrl = '' + window.location;
    var pathArray = baseUrl.split('/');
    var protocol = pathArray[0];
    var host = pathArray[2];
    var url = protocol + '//' + host;

    return url;
}

module.exports = { GetBaseUrl };