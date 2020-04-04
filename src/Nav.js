import React from "react";
import { Link } from "react-router-dom";

function Nav({ auth }) {
  const { isAuthenticated, login, logout } = auth;

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <button onClick={isAuthenticated() ? logout : login}>
            {isAuthenticated() ? "Log out" : "Log In"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
