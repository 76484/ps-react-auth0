import React, { useState } from "react";
import { Redirect, Route } from "react-router-dom";

import Callback from "./Callback";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Public from "./Public";
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
        <Route
          path="/profile"
          render={() =>
            auth.isAuthenticated() ? (
              <Profile auth={auth} />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route path="/public" component={Public} />
      </div>
    </>
  );
}

export default App;
