import React, { useState } from 'react';
import { title } from './config/app';
import AppNav from './AppNav';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Items from './Items';
import UserMenu from './UserMenu';
import { signIn, signOut } from './util/session';

function App({ prevSession }) {
  const [session, setSession] = useState(prevSession);
  // NOTE: the following callbacks and userMenu should be wrapped in useMemo
  // https://reactjs.org/docs/hooks-reference.html#usememo
  const onSignIn = () => {
    signIn().then(setSession);
  }
  const onSignOut = () => {
    setSession(null);
    signOut();
  }
  const userMenu = (
    <UserMenu
      onSignIn={onSignIn}
      onSignOut={onSignOut}
      session={session}
    />
  );
  return (
    <>
      <AppNav title={title} userMenu={userMenu} />
      <div className="container mt-5">
        <Switch>
          <Route path="/items">
            <Items session={session} />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
