import React, { useState } from "react";
import { Route } from "react-router-dom";

import Callback from "./Callback";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";

function App({ history, location }) {
  const [auth] = useState(new Auth(history));

  return (
    <>
      <Nav />
      <div className="body">
        <Route path="/" exact render={() => <Home auth={auth} />} />
        <Route
          path="/callback"
          render={() => <Callback auth={auth} location={location} />}
        />
        <Route path="/profile" render={() => <Profile auth={auth} />} />
      </div>
    </>
  );
}

export default App;
