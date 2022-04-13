import http from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const deleteCarModel = (id) => {
    return http.delete(apiUrl+"/lookup/car-model/"+id);
}

export default {
    deleteCarModel
};