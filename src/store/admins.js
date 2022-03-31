import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "admins",
  initialState: {
    list: [],
    adminDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    adminsRequested: (admins, action) => {
      admins.loading = true;
    },
    adminsRequestSucceeded: (admins, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > admins.page) {
        admins.list = [...admins.list, ...docs];
        admins.page = page;
        admins.rowCount = totalDocs;
        admins.pageSize = limit;
      } else {
        // TODO: to be removed when pagination implemented in loadOrdersByTypeAndZone
        admins.list = docs;
        admins.page = 1;
        admins.rowCount = docs.length;
        admins.pageSize = docs.length;
      }
      admins.loading = false;
      admins.lastFetch = Date.now();
    },
    adminsRequestFailed: (admins, _) => {
      admins.loading = false;
    },
    adminDetailsRequestSucceded: (admins, action) => {
      admins.adminDetails = action.payload.body;
    },
    adminAdded: (admins, action) => {
      admins.list.push(action.payload);
    },
    adminRemoved: (admins, action) => {
      const index = admins.list.findIndex(
        (admin) => admin.id === action.payload.id
      );
      admins.list.splice(index, 1);
    },
    pageChanged: (admins, action) => {
      const { page: targetPage } = action.payload;
      admins.page = targetPage;
    }
  },
});

export const {
  adminsRequested,
  adminsRequestSucceeded,
  adminsRequestFailed,
  adminDetailsRequestSucceded,
  adminAdded,
  adminRemoved,
  pageChanged
} = slice.actions;

// Action Creators
const url = "/user/all";

export const loadAdmins = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: adminsRequested.type,
      onSuccess: adminsRequestSucceeded.type,
      onError: adminsRequestFailed.type,
    })
  );
};

export const loadAdminDetails = (id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}/${id}`,
      // onStart: adminsRequested.type,
      onSuccess: adminDetailsRequestSucceded.type,
      // onError: adminsRequestFailed.type,
    })
  );
};

export const addAdmin = (admin) =>
  apiCallStarted({
    url,
    method: "post",
    data: admin,
    onSuccess: adminAdded.type,
  });

export default slice.reducer;
