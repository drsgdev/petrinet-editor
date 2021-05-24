import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import counterReducer from "./components/counter/slices/counter";
import counterSaga from "./components/counter/sagas/counter";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(counterSaga);

export default store;
