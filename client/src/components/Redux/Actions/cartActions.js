import { getAuthToken } from "../../../services/api";

const API_BASE_URL = "https://scaler-ai-assignment.onrender.com/api";

// Action Types
export const FETCH_CART_REQUEST = "FETCH_CART_REQUEST";
export const FETCH_CART_SUCCESS = "FETCH_CART_SUCCESS";
export const FETCH_CART_FAILURE = "FETCH_CART_FAILURE";

export const ADD_TO_CART_REQUEST = "ADD_TO_CART_REQUEST";
export const ADD_TO_CART_SUCCESS = "ADD_TO_CART_SUCCESS";
export const ADD_TO_CART_FAILURE = "ADD_TO_CART_FAILURE";

export const UPDATE_CART_REQUEST = "UPDATE_CART_REQUEST";
export const UPDATE_CART_SUCCESS = "UPDATE_CART_SUCCESS";
export const UPDATE_CART_FAILURE = "UPDATE_CART_FAILURE";

export const REMOVE_FROM_CART_REQUEST = "REMOVE_FROM_CART_REQUEST";
export const REMOVE_FROM_CART_SUCCESS = "REMOVE_FROM_CART_SUCCESS";
export const REMOVE_FROM_CART_FAILURE = "REMOVE_FROM_CART_FAILURE";

export const CLEAR_CART_REQUEST = "CLEAR_CART_REQUEST";
export const CLEAR_CART_SUCCESS = "CLEAR_CART_SUCCESS";
export const CLEAR_CART_FAILURE = "CLEAR_CART_FAILURE";

// Fetch Cart
export const fetchCart = () => async (dispatch) => {
  dispatch({ type: FETCH_CART_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch cart");
    }

    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: data.cartItems
    });
  } catch (error) {
    dispatch({
      type: FETCH_CART_FAILURE,
      payload: error.message
    });
  }
};

// Add to Cart
export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  dispatch({ type: ADD_TO_CART_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }

    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: data.cartCount
    });

    // Fetch updated cart and wait for completion
    return await dispatch(fetchCart());
  } catch (error) {
    dispatch({
      type: ADD_TO_CART_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Update Cart Item
export const updateCartItem = (productId, quantity) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update cart");
    }

    dispatch({
      type: UPDATE_CART_SUCCESS
    });

    // Fetch updated cart and wait for completion
    return await dispatch(fetchCart());
  } catch (error) {
    dispatch({
      type: UPDATE_CART_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Remove from Cart
export const removeFromCart = (productId) => async (dispatch) => {
  dispatch({ type: REMOVE_FROM_CART_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove from cart");
    }

    dispatch({
      type: REMOVE_FROM_CART_SUCCESS,
      payload: data.cartCount
    });

    // Fetch updated cart and wait for completion
    return await dispatch(fetchCart());
  } catch (error) {
    dispatch({
      type: REMOVE_FROM_CART_FAILURE,
      payload: error.message
    });
    throw error;
  }
};

// Clear Cart
export const clearCart = () => async (dispatch) => {
  dispatch({ type: CLEAR_CART_REQUEST });
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to clear cart");
    }

    dispatch({
      type: CLEAR_CART_SUCCESS
    });

    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: []
    });
    return true;
  } catch (error) {
    dispatch({
      type: CLEAR_CART_FAILURE,
      payload: error.message
    });
    throw error;
  }
};
