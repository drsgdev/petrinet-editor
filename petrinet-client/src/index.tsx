import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { actionCreators } from "./app/components/counter/slices/counter";
import App from "./App";
import store from "./app/store";
import "./index.css";

const mapState = (state: any) => state;

const ConnectedApp = connect(mapState, actionCreators)(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById("root")
);
