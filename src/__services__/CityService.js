import http from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const deleteCity = (id) => {
    return http.delete(apiUrl+"/lookup/city/"+id);
}

export default {
    deleteCity
};