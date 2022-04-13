import http from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const deleteCarBrand = (id) => {
    return http.delete(apiUrl+"/lookup/car-brand/"+id);
}

export default {
    deleteCarBrand
};