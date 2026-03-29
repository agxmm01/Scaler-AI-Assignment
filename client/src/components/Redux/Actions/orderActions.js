import { getAuthToken } from "../../../services/api";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

// Action Types
export const FETCH_ORDERS_REQUEST = "FETCH_ORDERS_REQUEST";
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
export const FETCH_ORDERS_FAILURE = "FETCH_ORDERS_FAILURE";

export const FETCH_ORDER_DETAILS_REQUEST = "FETCH_ORDER_DETAILS_REQUEST";
export const FETCH_ORDER_DETAILS_SUCCESS = "FETCH_ORDER_DETAILS_SUCCESS";
export const FETCH_ORDER_DETAILS_FAILURE = "FETCH_ORDER_DETAILS_FAILURE";

export const CREATE_ORDER_REQUEST = "CREATE_ORDER_REQUEST";
export const CREATE_ORDER_SUCCESS = "CREATE_ORDER_SUCCESS";
export const CREATE_ORDER_FAILURE = "CREATE_ORDER_FAILURE";

export const CANCEL_ORDER_REQUEST = "CANCEL_ORDER_REQUEST";
export const CANCEL_ORDER_SUCCESS = "CANCEL_ORDER_SUCCESS";
export const CANCEL_ORDER_FAILURE = "CANCEL_ORDER_FAILURE";

export const CLEAR_ORDER_DETAILS = "CLEAR_ORDER_DETAILS";

// Fetch Orders
export const fetchOrders = (page = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: FETCH_ORDERS_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: FETCH_ORDERS_FAILURE,
      payload: error.message
    });
  }
};

// Fetch Order Details
export const fetchOrderDetails = (orderId) => async (dispatch) => {
  dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch order");
    }

    dispatch({
      type: FETCH_ORDER_DETAILS_SUCCESS,
      payload: data.order
    });
  } catch (error) {
    dispatch({
      type: FETCH_ORDER_DETAILS_FAILURE,
      payload: error.message
    });
  }
};

// Create Order
export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data
    });

    return data;
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Cancel Order
export const cancelOrder = (orderId) => async (dispatch) => {
  dispatch({ type: CANCEL_ORDER_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/cancel`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to cancel order");
    }

    dispatch({
      type: CANCEL_ORDER_SUCCESS,
      payload: orderId
    });

    return data;
  } catch (error) {
    dispatch({
      type: CANCEL_ORDER_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Clear Order Details
export const clearOrderDetails = () => ({
  type: CLEAR_ORDER_DETAILS
});
