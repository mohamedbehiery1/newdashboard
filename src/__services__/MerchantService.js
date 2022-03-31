import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const apiEndpoint = apiUrl + "/v1/admin-panel/merchant"

function merchantUrl(id) {
    return `${apiEndpoint}/${id}`;
}

const createMerchant = (merchant) => {
    return http.post(apiEndpoint, merchant);
}

const getMerchants = () => {
    return http.get(apiEndpoint);
}

const getMerchant = (merchantId) => {
    return http.get(merchantUrl(merchantId));
}

const updateMerchant = (merchantId, merchant) => {
    return http.put(merchantUrl(merchantId), merchant);
}

const deleteMerchant = (merchantId) => {
    return http.delete(merchantUrl(merchantId));
}

const resetMerchantPassword = (merchantId, credentials) => {
    const url = `${apiEndpoint}/update-password/${merchantId}`
    return http.put(url, credentials);
}

export default {
    createMerchant,
    getMerchants,
    getMerchant,
    updateMerchant,
    deleteMerchant,
    resetMerchantPassword
};