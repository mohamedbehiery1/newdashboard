import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";

const slice = createSlice({
  name: "drivers",
  initialState: {
    list: [],
    driverDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    driversRequested: (drivers, action) => {
      drivers.loading = true;
    },
    driversRequestSucceeded: (drivers, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > drivers.page) {
        drivers.list = [...drivers.list, ...docs];
        drivers.page = page;
        drivers.rowCount = totalDocs;
        drivers.pageSize = limit;
      } else {
        // TODO: to be used in DriverDetails Select List in Order, until converted to autoComplete
        drivers.list = docs;
        drivers.page = 1;
        drivers.rowCount = docs.length;
        drivers.pageSize = docs.length;
      }
      drivers.loading = false;
      drivers.lastFetch = Date.now();
    },
    driversRequestFailed: (drivers, _) => {
      drivers.loading = false;
    },
    driverDetailsRequestSucceded: (drivers, action) => {
      drivers.driverDetails = action.payload.body;
    },
    driverAdded: (drivers, action) => {
      drivers.list.push(action.payload);
    },
    driverRemoved: (drivers, action) => {
      const index = drivers.list.findIndex(
        (driver) => driver.id === action.payload.id
      );
      drivers.list.splice(index, 1);
    },
    pageChanged: (drivers, action) => {
      const { page: targetPage } = action.payload;
      drivers.page = targetPage;
    }
  },
});

export const {
  driversRequested,
  driversRequestSucceeded,
  driversRequestFailed,
  driverDetailsRequestSucceded,
  driverAdded,
  driverRemoved,
  pageChanged
} = slice.actions;

// Action Creators
const apiEndpoints = {
  admin: "/v1/admin-panel/driver",
  merchant: "/v1/merchant-dashboard/driver"
}

export const loadDrivers = (role, page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoints[role]}?page=${page}`,
      onStart: driversRequested.type,
      onSuccess: driversRequestSucceeded.type,
      onError: driversRequestFailed.type,
    })
  );
};

export const loadDriverDetails = (role, id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoints[role]}/${id}`,
      // onStart: driversRequested.type,
      onSuccess: driverDetailsRequestSucceded.type,
      // onError: driversRequestFailed.type,
    })
  );
};

// export const addDriver = (driver) =>
//   apiCallStarted({
//     url,
//     method: "post",
//     data: driver,
//     onSuccess: driverAdded.type,
//   });

export default slice.reducer;
