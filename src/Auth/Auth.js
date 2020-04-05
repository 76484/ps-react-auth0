import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";

let _accessToken = null;
let _expiresAt = null;
// eslint-disable-next-line
let _idToken = null;
let _scopes = null;

export default class Auth {
  constructor(history) {
    this.history = history;
    this.requestedScopes = "openid profile email read:courses";
    this.userProfile = null;
    this.auth0 = new auth0.WebAuth({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      responseType: "token id_token",
      scope: this.requestedScopes,
    });
  }

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error("No access token found.");
    }

    return _accessToken;
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
        const redirectLocation =
          JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN) || null) || "/";
        this.setSession(authResult);
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  isAuthenticated() {
    return Date.now() < _expiresAt;
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize();
  };

  logout = () => {
    _accessToken = null;
    _expiresAt = null;
    _idToken = null;
    _scopes = null;

    this.auth0.logout({
      clientId: process.env.REACT_APP_AUTH0_CLIENTID,
      returnTo: "http://localhost:3000", //TODO: Get this from a constant.
    });
  };

  renewToken(callback) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }
      if (callback) {
        callback(err, result);
      }
    });
  }

  scheduleTokenRenewal() {
    const delay = _expiresAt - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        this.renewToken();
      }, delay);
    }
  }

  setSession = (authResult) => {
    _accessToken = authResult.accessToken;
    _expiresAt = authResult.expiresIn * 1000 + Date.now();
    _idToken = authResult.idToken;
    _scopes = authResult.scope || this.requestedScopes || "";
    this.scheduleTokenRenewal();
  };

  userHasScopes(scopes) {
    return scopes.every((scope) => _scopes.includes(scope));
  }
}
