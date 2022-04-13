import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "specialties",
  initialState: {
    list: [],
    specialtyDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    specialtiesRequested: (specialties, action) => {
        specialties.loading = true;
    },
    specialtiesRequestSucceded: (specialties, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > specialties.page) {
        specialties.list = [...specialties.list, ...docs];
        specialties.page = page;
        specialties.rowCount = totalDocs;
        specialties.pageSize = limit;
      } else {
        // TODO: to be used in MerchantDetails Select List in Order, Driver, until converted to autoComplete
        specialties.list = docs;
        specialties.page = 1;
        specialties.rowCount = docs.length;
        specialties.pageSize = docs.length;
      }
      specialties.loading = false;
      specialties.lastFetch = Date.now();
    },
    specialtiesRequestFailed: (specialties, _) => {
        specialties.loading = false;
    },
    specialtyDetailsRequestSucceded: (specialties, action) => {
        specialties.specialtyDetails = action.payload.body;
    },
    specialtyAdded: (specialties, action) => {
        specialties.list.push(action.payload);
    },
    specialtyRemoved: (specialties, action) => {
      const index = specialties.list.findIndex(
        (specialty) => specialty.id === action.payload.id
      );
      specialties.list.splice(index, 1);
    },
    pageChanged: (specialties, action) => {
      const { page: targetPage } = action.payload;
      specialties.page = targetPage;
    }
  },
});

export const {
    specialtiesRequested,
    specialtiesRequestSucceded,
    specialtiesRequestFailed,
    specialtyDetailsRequestSucceded,
    specialtyAdded,
    specialtyRemoved,
    pageChanged
} = slice.actions;

// Action Creators
const url = "/lookup/scrap-type-admin/all";

export const loadSpecialties = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: specialtiesRequested.type,
      onSuccess: specialtiesRequestSucceded.type,
      onError: specialtiesRequestFailed.type,
    })
  );
};

export const loadSpecialtyDetails = (id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `/lookup/scrap-type/${id}`,
      // onStart: merchantsRequested.type,
      onSuccess: specialtyDetailsRequestSucceded.type,
      // onError: merchantsRequestFailed.type,
    })
  );
};

export const addSpecialty = (specialty) =>
  apiCallStarted({
    url,
    method: "post",
    data: specialty,
    onSuccess: specialtyAdded.type,
  });

export default slice.reducer;
