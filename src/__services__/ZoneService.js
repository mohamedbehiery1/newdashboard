import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const apiEndpoints = {
    admin: apiUrl + "/v1/admin-panel/zone",
    merchant: apiUrl + "/v1/merchant-dashboard/zone",
}

function zoneUrl(role, id) {
    return `${apiEndpoints[role]}/${id}`;
}

const createZone = (role, zone) => {
    return http.post(apiEndpoints[role], zone);
}

const getZones = (role) => {
    return http.get(apiEndpoints[role]);
}

const getZone = (role, zoneId) => {
    return http.get(zoneUrl(role, zoneId));
}

const updateZone = (role, zoneId, zone) => {
    return http.put(zoneUrl(role, zoneId), zone);
}

const deleteZone = (role, zoneId) => {
    return http.delete(zoneUrl(role, zoneId));
}

export default {
    createZone,
    getZones,
    getZone,
    updateZone,
    deleteZone
};