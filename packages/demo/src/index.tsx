import React from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import GitHub from "./GitHub";
import Jupyter from "./Jupyter";
import VSCode from "./VSCode";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/vscode">
          <VSCode />
        </Route>
        <Route path="/jupyter">
          <Jupyter />
        </Route>
        <Route path="/github">
          <GitHub />
        </Route>
        <Route>
          <Redirect to="/vscode" />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
