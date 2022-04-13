import http from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL;

const deleteSpecialty= (id) => {
    return http.delete(apiUrl+"/lookup/scrap-type/"+id);
}

export default {
    deleteSpecialty
};