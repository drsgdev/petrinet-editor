import { PayloadAction } from "@reduxjs/toolkit";
import { takeEvery } from "redux-saga/effects";

//fun
function* counterSagas(action: PayloadAction) {
  const actions: any = {
    "counter/inc": inc,
    "counter/dec": inc,
  };

  yield actions[action.type](action);
}

function* inc(action: PayloadAction) {
  yield console.log(`Logged from saga: ${action.payload}`);
}

export default function* sagas() {
  yield takeEvery("*", counterSagas);
}
