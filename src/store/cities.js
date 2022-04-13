import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "cities",
  initialState: {
    list: [],
    cityDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    citiesRequested: (cities, action) => {
        cities.loading = true;
    },
    citiesRequestSucceded: (cities, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > cities.page) {
        cities.list = [...cities.list, ...docs];
        cities.page = page;
        cities.rowCount = totalDocs;
        cities.pageSize = limit;
      } else {
        // TODO: to be used in MerchantDetails Select List in Order, Driver, until converted to autoComplete
        cities.list = docs;
        cities.page = 1;
        cities.rowCount = docs.length;
        cities.pageSize = docs.length;
      }
      cities.loading = false;
      cities.lastFetch = Date.now();
    },
    citiesRequestFailed: (cities, _) => {
        cities.loading = false;
    },
    cityDetailsRequestSucceded: (cities, action) => {
        cities.cityDetails = action.payload.body;
    },
    cityAdded: (cities, action) => {
        cities.list.push(action.payload);
    },
    cityRemoved: (cities, action) => {
      const index = cities.list.findIndex(
        (city) => city.id === action.payload.id
      );
      cities.list.splice(index, 1);
    },
    pageChanged: (cities, action) => {
      const { page: targetPage } = action.payload;
      cities.page = targetPage;
    }
  },
});

export const {
    citiesRequested,
    citiesRequestSucceded,
    citiesRequestFailed,
    cityDetailsRequestSucceded,
    cityAdded,
    cityRemoved,
    pageChanged
} = slice.actions;

// Action Creators
const url = "/lookup/city/all";

export const loadCities = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: citiesRequested.type,
      onSuccess: citiesRequestSucceded.type,
      onError: citiesRequestFailed.type,
    })
  );
};

export const loadCityDetails = (id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `/lookup/city/${id}`,
      // onStart: merchantsRequested.type,
      onSuccess: cityDetailsRequestSucceded.type,
      // onError: merchantsRequestFailed.type,
    })
  );
};

export const addCity = (city) =>
  apiCallStarted({
    url,
    method: "post",
    data: city,
    onSuccess: cityAdded.type,
  });

export default slice.reducer;
