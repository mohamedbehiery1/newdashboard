import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const apiEndpoints = {
    admin: apiUrl + "/v1/admin-panel/sub-merchants",
    merchant: apiUrl + "/v1/merchant-dashboard/sub-merchants",
}

function submerchantUrl(role, id) {
    return `${apiEndpoints[role]}/${id}`;
}

const createSubmerchant = (role, submerchant) => {
    return http.post(apiEndpoints[role], submerchant);
}

const getSubmerchants = (role) => {
    return http.get(apiEndpoints[role]);
}

const getSubmerchant = (role, submerchantId) => {
    return http.get(submerchantUrl(role, submerchantId));
}

const updateSubmerchant = (role, submerchantId, submerchant) => {
    return http.put(submerchantUrl(role, submerchantId), submerchant);
}

const settleSubmerchantBalance = (role, submerchantId) => {
    const url = `${apiEndpoints[role]}/settle-balance/${submerchantId}`
    return http.put(url);
}

const downloadBalanceReport = (role, submerchantId) => {
    const url = `${apiEndpoints[role]}/xlsx/${submerchantId}`;
    return http.get(url)
}

const deleteSubmerchant = (role, submerchantId) => {
    return http.delete(submerchantUrl(role, submerchantId));
}

export default {
    createSubmerchant,
    getSubmerchants,
    getSubmerchant,
    updateSubmerchant,
    deleteSubmerchant,
    settleSubmerchantBalance,
    downloadBalanceReport
};