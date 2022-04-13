import http from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const deleteCarOrigin = (id) => {
    return http.delete(apiUrl+"/lookup/car-origin/"+id);
}

export default {
    deleteCarOrigin
};