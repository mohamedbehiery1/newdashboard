import http from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/user';
const apiEndpoint = apiUrl + "/all?page=1"

function adminUrl(id) {
    return `${apiEndpoint}/${id}`;
}

const createAdmin = (admin) => {
    return http.post(apiEndpoint, admin);
}

const getAdmins = () => {
    return http.get(apiEndpoint);
}

const getAdmin = (adminId) => {
    return http.get(adminUrl(adminId));
}

const updateAdmin = (adminId, admin) => {
    return http.put(adminUrl(adminId), admin);
}

const deleteAdmin = (adminId) => {
    return http.delete(adminUrl(adminId));
}

export default {
    createAdmin,
    getAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin
};