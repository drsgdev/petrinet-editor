import { useState } from "react";
import Switch from "react-bootstrap/esm/Switch";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AuthPage from "../../auth-page/modules/AuthPage";
import Editor from "../../editor/modules/Editor";
import Header from "../../header/modules/Header";
import Homepage from "../../homepage/modules/Homepage";
import Profile from "../../profile/modules/Profile";
import "../styles/App.scss";

function App(props: any) {
  const [net, setNet] = useState({});
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{}>({});

  return (
    <Router>
      <Header loggedIn={loggedIn} logout={() => setLoggedIn(false)} />
      <Switch>
        <Route path="/" exact>
          <Homepage openEditor={setNet} resetEditor={() => setNet({})} />
        </Route>
        <Route path="/editor">
          <Editor data={net} />
        </Route>
        <Route path="/login">
          <AuthPage
            login={(user: any) => {
              setLoggedIn(true);
              setUser(user);
            }}
          />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
