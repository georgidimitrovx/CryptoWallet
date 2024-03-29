function isProductionEnvironment() {
    return process.env.NODE_ENV == 'production';
}

export function getEndpoint() {
    if (isProductionEnvironment())
        return 'https://cryptowalletbg.azurewebsites.net/';
    else
        return 'https://localhost:7018/';
}

export function hasUserSession() {
    const token = localStorage.getItem('jwtToken');
    const tokenExpiry = localStorage.getItem('jwtTokenExpiry');

    if (token == undefined || token == null || token == "")
        return false;

    if (tokenExpiry == undefined || tokenExpiry == null || tokenExpiry == "")
        return false;

    if (parseInt(tokenExpiry) < Date.now())
        return false;

    return true;
}

export function toLocaleFraction(num: number) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}