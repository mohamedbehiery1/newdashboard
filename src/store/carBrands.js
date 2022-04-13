import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "carBrands",
  initialState: {
    list: [],
    carBrandDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    carBrandsRequested: (carBrands, action) => {
        carBrands.loading = true;
    },
    carBrandsRequestSucceded: (carBrands, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > carBrands.page) {
        carBrands.list = [...carBrands.list, ...docs];
        carBrands.page = page;
        carBrands.rowCount = totalDocs;
        carBrands.pageSize = limit;
      } else {
        // TODO: to be used in MerchantDetails Select List in Order, Driver, until converted to autoComplete
        carBrands.list = docs;
        carBrands.page = 1;
        carBrands.rowCount = docs.length;
        carBrands.pageSize = docs.length;
      }
      carBrands.loading = false;
      carBrands.lastFetch = Date.now();
    },
    carBrandsRequestFailed: (carBrands, _) => {
        carBrands.loading = false;
    },
    carBrandDetailsRequestSucceded: (carBrands, action) => {
        carBrands.carBrandDetails = action.payload.body;
    },
    carBrandAdded: (carBrands, action) => {
        carBrands.list.push(action.payload);
    },
    carBrandRemoved: (carBrands, action) => {
      const index = carBrands.list.findIndex(
        (carBrand) => carBrand.id === action.payload.id
      );
      carBrands.list.splice(index, 1);
    },
    pageChanged: (carBrands, action) => {
      const { page: targetPage } = action.payload;
      carBrands.page = targetPage;
    }
  },
});

export const {
    carBrandsRequested,
    carBrandsRequestSucceded,
    carBrandsRequestFailed,
    carBrandDetailsRequestSucceded,
    carBrandAdded,
    carBrandRemoved,
    pageChanged
} = slice.actions;

// Action Creators
const url = "/lookup/car-brand/all";

export const loadCarBrands = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: carBrandsRequested.type,
      onSuccess: carBrandsRequestSucceded.type,
      onError: carBrandsRequestFailed.type,
    })
  );
};

export const loadCarBrandDetails = (id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `/lookup/car-brand/${id}`,
      // onStart: merchantsRequested.type,
      onSuccess: carBrandDetailsRequestSucceded.type,
      // onError: merchantsRequestFailed.type,
    })
  );
};

export const addCarBrand = (carBrand) =>
  apiCallStarted({
    url,
    method: "post",
    data: carBrand,
    onSuccess: carBrandAdded.type,
  });

export default slice.reducer;
