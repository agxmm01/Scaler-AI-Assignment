import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./ProductReducers.js";

const rootReducer = combineReducers({
  products: productReducer
});

export default rootReducer;