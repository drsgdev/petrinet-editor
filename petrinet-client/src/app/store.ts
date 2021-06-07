import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import headerReducer from "./components/header/slices/Header";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    header: headerReducer,
  },
  middleware: getDefaultMiddleware().concat(sagaMiddleware),
});

export default store;
