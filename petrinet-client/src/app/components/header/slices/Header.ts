import { createSlice, Slice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  username: "",
};

const HeaderSlice: Slice = createSlice({
  name: "header",
  initialState,
  reducers: {
    signin(state, action) {
      return { ...state, isLoggedIn: true, username: action.payload };
    },
    logout(state, action) {
      return { ...state, isLoggedIn: false, username: "" };
    },
  },
});

const { actions, reducer } = HeaderSlice;
const { signin, logout } = actions;

export const actionCreators = { signin, logout };
export default reducer;
