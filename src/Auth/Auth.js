import auth0 from "auth0-js";

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.auth0 = new auth0.WebAuth({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      responseType: "token id_token",
      scope: "openid profile email",
    });
  }

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      throw new Error("No access token found.");
    }

    return accessToken;
  };

  getProfile = (callback) => {
    if (this.userProfile) {
      return callback(null, this.userProfile);
    }

    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      callback(err, profile);
    });
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push("/");
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
    });
  };

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return Date.now() < expiresAt;
  }

  login = () => {
    this.auth0.authorize();
  };

  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");

    this.userProfile = null;

    this.auth0.logout({
      clientId: process.env.REACT_APP_AUTH0_CLIENTID,
      returnTo: "http://localhost:3000", //TODO: Get this from a constant.
    });
  };

  setSession = (authResult) => {
    // set the time that the access token will expire
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + Date.now());

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  };
}
