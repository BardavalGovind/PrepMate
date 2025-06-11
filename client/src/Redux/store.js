import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";

export const store = configureStore({
  reducer: {
    user: userReducer
  }
});