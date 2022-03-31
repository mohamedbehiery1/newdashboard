import { createSlice } from "@reduxjs/toolkit";
import { apiCallStarted } from "./api";
import moment from "moment";
import { forEach, includes } from "lodash";

const slice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    unassignedZones: [],
    lastOrderTime: null,
    orderDetails: {},
    loading: false,
    lastFetch: null,
    rowCount: 0,
    pageSize: 0,
    page: 0
  },
  reducers: {
    ordersRequested: (orders, action) => {
      orders.loading = true;
    },
    ordersRequestSucceeded: (orders, action) => {
      const { docs, totalDocs, limit, page } = action.payload.body;
      if (page && page > orders.page) {
        orders.list = [...orders.list, ...docs];
        orders.page = page;
        orders.rowCount = totalDocs;
        orders.pageSize = limit;
      } else {
        // TODO: to be removed when pagination implemented in loadOrdersByTypeAndZone
        orders.list = docs;
        orders.page = 1;
        orders.rowCount = docs.length;
        orders.pageSize = docs.length;
      }
      orders.loading = false;
      orders.lastFetch = Date.now();
    },
    // ordersRequestByTypeAndZoneSucceeded: (orders, action) => {
    //   orders.list = action.payload.body;
    //   orders.loading = false;
    //   orders.lastFetch = Date.now();
    //   // orders.pageLimit = action.payload.body.limit
    //   // totalDocs(pin):10
    //   // totalPages(pin):1
    //   // page(pin):1
    //   // pagingCounter(pin):1
    //   // hasPrevPage(pin):false
    //   // hasNextPage(pin):false
    //   // prevPage(pin):null
    //   // nextPage(pin):null
    // },
    ordersRequestByStatusSucceeded: (orders, action) => {
      orders.unassignedZones = action.payload.body.zones;
      orders.lastOrderTime = action.payload.body.lastOrderTime
      orders.loading = false;
    },
    ordersRequestFailed: (orders, _) => {
      orders.loading = false;
    },
    orderDetailsRequestSucceeded: (orders, action) => {
      orders.orderDetails = action.payload.body;
    },
    orderAdded: (orders, action) => {
      orders.list.push(action.payload);
    },
    orderRemoved: (orders, action) => {
      const index = orders.list.findIndex(
        (order) => order.id === action.payload.id
      );
      orders.list.splice(index, 1);
    },
    orderSmsResent: (orders, action) => {
      forEach(orders.list, order => {
        if (includes(action.payload.ids, order.id)) {
          const dateStringUTC = moment().utc().format();
          order.locationSmsTime = dateStringUTC;
        }
      })
    },
    pageChanged: (orders, action) => {
      const { page: targetPage } = action.payload;
      orders.page = targetPage;
    }
  },
});

export const {
  ordersRequested,
  ordersRequestSucceeded,
  ordersRequestByStatusSucceeded,
  ordersRequestByTypeAndZoneSucceeded,
  ordersRequestFailed,
  orderDetailsRequestSucceeded,
  orderAdded,
  orderRemoved,
  orderSmsResent,
  pageChanged
} = slice.actions;

// Action Creators
const apiEndpoint = "/scrap/inquiry/all"
const followupApiEndpoint = '/scrap/inquiry/merchants-by-call-status'

const params =  {
  'new': 2,
  'pending-delivery': 3,
  'delivered': 4,
  'collected': 5,
  'canceled': 6
}

export const loadOrders = (page, type) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoint}?page=${page}&inquiryStatus=2`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};

export const loadPendingOrders = (page, type) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoint}?page=${page}&inquiryStatus=3`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};

export const loadDeliveredOrders = (page, type) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoint}?page=${page}&inquiryStatus=4`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};

export const loadCollectedOrders = (page, type) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoint}?page=${page}&inquiryStatus=5`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};

export const loadCanceledOrders = (page, type) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoint}?page=${page}&inquiryStatus=6`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};


export const loadFollowupOrders = (page, type) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${followupApiEndpoint}?page=${page}`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};


export const loadOrdersByTypeAndZone = (role, page, type, zone) => (dispatch, getState) => {
  dispatch(
    apiCallStarted({
      url: `${apiEndpoint}/zone/${zone}?type=${type}`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};

export const loadOrdersByStatus = (role, type) => (dispatch, getState) => {
  // const { lastFetch } = getState().entities.orders;
  // const diffInMinutes = moment().diff(moment(lastFetch), "M");
  // if (diffInMinutes < 10) return;
  dispatch(
    apiCallStarted({
      url: `${apiEndpoint}/${type}`,
      onStart: ordersRequested.type,
      onSuccess: ordersRequestByStatusSucceeded.type,
      onError: ordersRequestFailed.type,
    })
  );
};

export const loadOrderDetails = (role, id, notificationId) => (dispatch, getState) => {
  let url = `${apiEndpoint}/${id}`;
  if (notificationId) {
    url += `?notification=${notificationId}`
  }
  dispatch(
    apiCallStarted({
      url,
      // onStart: ordersRequested.type,
      onSuccess: orderDetailsRequestSucceeded.type,
      // onError: ordersRequestFailed.type,
    })
  );
};

// export const addOrder = (order) =>
//   apiCallStarted({
//     url,
//     method: "post",
//     data: order,
//     onSuccess: orderAdded.type,
//   });

export default slice.reducer;
