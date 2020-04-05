import React, { useState } from "react";
import { Route } from "react-router-dom";

import Callback from "./Callback";
import Courses from "./Courses";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Public from "./Public";
import Private from "./Private";
import PrivateRoute from "./PrivateRoute";
import Auth from "./Auth/Auth";

function App({ history, location }) {
  const [auth] = useState(new Auth(history));

  return (
    <>
      <Nav auth={auth} />
      <div className="body">
        <Route path="/" exact render={() => <Home auth={auth} />} />
        <Route
          path="/callback"
          render={() => <Callback auth={auth} location={location} />}
        />
        <PrivateRoute path="/profile" component={Profile} auth={auth} />
        <Route path="/public" component={Public} />
        <PrivateRoute path="/private" component={Private} auth={auth} />
        <PrivateRoute
          path="/courses"
          component={Courses}
          auth={auth}
          scopes={["read:courses"]}
        />
      </div>
    </>
  );
}

export default App;
