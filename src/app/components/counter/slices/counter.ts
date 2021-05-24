import { createSlice, Slice } from "@reduxjs/toolkit";

const counterSlice: Slice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    inc(state, action) {
      return { ...state, value: state.value + action.payload };
    },
    dec(state, action) {
      return { ...state, value: state.value - action.payload };
    },
  },
});

const { actions, reducer } = counterSlice;
const { inc, dec } = actions;

export const actionCreators = { inc, dec };
export default reducer;
