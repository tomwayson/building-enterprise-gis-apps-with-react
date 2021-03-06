# Authentication

We already installed `@esri/arcgis-rest-auth`, but now we will actually use it to sign users into our application.

## Prerequisites

Complete [Workshop 4: Data](./4-data.md)

## Register your app with ArcGIS.com

Sign in at https://developers.arcgis.com and click the "+" dropdown and then "New Application".

Give your app a name, tags and a description and click the "Register" button.

The app item will be created in your ArcGIS Org, and the browser will now show information - including the `Client Id`. Copy that, but leave the browser tab open.

We also need to add a "Redirect URI". Click on the Authentication Tab, then scroll down, and paste `http://localhost:3000` into the Redirect URI box and click `Add`. (Keep this window open, or take note of the itemId for future reference in the Deployment section).

Create a new `.env` file with the following content:

```
REACT_APP_CLIENT_ID=<PASTE-YOUR-CLIENT-ID-HERE>
```

We'll use this environment variable later.

## Adding Sign-In to Our app

First, let's add the user menu.

- start app (`npm start`)
- create a new `src/UserMenu.js` with the following contents:
```jsx
import React from 'react';
import {
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

function UserMenu({ onSignIn, onSignOut, session }) {
  const name = session && session.username;
  if (!name) {
    // show sign in link
    return (
      <NavItem className="ml-auto">
        <Button color="link" onClick={onSignIn} className="nav-link">
          Sign In
        </Button>
      </NavItem>
    );
  }
  // show user menu
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        {name}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={onSignOut}>Sign Out</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

export default UserMenu;
```

Now we need to add the `onSignIn` and `onSignOut` callbacks to the application component.

- in `src/App.js`:
  - **insert** `import UserMenu from './UserMenu';` at the _bottom_ of the `import` statements
  - **insert** the following _above_ the `return` statement
  ```jsx
  const onSignIn = () => {
    console.log('sign in');
  }
  const onSignOut = () => {
    console.log('sign out');
  }
  const userMenu = (
    <UserMenu
      onSignIn={onSignIn}
      onSignOut={onSignOut}
    />
  );
  ```
- in `src/AppNav.js`:
  - **replace** `const { title } = this.props;` with `const { title, userMenu } = this.props;`
  - **insert** the following _after_ the `<Nav navbar>`:
  ```jsx
  <Nav navbar className="ml-auto">
    {userMenu}
  </Nav>
  ```

Now let's run our app and see how things work. `npm start`, open `http://localhost:3000` in your browser, and open dev tools.

You should see your "Sign In" link in the nav bar. Clicking on it, should add messages to the console.

#### Notes:
We bind the user menu component to the callbacks and pass it to the nav menu [in order to avoid prop drilling](https://reactjs.org/docs/context.html#before-you-use-context).

## Hooking up Sign In
In order to use `@esri/arcgis-rest-auth` we need to first add a redirect page before we add the code to sign in...

- stop app (`ctrl+C`)
- create a new `public/redirect.html` with the following contents:
```html
<!DOCTYPE html>
<html>
<head>
  <!-- arcgis-rest-js script to complete user sign in -->
  <!-- NOTE: this JS file is copied from node_modules by a package.json script -->
  <script src="./auth.umd.min.js"></script>
  <script>
    function loadHandler() {
      // get client id from url hash
      const match = window.location.href.match(/&state=([^&]+)/);
      const clientId = match && match[1];
      // complete the oauth flow
      session = arcgisRest.UserSession.completeOAuth2({
        clientId: clientId,
      });
    }
  </script>
</head>
<body onload="loadHandler();">
</body>
</html>
```
- in `package.json`:
  - **insert** the following at the _top_ of the `scripts`:
  ```json
    "copy:auth": "cp ./node_modules/@esri/arcgis-rest-auth/dist/umd/auth.umd.min.js ./public/auth.umd.min.js",
    "prestart": "npm run copy:auth",
  ```
- **insert** the following at the _bottom_ of `.gitignore`:
```
# auth
.env
public/auth.umd.min.js
```

Now that we've added a redirect page and configured our scripts to copy the script it needs, we can add code to the application to sign in.

- start app (`npm start`)
- create a new `src/util/session.js` file w/ the following contents:
```js
import { UserSession } from '@esri/arcgis-rest-auth';
/**
 * sign in using OAuth pop up
 */
export function signIn() {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  return UserSession.beginOAuth2({
    clientId,
    popup: true,
    redirectUri: `${window.location.origin}/redirect.html`
  });
}
```
- in `src/App.js`
  - **replace** `import React from 'react';` with `import React, { useState, useMemo } from 'react';`
  - **insert** `import { signIn } from './util/session';` at the _bottom_ of the `import` statements
  - **insert** `const [session, setSession] = useState(null);` _above_ the `onSignIn()` function
  - **replace** `console.log('sign in');` with `signIn().then(setSession);`
  - **replace** `console.log('sign out');` with `setSession(null);`
  - **insert**  `session={session}` _inside_ the `<UserMenu>` component

Now, clicking the "Sign In" link should open a pop-up window. Sign In with valid credentials, and you should see your user name with a drop down menu. Clicking the the "Sign Out" link in the drop down shows the "Sign In" link once again.

#### Notes
- CRA makes environment variables that start with `REACT_APP_` [available at runtime via a `process.env` global](https://create-react-app.dev/docs/adding-custom-environment-variables/).

## Making it Better...

At this point we have basic authentication working and our session has all our ArcGIS Online information and we can call the API etc.

But... the user experience is weak. So let's show the current user in the header and move Sign Out into a dropdown.

- in `/src/UserMenu.js`
  - **replace** `import React from 'react';` with `import React, { useEffect, useState } from 'react';`
  - **replace** `const name = session && session.username;` with the following:
  ```jsx
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (session) {
      session.getUser().then(setUser);
    } else {
      setUser(null);
    }
  }, [session]);
  const name = user && user.fullName;
  ```

## Persisting Session
At this point you've likely gotten sick of having to sign in every time the app refreshes, so let's fix that.

`@esri/arcgis-rest-auth` provide methods to serialize and de-serialize a user session, but has no opinion on how you persist the serialized session (i.e. cookies, local storage, etc).

We'll use cookies for our app, and to make that easier we'll start by installing a library for working with cookies.

- stop app (`ctrl+C`)
- run `npm install --save js-cookie`

Now we can add the code that writes the cookie every time the user signs in/out.

- start app (`npm start`)
- in `src/util/session.js`
  - **insert** the following _below_ the `import` statements:
  ```js
  import * as Cookies from 'js-cookie';

  // this name is arbitrary, but should be relatively unique
  const SESSION_COOKIE_NAME = `eaa_session`;
  ```
  - **insert** the following at _the bottom_ of the file:
  ```js
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
  ```
  - **replace** the _last line_ of the `signIn()` function (`});`) with `}).then(saveSession);`

Now sign in and look in devtools, on the "Application" tab, click on Local Storage on the left, and click on `http://localhost:3000`. If you are signed in, you will see a key called `eaa_session` that holds the serialized session as a string.

Now we need to check for that cookie when the user first visits the application. A good place for this kind of code is in `src/index.js` because that happens before the the application renders. First though we'll add a utility function to read the cookie and de-serialize the session.

- in `src/util/session.js`
  - **insert** the following at _the bottom_ of the file:
  ```js
  /**
  * restore a previously saved session
  */
  export function restoreSession() {
    const serializedSession = Cookies.get(SESSION_COOKIE_NAME);
    const session =
      serializedSession && UserSession.deserialize(serializedSession);
    return session;
  }
  ```
- in `index.js`:
  - **insert** the following _below_ the `import` statements:
  ```js
  import { restoreSession } from './util/session';

  const prevSession = restoreSession();
  ```
  - **replace** `<App />` with `<App prevSession={prevSession} />`
- in `src/App.js`:
  - **replace** `function App() {` with `function App({ prevSession }) {`
  - **replace** `const [session, setSession] = useState(null);` with `const [session, setSession] = useState(prevSession);`

At this point you should have an app that allows a user to sign in with ArcGIS.com credentials, shows their name in the UI, and allows them to sign out. If the close the browser or refresh the page while signed in, the app will load their saved token information from localStorage and automatically sign them in.

## Passing credentials with search requests

Showing the user their own name is nice, but the primary reason we made them sign in is so that we can send their credentials (i.e. a token) along with search requests.

The `searchItems()` function has an [`authentication`](https://esri.github.io/arcgis-rest-js/api/portal/ISearchOptions/#authentication) option that you can use to pass the user session and make authenticated requests.

- in `src/App.js`:
  - **replace** `<Items />` with `<Items session={session} />`
- in `src/Items.js`:
  - **replace** `function Items() {` with `function Items({ session }) {`
  - **replace** `searchItems({ q, start, num })` with `searchItems({ q, start, num, authentication: session })`
  - **replace** `}, [q, num, start]);` with `}, [q, num, start, session]);`

Now when you're signed in and you perform a search, if you inspect the network requests you'll see that a token is passes along with the search params.

The most visual way to test this is to search for a private item. When you are not signed in, it won't show up in the results, then when you sign in it should appear in the list without you having to re-submit the search form.

## Tests

Since jest doesn't run tests in an actual browser, we'll need to mock the code that sets and reads cookies. Also, since `restoreSession()` is called in `index.js`, we can't rely on rendering tests to cover that code. Let's add some unit tests for that function.

- stop app (`ctrl+C`)
- run the tests w/ `npm test`
- create a new `src/util/session.js` file w/ the following contents:
```js
import { UserSession } from '@esri/arcgis-rest-auth';
import * as Cookies from 'js-cookie';
import { restoreSession } from './session';

jest.mock('js-cookie');
jest.mock('@esri/arcgis-rest-auth');

describe('util', function() {
  describe('session', function() {
    describe('restoreSession', function() {
      beforeEach(function() {
        Cookies.get.mockClear();
      });
      describe('when no cookie', function() {
        it('reads the cookie but does not deserialize', function() {
          Cookies.get.mockReturnValueOnce(undefined);
          restoreSession();
          expect(Cookies.get.mock.calls.length).toBe(1);
          expect(Cookies.get.mock.calls[0][0]).toBe('eaa_session');
          expect(UserSession.deserialize.mock.calls.length).toBe(0);
        });
      });
      describe('when cookie exists', function() {
        it('reads the cookie and deserializes it', function() {
          Cookies.get.mockReturnValueOnce('notarealsession');
          restoreSession();
          expect(Cookies.get.mock.calls.length).toBe(1);
          expect(Cookies.get.mock.calls[0][0]).toBe('eaa_session');
          expect(UserSession.deserialize.mock.calls.length).toBe(1);
          expect(UserSession.deserialize.mock.calls[0][0]).toBe(
            'notarealsession'
          );
        });
      });
    });
  });
});
```
- the tests should re-run and pass once you save the files
- stop tests (`ctrl+C`)

Unit tests are good for covering different scenarios. In this case we tested both the case when a cookie already exists and when it doesn't.

From here we would probably want to expand our smoke test to exercise the user menu and/or add unit tests for the `signIn()` and `signOut()` functions [like these](https://github.com/tomwayson/create-arcgis-app/blob/ambitious-arcgis-app-2018/src/utils/session.test.js#L36-L57).

## Next steps

In [Workshop 6: Maps](./6-maps.md) we'll use the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) to show the search results on a map.
