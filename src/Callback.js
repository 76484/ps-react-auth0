import React, { useEffect } from "react";

function Callback({ auth, location }) {
  useEffect(() => {
    if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback URL.");
    }
  }, [auth]);

  return <h1>Loading...</h1>;
}

export default Callback;
