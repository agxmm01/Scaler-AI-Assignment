import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./ProductReducers.js";
import cartReducer from "./cartReducer.js";
import orderReducer from "./orderReducer.js";

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: orderReducer
});

export default rootReducer;