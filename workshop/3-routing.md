# Routing

## Prerequisites

Complete [Workshop 2: Components](.2-components.md)

## Create Home and Items routes

### Install React Router
- Follow [CRA instructions for adding a router](https://create-react-app.dev/docs/adding-a-router/):
  - `yarn add react-router-dom`
- in `src/index.js`:
  - **insert** `import { BrowserRouter as Router } from 'react-router-dom';` _above_ `import App from './App';`
  - **replace** `<App />` with `<Router><App /></Router>`

### Create and show dummy routes
- add a `src/Home.js` file with the following content:
```js
import React from 'react';

function Home() {
  return <p>Home</p>;
}

export default Home;
```
- add a `src/Items.js` file with the following content:
```js
import React from 'react';

function Items() {
  return <p>Items</p>;
}

export default Items;
```
- in `src/App.js`:
  - **insert** the following _below_ the other `import` statements:
  ```js
  import { Route, Switch } from 'react-router-dom';
  import Home from './Home';
  import Items from './Items';
  ```
  - **replace** the contents _inside_ the `return()` statement with: 
  ```jsx
    <>
      <AppNav title={title} />
      <div className="container mt-5">
        <Switch>
          <Route path="/items">
            <Items />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </>
  ```
- start app (`yarn start`)
- visit `http://localhost:3000/`
- now visit `http://localhost:3000/items`

You see "Home" when visiting `/` route, and "Items" when visiting `/index`, but clicking on the navigation menu items doesn't update the route.

#### Notes
- in React, everything is a component, even routes
- React [fragments](https://reactjs.org/docs/fragments.html)

### Add navigation links
- in `src/AppNav.js`:
  - **insert** `import { NavLink } from 'react-router-dom';` _below_ the other `import` statements
  - **replace** the `<Nav navbar>` _and it's children_ with:
  ```jsx
  <Nav navbar>
    <NavItem>
      <NavLink className="nav-link" exact to="/">
        Home
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink className="nav-link" to="/items">
        Items
      </NavLink>
    </NavItem>
  </Nav>
  ```

Clicking on the navigation menu links updates the route. You can use the back button to go to the previous route.

#### Notes
- it's best to use the link components included with your router

## Create Home route

### Show the title over a background image

- Download https://livingatlas.arcgis.com/assets/img/background-banners/Banner9.jpg and save at `/public/images/Banner9.jpg`
- add a `src/Home.css` file with the following contents:

```css
/* home */
.jumbotron {
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    url(/images/Banner9.jpg) center top/cover no-repeat;
}
```

- **replace** the _entire_ contents of  `src/Home.js` with:

```jsx
import React from 'react';
import './Home.css';
import { title } from './config/app';

function Home() {
  return (
    <div className="jumbotron">
      <h1 className="display-3 text-light text-center mb-5">{title}</h1>
    </div>
  );
}

export default Home;
```

- visit `http://localhost:3000/`

#### Notes

### Add the search form

- TODO:

## Next steps
