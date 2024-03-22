export const API_KEY = 'AIzaSyAQ_AFAbKDFudV2y4CLdzbQKfko_64Crtw';

export const value_converter = (value) => {
    const res = value >= 1000000 ? Math.floor(value / 1000000) + 'M' : (value >= 1000 ? Math.floor(value / 1000) + 'K' : value)
    return res;
}
