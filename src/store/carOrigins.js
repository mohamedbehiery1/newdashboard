import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "carOrigins",
  initialState: {
    list: [],
    carOriginDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    carOriginsRequested: (carOrigins, action) => {
        carOrigins.loading = true;
    },
    carOriginsRequestSucceded: (carOrigins, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > carOrigins.page) {
        carOrigins.list = [...carOrigins.list, ...docs];
        carOrigins.page = page;
        carOrigins.rowCount = totalDocs;
        carOrigins.pageSize = limit;
      } else {
        // TODO: to be used in MerchantDetails Select List in Order, Driver, until converted to autoComplete
        carOrigins.list = docs;
        carOrigins.page = 1;
        carOrigins.rowCount = docs.length;
        carOrigins.pageSize = docs.length;
      }
      carOrigins.loading = false;
      carOrigins.lastFetch = Date.now();
    },
    carOriginsRequestFailed: (carOrigins, _) => {
        carOrigins.loading = false;
    },
    carOriginDetailsRequestSucceded: (carOrigins, action) => {
        carOrigins.carOriginDetails = action.payload.body;
    },
    carOriginAdded: (carOrigins, action) => {
        carOrigins.list.push(action.payload);
    },
    carOriginRemoved: (carOrigins, action) => {
      const index = carOrigins.list.findIndex(
        (carOrigin) => carOrigin.id === action.payload.id
      );
      carOrigins.list.splice(index, 1);
    },
    pageChanged: (carOrigins, action) => {
      const { page: targetPage } = action.payload;
      carOrigins.page = targetPage;
    }
  },
});

export const {
    carOriginsRequested,
    carOriginsRequestSucceded,
    carOriginsRequestFailed,
    carOriginDetailsRequestSucceded,
    carOriginAdded,
    carOriginRemoved,
    pageChanged
} = slice.actions;

// Action Creators
const url = "/lookup/car-origin-admin/all";

export const loadCarOrigins = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: carOriginsRequested.type,
      onSuccess: carOriginsRequestSucceded.type,
      onError: carOriginsRequestFailed.type,
    })
  );
};

export const loadCarOriginDetails = (id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `/lookup/car-origin/${id}`,
      // onStart: merchantsRequested.type,
      onSuccess: carOriginDetailsRequestSucceded.type,
      // onError: merchantsRequestFailed.type,
    })
  );
};

export const addCarOrigin = (carOrigin) =>
  apiCallStarted({
    url,
    method: "post",
    data: carOrigin,
    onSuccess: carOriginAdded.type,
  });

export default slice.reducer;
