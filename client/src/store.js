import { configureStore } from "@reduxjs/toolkit";
import rootreducers from "./components/Redux/Reducers/main.js";

const store = configureStore({
  reducer: rootreducers,
  devTools: true, // automatically enabled
});

export default store;