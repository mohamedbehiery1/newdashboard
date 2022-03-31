import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "zones",
  initialState: {
    list: [],
    zoneDetails: {},
    loading: false,
    lastFetch: null,
    pageLimit: 10
  },
  reducers: {
    zonesRequested: (zones, action) => {
      zones.loading = true;
    },
    zonesRequestSucceded: (zones, action) => {
      zones.list = action.payload.body.docs;
      zones.loading = false;
      zones.lastFetch = Date.now();
      zones.pageLimit = action.payload.body.limit
      // totalDocs(pin):10
      // totalPages(pin):1
      // page(pin):1
      // pagingCounter(pin):1
      // hasPrevPage(pin):false
      // hasNextPage(pin):false
      // prevPage(pin):null
      // nextPage(pin):null
    },
    zonesRequestFailed: (zones, _) => {
      zones.loading = false;
    },
    zoneDetailsRequestSucceded: (zones, action) => {
      zones.zoneDetails = action.payload.body;
    },
    zoneAdded: (zones, action) => {
      zones.list.push(action.payload);
    },
    zoneRemoved: (zones, action) => {
      const index = zones.list.findIndex(
        (zone) => zone.id === action.payload.id
      );
      zones.list.splice(index, 1);
    },
  },
});

const {
  zonesRequested,
  zonesRequestSucceded,
  zonesRequestFailed,
  zoneDetailsRequestSucceded,
  zoneAdded,
  // zoneRemoved,
} = slice.actions;

// Action Creators
const apiEndpoints = {
  admin: "/v1/admin-panel/zone",
  merchant: "/v1/merchant-dashboard/zone"
}

export const loadZones = (role) => (dispatch, getState) => {
  const { lastFetch } = getState().entities.zones;
  const diffInMinutes = moment().diff(moment(lastFetch), "M");
  if (diffInMinutes < 10) return;
  dispatch(
    apiCallStarted({
      url: `${apiEndpoints[role]}?page=1`,
      onStart: zonesRequested.type,
      onSuccess: zonesRequestSucceded.type,
      onError: zonesRequestFailed.type,
    })
  );
};

export const loadZoneDetails = (role, id) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoints[role]}/${id}`,
      // onStart: zonesRequested.type,
      onSuccess: zoneDetailsRequestSucceded.type,
      // onError: zonesRequestFailed.type,
    })
  );
};

// export const addZone = (zone) =>
//   apiCallStarted({
//     url,
//     method: "post",
//     data: zone,
//     onSuccess: zoneAdded.type,
//   });

export default slice.reducer;
