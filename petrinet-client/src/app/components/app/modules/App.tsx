import Switch from "react-bootstrap/esm/Switch";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Editor from "../../editor";
import Header from "../../header";
import { HeaderProps } from "../../header/modules/Header";
import "../styles/App.scss";

function App(props: any) {
  return (
    <Router>
      <Header {...(props as HeaderProps)} />
      <Switch>
        <Route path="/" exact>
          <Editor />
        </Route>
        <Route path="/profile"></Route>
      </Switch>
    </Router>
  );
}

export default App;
