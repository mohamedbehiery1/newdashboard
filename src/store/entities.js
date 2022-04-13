import { combineReducers } from "@reduxjs/toolkit";
import bugsReducer from "./bugs";
import projectsReducer from "./projects";
import usersReducer from "./users";
import preferencesReducer from "./preferences";
import adminsReducer from "./admins";
import merchantsReducer from "./merchants";
import carOriginsReducer from "./carOrigins";
import carBrandsReducer from "./carBrands";
import carModelsReducer from "./carModels";
import citiesReducer from "./cities";
import specialtiesReducer from "./specialties";
import ordersReducer from "./orders";
import driversReducer from "./drivers";
import zonesReducer from "./zones";
import submerchantsReducer from "./submerchants";

export default combineReducers({
  bugs: bugsReducer,
  admins: adminsReducer,
  merchants: merchantsReducer,
  carOrigins: carOriginsReducer,
  carBrands: carBrandsReducer,
  carModels: carModelsReducer,
  cities: citiesReducer,
  specialties: specialtiesReducer,
  orders: ordersReducer,
  submerchants: submerchantsReducer,
  drivers: driversReducer,
  projects: projectsReducer,
  users: usersReducer,
  preferences: preferencesReducer,
  zones: zonesReducer,
});
