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
- public folder for static assets

### Add the search form

- add a `src/AgoSearch.js` file with the following contents:

```jsx
import React from 'react';

function AgoSearch() {
  function onSubmit(e) {
    // don't actually submit the form
    e.preventDefault();
  }
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <div className="input-group input-group-lg">
        <input
          className="form-control"
          placeholder="search for items"
        />
        <div className="input-group-append">
          <button className="btn btn-secondary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default AgoSearch;
```

- in `src/Home.js`:
  - **insert** `import AgoSearch from './AgoSearch';` at the _bottom_ of the `import` statements
  - **insert** `<AgoSearch />` at _before_ the closing `</div>` tag

You can see the search form, but nothing happens when you submit it.

### Redirect to the items route

- in `src/AgoSearch.js`:
  - **replace** `import React from 'react';` with `import React, { useState } from 'react';`
  - **replace** `function AgoSearch() {` with `function AgoSearch({ onSearch }) {`
  - **insert** the following above the `onSubmit()` function:
  ```jsx
  const [q, setQ] = useState("");
  function onChange(e) {
    // hold onto a copy of the search term
    setQ(e.target.value);
  }
  ```
  - **insert** the following _inside_ `onSubmit()` _below_ `e.preventDefault();`:
  ```jsx
    // call search function that was passed in as a prop
    onSearch && onSearch(q);
  ```
  - **insert** the following _inside_ the `<input>` tag _below_ the `placeholder` attribute:
  ```jsx
          value={q}
          onChange={onChange}
  ```

- in `src/Home.js`:
  - **insert** `import { useHistory } from 'react-router-dom';` at the _bottom_ of the `import` statements
  - **insert** the following _above_ the `return()` statement:
  ```jsx
  const history = useHistory();
  function onSearch (q) {
    history.push(`/items?q=${q}`);
  }
  ```
  - **replace** `<AgoSearch />` with `<AgoSearch onSearch={onSearch} />`
- visit http://localhost:3000/, enter a search term, and click the `Search` button.

Submitting the search form now redirects to the items route with the search term in the query string like `?q=test`.

### Read the search term from the URL

- in `src/Items.js`:
  - **insert** `import { useLocation } from 'react-router-dom';` at the _bottom_ of the `import` statements
  - **replace** the _content_ `Items()` function with:
  ```jsx
  const { search } = useLocation();
  return <p>{search}</p>;
  ```
- visit http://localhost:3000/, enter a search term, and click the `Search` button.

You now see the search string printed on the page. Let's parse the search parameters in the format we'll need in order to query items.

- in `src/Items.js`:
  - **insert** the following _below_ the `import` statements:
  ```jsx
  // parse query string for search params or provide default values
  function parseSearch (search) {
    const params = new URLSearchParams(search);
    const q = params.get('q') || '';
    const start = parseInt(params.get('start')) || 1;
    const num = parseInt(params.get('num')) || 10;
    return { q, start, num };
  }
  ```
  - **replace** the _content_ of the `Items()` function with:
  ```jsx
  const { search } = useLocation();
  const { q, start, num } = parseSearch(search);
  return <p>{JSON.stringify({ q, start, num })}</p>;
  ```
- visit http://localhost:3000/items?q=test
- now try adding `start`, `num`, and/or arbitrary params to the URL, like http://localhost:3000/items?q=test&start=11&num=20&skip=me

The route now parses the relevant params from the URL, or uses default values, and ignores any other params.

#### Notes:
- the [`useState()` hook](https://reactjs.org/docs/hooks-state.html) lets us manage local state within an function component
- pass state from child components to their parents using a callback (i.e. `onSearch`)
- React Router's hooks (`useHistory()` and `useLocation()`) let us [access and set the global state of the router](https://reacttraining.com/blog/react-router-v5-1/)

## Add tests

### Test the search component

- stop app (`ctrl+C`)
- create a new `AgoSearch.test.js` file with the following content:
```jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AgoSearch from './AgoSearch';

test('it should pass input value on submit', () => {
  function onSearch (q) {
    expect(q).toBe('test');
  }
  const { getByPlaceholderText, getByText } = render(<AgoSearch onSearch={onSearch} />);
  // simulate user typing in 'test' and clicking search
  const input = getByPlaceholderText(/search for items/i);
  fireEvent.change(input, { target: { value: 'test' }});
  const button = getByText('Search');
  fireEvent.click(button);
});
```
- run the tests w/ `yarn test`
- verify that they pass
- stop tests (`ctrl+C`)

#### Notes:
- use [`fireEvent`](https://testing-library.com/docs/dom-testing-library/api-events) to emulate user interactions

## Next steps

In [Workshop 4: Data](./4-data.md) we'll install the [@esri/arcgis-rest-portal](https://esri.github.io/arcgis-rest-js/api/portal/) library to actually perform our item search and display the data.
