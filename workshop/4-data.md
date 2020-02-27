# Data

## Prerequisites

Complete [Workshop 3: Routing](./3-routing.md)

## Search items with [@esri/arcgis-rest-portal](https://esri.github.io/arcgis-rest-js/api/portal/)

### Install @esri/arcgis-rest-portal and dependencies

- `yarn add @esri/arcgis-rest-portal @esri/arcgis-rest-auth@^2.0.0  @esri/arcgis-rest-request@^2.0.0`
- start app (`yarn start`)

### Search for items
- visit http://localhost:3000/items?q=test
- in `src/Items.js`:
  - **insert** `, { useEffect, useState }` after `React`
  - **insert** `import { searchItems } from '@esri/arcgis-rest-portal';` at the _bottom_ of the `import` statements
  - **insert** the following _above_ the `Items()` function:
  ```jsx
  const defaultResponse = {
    results: [],
    total: 0
  };
  ```
  - **insert** the following _above_ the `return` statement in the `Items()` function:
  ```jsx
  const [response, setResponse] = useState(defaultResponse);
  const { results, total } = response;

  useEffect(() => {
    if (!q) {
      // invalid search term, emulate an empty response rather than sending a request
      setResponse(defaultResponse);
    } else {
      // execute search and update state
      searchItems({ q, start, num })
      .then(setResponse);
    }
  }, [q, num, start]);
  ```
  - **replace** the `return` statement in the `Items()` function with:
  ```jsx
  return <>
    <div className="row mb-2">
      <div className="col-9">
        <h2>
          Your search for &quot;{q}&quot; yielded {total} items
        </h2>
      </div>
      <div className="col-3">
        {/* TODO: inline search form goes here */}
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        {results && JSON.stringify(results)}
      </div>
    </div>
  </>;
  ```

Now when we change query parameters and reload the page we'll see the response data in the page. Open up Developer Tools and verify that the application is making the expected network requests.

#### Notes:
- [`useEffect()`](https://reactjs.org/docs/hooks-effect.html) is for side effects like loading data

## Format the response data

- create a new `ItemsTable.js` file with the following content:
```jsx
import React from 'react';

function ItemsTable({ items }) {
  return (
    <table className="table table-striped table-bordered table-hover">
      <thead className="thead-dark">
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>
        {items &&
          items.map(item => {
            return (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.owner}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default ItemsTable;
```
- in `src/Items.js`:
  - **insert** `import ItemsTable from './ItemsTable';` at the _bottom_ of the `import` statements
  - **replace** `{results && JSON.stringify(results)}` with `<ItemsTable items={results} />`

Now the results are nicely formated in a table with Bootstrap styles.

## Add the inline search form

First we'll need to add an `onSearch()` callback that updates the router's location.

- in `src/Items.js`:
  - **insert** `, useHistory` after `useLocation`
  - **insert** `import AgoSearch from './AgoSearch';` at the _bottom_ of the `import` statements
  - **insert** the following above the `Items()` function
  ```jsx
  function buildPath(params) {
    let searchParams = new URLSearchParams(params);
    return `/items?${searchParams.toString()}`;
  }
  ```
  - **insert** the following _above_ the `useEffect()` function (within the `Items()` function):
  ```jsx
  const history = useHistory();

  function onSearch (newQ) {
    const path = buildPath({
      q: newQ,
      num
    });
    history.push(path);
  }
  ```
  - **replace** `{/* TODO: inline search form goes here */}` with `<AgoSearch onSearch={onSearch} />`
  - visit http://localhost:3000/items?q=test and start entering search terms

Submitting the form updates the results, but the form is too big for the space we've allocated. Also, the initial search term ('test') was not shown in the form. Let's add props to the form to make it more reusable.

- in `src/AgoSearch.js`:
  - **replace** `function AgoSearch({ onSearch }) {` with `function AgoSearch({ onSearch, q: initialQ = '', inline }) {`
  - **replace** `const [q, setQ] = useState("")` with:
  ```jsx
  const [q, setQ] = useState(initialQ);
  const inputGroupClass = `input-group input-group-${inline ? 'sm' : 'lg'}`;
  ```
  - **replace** `<div className="input-group input-group-lg">` with `<div className={inputGroupClass}>`

- in `src/Items.js`:
  - **replace** `<AgoSearch onSearch={onSearch} />` with `<AgoSearch onSearch={onSearch} q={q} inline />`

  - visit http://localhost:3000/items?q=test and start entering search terms

The search form is smaller and the initial search term ('test') was shown. However, we're only showing the first page of results. Let's add links that let users page through the results.

## Add a paging control

### Install a library with a paging component

[react-arcgis-hub](https://www.npmjs.com/package/react-arcgis-hub) has a paging component we can use.

- stop app (`ctrl+C`)
- run 'yarn add react-arcgis-hub`

###
- start app (`yarn start`)
- in `/src/Items.js`
  - **insert** `import { ItemPager } from 'react-arcgis-hub';` at the _bottom_ of the `import` statements
  - **insert** the following _above_ the `onSearch()` function (within the `Items()` function):
  ```jsx
  const pageNumber = (start - 1) / num + 1;

  function changePage (page) {
    const newStart = ((page - 1) * num) + 1;
    const path = buildPath({
      q,
      num,
      start: newStart
    });
    history.push(path);
  }
  ```
  - **insert** the following _below_ the `<ItemsTable>` component:
  ```jsx
  <ItemPager
    pageSize={num}
    totalCount={total}
    pageNumber={pageNumber}
    changePage={changePage}
  />
  ```
- visit the items route and initiate a search
- use the links at the bottom to page through the results.

#### Notes:
- `react-arcgis-hub` _just works_ because it shares the same [dependencies](https://www.npmjs.com/package/react-arcgis-hub#dependencies) as our application

## Run Tests

We modified the `<AgoSearch />` component, let's make sure its test still passes.

- stop app (`ctrl+C`)
- run the tests w/ `yarn test`
- you may need to type `a` to re-run the tests (read output in the terminal)
- stop tests (`ctrl+C`)

## Next steps

In [Workshop 5: Auth](./5-auth.md) we'll add the ability to sign in and make authenticated searches using [@esri/arcgis-rest-auth](https://esri.github.io/arcgis-rest-js/api/auth/).
