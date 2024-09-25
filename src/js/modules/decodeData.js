export const decodeData = function decodeData(encodedData) {
    let jsonData = atob(encodedData);
    return JSON.parse(jsonData);
};
