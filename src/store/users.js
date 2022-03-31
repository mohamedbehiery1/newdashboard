import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
import { apiCallStarted } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "users",
  initialState: {
    list: [],
    userDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    usersRequested: (users, action) => {
      users.loading = true;
    },
    usersRequestSucceeded: (users, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > users.page) {
        users.list = [...users.list, ...docs];
        users.page = page;
        users.rowCount = totalDocs;
        users.pageSize = limit;
      } else {
        // TODO: to be removed when pagination implemented in loadOrdersByTypeAndZone
        users.list = docs;
        users.page = 1;
        users.rowCount = docs.length;
        users.pageSize = docs.length;
      }
      users.loading = false;
      users.lastFetch = Date.now();
    },
    usersRequestFailed: (users, _) => {
        users.loading = false;
    },
    // userDetailsRequestSucceded: (users, action) => {
    //     users.userDetails = action.payload.body;
    // },
    // userAdded: (users, action) => {
    //   users.list.push(action.payload);
    // },
    // userRemoved: (users, action) => {
    //   const index = users.list.findIndex(
    //     (user) => user.id === action.payload.id
    //   );
    //   users.list.splice(index, 1);
    // },
    pageChanged: (users, action) => {
      const { page: targetPage } = action.payload;
      users.page = targetPage;
    }
  },
});

export const {
  usersRequested,
  usersRequestSucceeded,
  usersRequestFailed,
//   userDetailsRequestSucceded,
//   userAdded,
//   userRemoved,
  pageChanged
} = slice.actions;

// Action Creators
const url = "/user/all";

export const loadUsers = (page) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${url}?page=${page}`,
      onStart: usersRequested.type,
      onSuccess: usersRequestSucceeded.type,
      onError: usersRequestFailed.type,
    })
  );
};

// export const loadUserDetails = (id) => (dispatch, getState) => {
//   dispatch(
//     apiCallStarted({
//       url: `${url}/${id}`,
//       onSuccess: userDetailsRequestSucceded.type,
//     })
//   );
// };

// export const addUser = (user) =>
//   apiCallStarted({
//     url,
//     method: "post",
//     data: user,
//     onSuccess: userAdded.type,
//   });

export default slice.reducer;
