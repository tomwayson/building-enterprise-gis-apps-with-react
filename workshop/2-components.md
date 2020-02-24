# Components

In this workshop we'll install a React implementation of Bootstrap to make the navigation menu interactive. Along the way We'll learn how to localize state with React components.

## Prerequisites

Complete [Workshop 1: Building an Application](./1-building-an-app.md)

## Collapse navigation menu with [reactstrap](https://reactstrap.github.io/)

### Install reactstrap

- run `yarn add reactstrap`
- start app (`yarn start`)

### Create navigation menu

- in `src/App.js`:
  - **insert** the following below the other import statements at the top of the file:
  ```js
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem
  } from 'reactstrap';
  ```
  - **replace** the `<nav>` tag with:
  ```js
  <Navbar color="dark" dark expand="md" fixed="top">
    <NavbarBrand href="#">{title}</NavbarBrand>
    <NavbarToggler />
    <Collapse navbar>
      <Nav navbar>
        <NavItem>
          <span className="nav-link">
            Home
          </span>
        </NavItem>
        <NavItem>
          <span className="nav-link">
            Items
          </span>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
  ```

The `Home` and `Items` nav items appear in the navigation menu until you resize the browser window down to the size of a mobile device. At that point a "hamburger" button appears, but clicking on it doesn't do anything yet.

### Add state for collapse behavior

- create a new `src/AppNav.js` file with the following contents:

```jsx
import React from 'react';

class AppNav extends React.Component {
  render() {
    const { title } = this.props;
    return (
    );
  }
}

export default AppNav;
```

- **move** the `'reactstrap'` `import`s from `./src/App.js` to the top of `./src/AppNav.js`
- **move** the `<NavBar>` component and it's children from `./src/App.js` to inside the `return ()` statement in  `./src/AppNav.js`
- in `src/App.js`:
  - **insert** `import AppNav from './AppNav';` below the other `import` statements at the top of the file
  - **insert** `<AppNav title={title} />` inside the `return ()` statement

The app should look and behave the same as before.

- in `src/AppNav.js`:
  - **insert** the following _above_ the `render()` method:
  ```
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
    }
    toggle = () => {
      this.setState({
        isOpen: !this.state.isOpen
      });
    };
  ```
  - **replace** `<NavbarToggler />` with `<NavbarToggler onClick={this.toggle} />`
  - **replace** `<Collapse navbar>` with `<Collapse isOpen={this.state.isOpen} navbar>`

Clicking on the "hamburger" button now opens/closes the collapsed panel.

#### Notes
- [components and props](https://reactjs.org/docs/components-and-props.html)
- use reactstrap components instead of markup
- [`class`-based components for local state](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class)
- isolating state in a component prevents needless re-renders of the entire app

## Update test

- **rename** `src/App.test.js` to `src/AppNav.test.js`
- **replace** the contents of `src/AppNav.test.js` with:

```js
import React from 'react';
import { render } from '@testing-library/react';
import AppNav from './AppNav';

test('it renders the title', () => {
  const { getByText } = render(<AppNav title="Title" />);
  const linkElement = getByText(/Title/i);
  expect(linkElement).toBeInTheDocument();
});
```

- stop app (`ctrl+C`)
- run the tests w/ `yarn test`
- verify that tests still pass
- stop tests (`ctrl+C`)

## Next steps

In [Workshop 3: Routing](./3-routing.md) we'll add client-side routing and wire up the Home and Items navigation links.
