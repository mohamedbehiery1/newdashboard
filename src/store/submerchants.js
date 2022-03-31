import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "submerchants",
  initialState: {
    list: [],
    submerchantDetails: {},
    loading: false,
    lastFetch: null,
    pageLimit: 10
  },
  reducers: {
    submerchantsRequested: (submerchants, action) => {
      submerchants.loading = true;
    },
    submerchantsRequestSucceded: (submerchants, action) => {
      submerchants.list = action.payload.body;
      submerchants.loading = false;
      submerchants.lastFetch = Date.now();
      submerchants.pageLimit = action.payload.body.limit
      // totalDocs(pin):10
      // totalPages(pin):1
      // page(pin):1
      // pagingCounter(pin):1
      // hasPrevPage(pin):false
      // hasNextPage(pin):false
      // prevPage(pin):null
      // nextPage(pin):null
    },
    submerchantsRequestFailed: (submerchants, _) => {
      submerchants.loading = false;
    },
    submerchantDetailsRequestSucceded: (submerchants, action) => {
      submerchants.submerchantDetails = action.payload.body;
    },
    submerchantAdded: (submerchants, action) => {
      submerchants.list.push(action.payload);
    },
    submerchantRemoved: (submerchants, action) => {
      const index = submerchants.list.findIndex(
        (submerchant) => submerchant.id === action.payload.id
      );
      submerchants.list.splice(index, 1);
    },
  },
});

export const {
  submerchantsRequested,
  submerchantsRequestSucceded,
  submerchantsRequestFailed,
  submerchantDetailsRequestSucceded,
  submerchantAdded,
  submerchantRemoved,
} = slice.actions;

// Action Creators
const apiEndpoints = {
  admin: "/v1/admin-panel/sub-merchants",
  merchant: "/v1/merchant-dashboard/sub-merchants"
}

export const loadSubmerchants = (role) => (dispatch, getState) => {
  const { lastFetch } = getState().entities.submerchants;
  const diffInMinutes = moment().diff(moment(lastFetch), "M");
  if (diffInMinutes < 10) return;
  dispatch(
    apiCallStarted({
      url: `${apiEndpoints[role]}?page=1`,
      onStart: submerchantsRequested.type,
      onSuccess: submerchantsRequestSucceded.type,
      onError: submerchantsRequestFailed.type,
    })
  );
};

export const loadSubmerchantDetails = (role, id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoints[role]}/${id}`,
      // onStart: submerchantsRequested.type,
      onSuccess: submerchantDetailsRequestSucceded.type,
      // onError: submerchantsRequestFailed.type,
    })
  );
};

// export const addSubmerchant = (submerchant) =>
//   apiCallStarted({
//     url,
//     method: "post",
//     data: submerchant,
//     onSuccess: submerchantAdded.type,
//   });

export default slice.reducer;
