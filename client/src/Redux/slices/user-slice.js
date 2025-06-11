import { createSlice } from "@reduxjs/toolkit";

const storedUserData = JSON.parse(localStorage.getItem('userData'));
const initialState = {
  userData: storedUserData || null,
  isAuthenticated: storedUserData ? true : false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;

      localStorage.removeItem('userData');
    }
  }
});

export const { setUserData, clearUserData } = userSlice.actions;

// Selectors
export const selectUserData = (state) => state.user.userData;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;