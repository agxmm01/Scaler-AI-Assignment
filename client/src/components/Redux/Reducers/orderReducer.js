import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDER_DETAILS_REQUEST,
  FETCH_ORDER_DETAILS_SUCCESS,
  FETCH_ORDER_DETAILS_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  CLEAR_ORDER_DETAILS
} from "../Actions/orderActions";

const initialState = {
  orders: [],
  orderDetails: null,
  recentOrder: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  }
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Orders
    case FETCH_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload.orders,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };

    case FETCH_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Fetch Order Details
    case FETCH_ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        orderDetails: action.payload,
        loading: false,
        error: null
      };

    case FETCH_ORDER_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Create Order
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        recentOrder: action.payload,
        loading: false,
        error: null
      };

    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Cancel Order
    case CANCEL_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CANCEL_ORDER_SUCCESS:
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload ? { ...order, status: 'cancelled' } : order
      );
      return {
        ...state,
        orders: updatedOrders,
        loading: false,
        error: null
      };

    case CANCEL_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Clear Order Details
    case CLEAR_ORDER_DETAILS:
      return {
        ...state,
        orderDetails: null,
        recentOrder: null
      };

    default:
      return state;
  }
};

export default orderReducer;
