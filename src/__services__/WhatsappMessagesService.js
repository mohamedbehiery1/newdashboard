import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const apiEndpoints = {
    admin: apiUrl + "/v1/admin-panel/whatsapp-message",
    merchant: apiUrl + "/v1/merchant-dashboard/whatsapp-message",
}

function messageUrl(role, id) {
    return `${apiEndpoints[role]}/${id}`;
}

const createMessage = (role, message) => {
    return http.post(apiEndpoints[role], message);
}

const getMessages = (role) => {
    return http.get(apiEndpoints[role]);
}

const getMessage = (role, messageId) => {
    return http.get(messageUrl(role, messageId));
}

const updateMessage = (role, messageId, message) => {
    return http.put(messageUrl(role, messageId), message);
}

const deleteMessage = (role, messageId) => {
    return http.delete(messageUrl(role, messageId));
}

export default {
    createMessage,
    getMessages,
    getMessage,
    updateMessage,
    deleteMessage
};