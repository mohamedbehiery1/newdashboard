import axios from "axios";
import { apiCallFailed, apiCallStarted, apiCallSucceeded } from "../api";
import AuthService from "src/__services__/AuthService";

import { $BASE_URL } from "src/constants";
const baseUrl = $BASE_URL ;

const api = ({ dispatch, getStore }) => (next) => async (action) => {
  if (action.type !== apiCallStarted.type) return next(action);

  const { url, method, data, onStart, onSuccess, onError } = action.payload;


  if (onStart) dispatch({ type: onStart });
  next(action);

  try {
    const jwt = AuthService.getJwt();
    console.log("Countrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrry",localStorage.getItem("country"))
    const response = await axios.request({
      url: baseUrl + url,
      method,
      data,
      headers: { Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwMDIyMjA5OSIsImlhdCI6MTYzNTg5NTg0MSwiZXhwIjoxOTUxMjU1ODQxfQ.eu8D7aUZ_u-U6zoH41Y4XbRq0wfkBu7kYtVNt1m08c8`, country: localStorage.getItem("country") || "6184aea034e78407518074e8", languageCode: 'ar' },
    });
    // General
    dispatch(apiCallSucceeded(response.data));
    // Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // General
    dispatch(apiCallFailed(error.message));
    // Specific
    if (onError) dispatch({ type: onError, payload: error.message });
  }
};

export default api;
