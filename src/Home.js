import React from "react";
import { Link } from "react-router-dom";

function Home({ auth }) {
  return (
    <div>
      <h1>Home</h1>
      {auth.isAuthenticated() ? (
        <Link to="/profile">Profile</Link>
      ) : (
        <button onClick={auth.login}>Log In</button>
      )}
    </div>
  );
}

export default Home;
