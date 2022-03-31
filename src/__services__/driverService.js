import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const apiEndpoints = {
    admin: apiUrl + "/v1/admin-panel/driver",
    merchant: apiUrl + "/v1/merchant-dashboard/driver",
}

function driverUrl(role, id) {
    return `${apiEndpoints[role]}/${id}`;
}

const createDriver = (role, driver) => {
    return http.post(apiEndpoints[role], driver);
}

const getDrivers = (role) => {
    return http.get(apiEndpoints[role]);
}

const getDriver = (role, driverId) => {
    return http.get(driverUrl(role, driverId));
}

const updateDriver = (role, driverId, driver) => {
    return http.put(driverUrl(role, driverId), driver);
}

const resetDriverPassword = (role, driverId, credentials) => {
    const url = `${apiEndpoints[role]}/update-password/${driverId}`
    return http.put(url, credentials);
}

const settleDriverBalance = (role, driverId) => {
    const url = `${apiEndpoints[role]}/settle-balance/${driverId}`
    return http.put(url);
}

const downloadBalanceReport = (role, driverId) => {
    const url = `${apiEndpoints[role]}/xlsx/${driverId}`;
    return http.get(url)
}

const deleteDriver = (role, driverId) => {
    return http.delete(driverUrl(role, driverId));
}

export default {
    createDriver,
    getDrivers,
    getDriver,
    updateDriver,
    deleteDriver,
    resetDriverPassword,
    settleDriverBalance,
    downloadBalanceReport
};