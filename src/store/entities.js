import { combineReducers } from "@reduxjs/toolkit";
import bugsReducer from "./bugs";
import projectsReducer from "./projects";
import usersReducer from "./users";
import preferencesReducer from "./preferences";
import adminsReducer from "./admins";
import merchantsReducer from "./merchants";
import ordersReducer from "./orders";
import driversReducer from "./drivers";
import zonesReducer from "./zones";
import submerchantsReducer from "./submerchants";

export default combineReducers({
  bugs: bugsReducer,
  admins: adminsReducer,
  merchants: merchantsReducer,
  orders: ordersReducer,
  submerchants: submerchantsReducer,
  drivers: driversReducer,
  projects: projectsReducer,
  users: usersReducer,
  preferences: preferencesReducer,
  zones: zonesReducer,
});
