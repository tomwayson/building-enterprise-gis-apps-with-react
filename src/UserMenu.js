import React, { useEffect, useState } from 'react';
import {
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

function UserMenu({ onSignIn, onSignOut, session }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (session) {
      session.getUser().then(setUser);
    } else {
      setUser(null);
    }
  }, [session]);
  const name = user && user.fullName;
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
