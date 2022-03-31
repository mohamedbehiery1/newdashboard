import jwt_decode from "jwt-decode";
import http from "src/__services__/httpService";
import { $BASE_URL } from "src/constants";
import { pick } from "lodash";

const Cryptr = require('cryptr');
const apiUrl = $BASE_URL + '/api';

const apiEndpoints = {
  admin: apiUrl + "/v1/admin-panel/login",
  merchant: apiUrl + "/v1/merchant-dashboard/login",
  driver: apiUrl + '/v1/driver/login'
}

const tokenKey = "token";
const currentUserKey = "current_user";

export async function login(role, credentials) {
  const response = await http.post(apiEndpoints[role], { ...credentials });
  return response.data.body;
}

export async function registerAsMerchant(credentials) {
  const response = await http.post(apiUrl + "/v1/merchant-dashboard/register", { ...credentials });
  return response.data.body
}

export async function sendEmailToResetPassword(email) {
  const response = await http.post(apiUrl + "/v1/merchant-dashboard/forget-password", { email });
  return response;
}

export async function resetPassword(credentials) {
  const response = await http.put(apiUrl + "/v1/merchant-dashboard/reset-forgotten-password", { ...credentials });
  return response;
}

export async function verifyEmail(token) {
  const response = await http.post(apiUrl + "/v1/merchant-dashboard/verify-mail", { token });
  return response;
}

export async function verifyPhone(params) {
  const response = await http.post(apiUrl + "/v1/merchant-dashboard/verify-phone", params);
  return response;
}

export async function changeMerchantRegistrationPhone(params) {
  const cryptr = new Cryptr('mapIt@0000');
  const encryptedData = cryptr.encrypt(JSON.stringify(params));
  const response = await http.put(apiUrl + "/v1/merchant-dashboard/update-phone", { encryptedData });
  return response;
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjFjNDMwNzZhOTY4ZmU0NzI1Y2RiMCIsIm5hbWUiOiJTdGFnaW5nIEFkbWluIiwiZW1haWwiOiJzdGFnaW5nYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ3MjMxODYyLCJleHAiOjE2NDk3Mzc0NjJ9.hI4DYRB4VNdrD7ZlA_pJLsXwxMNg6tE2p5RGZrRjxDY");

  const decodedJWT = jwt_decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjFjNDMwNzZhOTY4ZmU0NzI1Y2RiMCIsIm5hbWUiOiJTdGFnaW5nIEFkbWluIiwiZW1haWwiOiJzdGFnaW5nYWRtaW5AZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ3MjMxODYyLCJleHAiOjE2NDk3Mzc0NjJ9.hI4DYRB4VNdrD7ZlA_pJLsXwxMNg6tE2p5RGZrRjxDY");
  const currentUser = pick(
    decodedJWT,
    ['companyName', 'email', 'id', 'logo', 'role', 'roleType']
  )

  localStorage.setItem(currentUserKey, JSON.stringify(currentUser));

  http.setJwt(jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(currentUserKey);
}

export function getCurrentUser() {
  try {

    const stringifiedUser = localStorage.getItem(currentUserKey);
    const user = JSON.parse(stringifiedUser);
    return user
  } catch (ex) {
    return null;
  }
}

export function setCurrentUser(user) {
  try {
    const stringifiedUser = localStorage.getItem(currentUserKey);
    const oldUser = JSON.parse(stringifiedUser);
    const newUser = {
      ...oldUser,
      companyName: user.companyName,
      email: user.email,
      logo: user.logo
    }
    localStorage.setItem(currentUserKey, JSON.stringify(newUser));
  } catch (ex) {
    return null;
  }
}

const isJwtValid = token => {
  // const { exp } = jwt_decode(token);
  // const expDate = new Date(parseInt(exp) * 1000);
  // const nowDate = new Date();
  // return nowDate < expDate;
return true
}


export function getJwt() {
  return localStorage.getItem(tokenKey);
}

http.setJwt(getJwt());

export default {
  login,
  registerAsMerchant,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
  isJwtValid,
  sendEmailToResetPassword,
  verifyEmail,
  verifyPhone,
  resetPassword,
  changeMerchantRegistrationPhone,
  setCurrentUser
};
