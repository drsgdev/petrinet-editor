import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import "./App.css";
import store from "./app/store";
import logo from "./logo.svg";

const popover = (
  <Popover id="popover-basic" className="popover">
    <Popover.Title as="h3">Popover right</Popover.Title>
    <Popover.Content>
      And here's some <strong>amazing</strong> content. It's very engaging.
      right?
    </Popover.Content>
  </Popover>
);

export interface AppProps {
  inc?: (value: number) => void;
  counter?: any;
}

function App(props: AppProps) {
  const { inc, counter } = props;

  return (
    <React.Fragment>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <p>
            Counter: <code>{counter.value}</code>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button variant="success">Click me to see</Button>
          </OverlayTrigger>

          <button
            onClick={() => {
              inc && inc(5);
              console.log(store.getState());
            }}
          >
            Increment
          </button>
        </header>
      </div>
    </React.Fragment>
  );
}

export default App;
