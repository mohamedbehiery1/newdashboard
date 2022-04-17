import http from "src/__services__/httpService";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;


function FollowUpOrderByChatSessionId(id){
    let url = `${apiUrl}/scrap/inquiry/chat-calls/${id}`;
    return http.get(url)
}

function getRates(){
    let url = `${apiUrl}/lookup/rate`;
    return http.get(url)
}


export default {
    getRates,
    FollowUpOrderByChatSessionId
};