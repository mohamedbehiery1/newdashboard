import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const apiEndpoint = apiUrl + "/v1/merchant-dashboard/notifications"

const getNotifications = (page) => {
    return http.get(`${apiEndpoint}?page=${page}`);
}

export default {
    getNotifications,
};