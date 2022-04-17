import axios from "axios";
import logger from "src/__services__/logService";
import { $__DEV__ } from "src/constants";
// import { toast } from "react-toastify";

axios.interceptors.request.use((request) => {
  $__DEV__ &&
    console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

axios.interceptors.response.use(
  response => {
    $__DEV__ && 
      console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  },
  error => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      logger.log(error);
      // toast.error("An unexpected error occurrred.");
    } else {
      // $__DEV__ && console.log("Response:", JSON.stringify(error.response, null, 2));
    }

    return Promise.reject(error);
  }
);

function setJwt(jwt) {
  axios.defaults.headers.common["Authorization"] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwMDIyMjA5OSIsImlhdCI6MTYzNTg5NTg0MSwiZXhwIjoxOTUxMjU1ODQxfQ.eu8D7aUZ_u-U6zoH41Y4XbRq0wfkBu7kYtVNt1m08c8`;
  axios.defaults.headers.common["country"] = localStorage.getItem("country") || "6184aea034e78407518074e8"
  axios.defaults.headers.common["languageCode"] = 'ar'
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  request: axios.request,
  setJwt
};
