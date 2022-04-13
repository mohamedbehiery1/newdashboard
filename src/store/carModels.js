import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "carModels",
  initialState: {
    list: [],
    carModelDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    carModelsRequested: (carModels, action) => {
        carModels.loading = true;
    },
    carModelsRequestSucceded: (carModels, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > carModels.page) {
        carModels.list = [...carModels.list, ...docs];
        carModels.page = page;
        carModels.rowCount = totalDocs;
        carModels.pageSize = limit;
      } else {
        // TODO: to be used in MerchantDetails Select List in Order, Driver, until converted to autoComplete
        carModels.list = docs;
        carModels.page = 1;
        carModels.rowCount = docs.length;
        carModels.pageSize = docs.length;
      }
      carModels.loading = false;
      carModels.lastFetch = Date.now();
    },
    carModelsRequestFailed: (carModels, _) => {
        carModels.loading = false;
    },
    carModelDetailsRequestSucceded: (carModels, action) => {
        carModels.carModelDetails = action.payload.body;
    },
    carModelAdded: (carModels, action) => {
        carModels.list.push(action.payload);
    },
    carModelRemoved: (carModels, action) => {
      const index = carModels.list.findIndex(
        (carModel) => carModel.id === action.payload.id
      );
      carModels.list.splice(index, 1);
    },
    pageChanged: (carModels, action) => {
      const { page: targetPage } = action.payload;
      carModels.page = targetPage;
    }
  },
});

export const {
    carModelsRequested,
    carModelsRequestSucceded,
    carModelsRequestFailed,
    carModelDetailsRequestSucceded,
    carModelAdded,
    carModelRemoved,
    pageChanged
} = slice.actions;

// Action Creators
const url = "/lookup/car-model/all";

export const loadCarModels = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: carModelsRequested.type,
      onSuccess: carModelsRequestSucceded.type,
      onError: carModelsRequestFailed.type,
    })
  );
};

export const loadCarModelDetails = (id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `/lookup/car-model/${id}`,
      // onStart: merchantsRequested.type,
      onSuccess: carModelDetailsRequestSucceded.type,
      // onError: merchantsRequestFailed.type,
    })
  );
};

export const addCarModel = (carModel) =>
  apiCallStarted({
    url,
    method: "post",
    data: carModel,
    onSuccess: carModelAdded.type,
  });

export default slice.reducer;
