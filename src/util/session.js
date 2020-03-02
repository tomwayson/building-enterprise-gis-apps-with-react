import { UserSession } from '@esri/arcgis-rest-auth';
import * as Cookies from 'js-cookie';

// this name is arbitrary, but should be relatively unique
const SESSION_COOKIE_NAME = `eaa_session`;

/**
 * sign in using OAuth pop up
 */
export function signIn() {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  return UserSession.beginOAuth2({
    clientId,
    popup: true,
    redirectUri: `${window.location.origin}/redirect.html`
  }).then(saveSession);
}

// save session & user for next time the user loads the app
function saveSession(session) {
  // use session expiration as cookie expiration
  const expires = session.tokenExpires;
  Cookies.set(SESSION_COOKIE_NAME, session.serialize(), { expires });
  return session;
}

/**
 * make sure the user is not logged in the next time they load the app
 */
export function signOut() {
  Cookies.remove(SESSION_COOKIE_NAME);
}

/**
 * restore a previously saved session
 */
export function restoreSession() {
  const serializedSession = Cookies.get(SESSION_COOKIE_NAME);
  const session =
    serializedSession && UserSession.deserialize(serializedSession);
  return session;
}
