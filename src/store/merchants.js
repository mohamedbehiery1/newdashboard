import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "merchants",
  initialState: {
    list: [],
    merchantDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    merchantsRequested: (merchants, action) => {
      merchants.loading = true;
    },
    merchantsRequestSucceded: (merchants, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > merchants.page) {
        merchants.list = [...merchants.list, ...docs];
        merchants.page = page;
        merchants.rowCount = totalDocs;
        merchants.pageSize = limit;
      } else {
        // TODO: to be used in MerchantDetails Select List in Order, Driver, until converted to autoComplete
        merchants.list = docs;
        merchants.page = 1;
        merchants.rowCount = docs.length;
        merchants.pageSize = docs.length;
      }
      merchants.loading = false;
      merchants.lastFetch = Date.now();
    },
    merchantsRequestFailed: (merchants, _) => {
      merchants.loading = false;
    },
    merchantDetailsRequestSucceded: (merchants, action) => {
      merchants.merchantDetails = action.payload.body;
    },
    merchantAdded: (merchants, action) => {
      merchants.list.push(action.payload);
    },
    merchantRemoved: (merchants, action) => {
      const index = merchants.list.findIndex(
        (merchant) => merchant.id === action.payload.id
      );
      merchants.list.splice(index, 1);
    },
    pageChanged: (merchants, action) => {
      const { page: targetPage } = action.payload;
      merchants.page = targetPage;
    }
  },
});

export const {
  merchantsRequested,
  merchantsRequestSucceded,
  merchantsRequestFailed,
  merchantDetailsRequestSucceded,
  merchantAdded,
  merchantRemoved,
  pageChanged
} = slice.actions;

// Action Creators
const url = "/merchant/all";

export const loadMerchants = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: merchantsRequested.type,
      onSuccess: merchantsRequestSucceded.type,
      onError: merchantsRequestFailed.type,
    })
  );
};

export const loadMerchantDetails = (id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `/merchant/${id}`,
      // onStart: merchantsRequested.type,
      onSuccess: merchantDetailsRequestSucceded.type,
      // onError: merchantsRequestFailed.type,
    })
  );
};

export const addMerchant = (merchant) =>
  apiCallStarted({
    url,
    method: "post",
    data: merchant,
    onSuccess: merchantAdded.type,
  });

export default slice.reducer;
