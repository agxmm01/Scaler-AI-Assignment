import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  UPDATE_CART_REQUEST,
  UPDATE_CART_SUCCESS,
  UPDATE_CART_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE
} from "../Actions/cartActions";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  cartCount: 0,
  subtotal: 0,
  tax: 0,
  total: 0
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Cart
    case FETCH_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CART_SUCCESS:
      const cartItems = action.payload || [];
      const cartCount = cartItems.length;
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + tax;

      return {
        ...state,
        cartItems,
        cartCount,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        loading: false,
        error: null
      };

    case FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Add to Cart
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        cartCount: action.payload,
        loading: false,
        error: null
      };

    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update Cart
    case UPDATE_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case UPDATE_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case UPDATE_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Remove from Cart
    case REMOVE_FROM_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        cartCount: action.payload,
        loading: false,
        error: null
      };

    case REMOVE_FROM_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Clear Cart
    case CLEAR_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        cartItems: [],
        cartCount: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
        loading: false,
        error: null
      };

    case CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default cartReducer;
