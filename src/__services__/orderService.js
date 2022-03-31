import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;


// const apiEndpoints = {
//     admin: apiUrl + "/v1/admin-panel/order",
//     merchant: apiUrl + "/v1/merchant-dashboard/order",
//     driver: apiUrl + "/v1/driver/order",
//     user: apiUrl + "/v1/user/order"
// }

function FollowUpOrderByChatSessionId(id){
    let url = `${apiUrl}/scrap/inquiry/chat-calls/${id}`;
    return http.get(url)
} 

// function orderUrl(role, id) {
//     return `${apiEndpoints[role]}/${id}`;
// }

// const createOrder = (role, order) => {
//     return http.post(apiEndpoints[role], order);
// }

// const getOrders = (role) => {
//     return http.get(apiEndpoints[role]);
// }

// const getOrder = (role, orderId) => {
//     return http.get(orderUrl(role, orderId));
// }

// const updateOrder = (role, orderId, order) => {
//     return http.put(orderUrl(role, orderId), order);
// }

// const deleteOrder = (role, orderId) => {
//     return http.delete(orderUrl(role, orderId));
// }

// const assignDriversToOrders = (drivers, orders) => {
//     const params = { orders, drivers }
//     return http.post(
//         `${apiUrl}/v1/merchant-dashboard/order/assign-drivers`,
//         params
//     )
// }

// const importOrdersFromSpreadsheet = (role, params) => {
//     return http.post(
//         `${apiEndpoints[role]}/xls`,
//         params
//     );
// }

// const getNewOrdersForSubmerchant = (role, submerchantId) => {
//     return http.get(`${apiEndpoints[role]}/new-for-submerchant?id=${submerchantId}`);
// }

// const getPrintableAWB = orders => {
//     const params = { orders }
//     // const options = { responseType: "blob" }
//     return http.post(
//         `${apiUrl}/v1/merchant-dashboard/order/generate-pdf`,
//         params,
//         // options
//     )
// }

// const resendLocationSms = orders => {
//     const params = { orders }
//     return http.post(
//         `${apiEndpoints.merchant}/resend-location-sms`,
//         params,
//     )
// }

export default {
    // createOrder,
    // getOrders,
    // getOrder,
    // updateOrder,
    // deleteOrder,
    // assignDriversToOrders,
    // getPrintableAWB,
    // importOrdersFromSpreadsheet,
    // getNewOrdersForSubmerchant,
    // resendLocationSms
    FollowUpOrderByChatSessionId
};