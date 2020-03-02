# Data

## Prerequisites

Complete [Workshop 3: Routing](./3-routing.md)

## Search items with [@esri/arcgis-rest-portal](https://esri.github.io/arcgis-rest-js/api/portal/)

### Install @esri/arcgis-rest-portal and dependencies

- `npm install --save @esri/arcgis-rest-portal @esri/arcgis-rest-auth@^2.0.0  @esri/arcgis-rest-request@^2.0.0`
- start app (`npm start`)

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
- run 'npm install --save react-arcgis-hub`

### Add the paging component below the table
- start app (`npm start`)
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

## Tests

## Fix the smoke test

We modified what the items route renders, so our test will fail until we modify what it expects.

- stop app (`ctrl+C`)
- run the tests w/ `npm test`
- you may need to type `a` to re-run all tests (read output in the terminal)
- the `App` test fails
- in `src/App.test.js`:
  - **replace** `const result = await findByText(/{"q":"test","start":1,"num":10}/);` with `const result = await findByText(/Your search for "test" yielded 10000 items/);`

The test now passes, but because the items route now fetches the data, this test can be slow and unreliable. In order to fix this, we can mock the server response.

- in `src/App.test.js`:
  - **insert** the following _below_ the other `import` statements:
  ```js
  import { searchItems } from '@esri/arcgis-rest-portal';

  jest.mock('@esri/arcgis-rest-portal');

  const searchResponse = {
    "query":"test",
    "total":10000,
    "start":1,
    "num":10,
    "nextStart":11,
    "results": [{
      "id": "27467c140c9b4aea90b9b327a22f1675",
      "owner": "EsriMedia",
      "created": 1389830710000,
      "modified": 1389917598000,
      "type": "Web Map",
      "title": "Beer Spending"
    }, {
      "id": "927b9b1acbed4e9592c79a2d876c6c5c",
      "owner": "EsriMedia",
      "created": 1391208130000,
      "modified": 1391226848000,
      "type": "Map Service",
      "title": "Super_Bowl_Beer"
    }, {
      "id": "07a5810edbb847858e82b7c0fd1623a7",
      "owner": "3918",
      "created": 1378993854000,
      "modified": 1408632978000,
      "type": "Feature Service",
      "title": "Brewers_of_Ohio"
    }, {
      "id": "d710e7f6304e4bfabdd325acaea67687",
      "owner": "Paul2573",
      "created": 1317183218000,
      "modified": 1340642545000,
      "type": "Web Map",
      "title": "Great American Beer Festival Exhibitors & Regions"
    }, {
      "id": "de56d53d741440158c8a2ab053c6474c",
      "owner": "EsriMedia",
      "created": 1391208131000,
      "modified": 1391226131000,
      "type": "Feature Service",
      "title": "Super_Bowl_Beer"
    }, {
      "id": "4c1d7d082b53404cafa9183ecc6c4520",
      "owner": "EsriMedia",
      "created": 1474903833000,
      "modified": 1479133217000,
      "type": "Web Mapping Application",
      "title": "Tampa Bay Beer Drinking Habits"
    }, {
      "id": "9ffb804c63184c73892080f171e40c69",
      "owner": "complot",
      "created": 1459695423000,
      "modified": 1488111152000,
      "type": "Web Map",
      "title": "beer_sheva2"
    }, {
      "id": "9a2e589d0db441429d23c10b7b26982d",
      "owner": "dclancy4",
      "created": 1360687160000,
      "modified": 1360705495000,
      "type": "Web Mapping Application",
      "title": "NJ Breweries & Beer Events"
    }, {
      "id": "1dec28199f19404c8c551155736e05e0",
      "owner": "vladivoj",
      "created": 1376945919000,
      "modified": 1377038441000,
      "type": "Web Map",
      "title": "My beer map"
    }, {
      "id": "7c54f5a614e9441092930b0beca5eef6",
      "owner": "joethebeekeeper",
      "created": 1372739018000,
      "modified": 1405720465000,
      "type": "Web Map",
      "title": "Redding Beer Week"
    }]
  };
  ```
  - **insert** `searchItems.mockResolvedValueOnce(searchResponse);` at _the top_ of the test
- the tests should re-run and pass once you save the files
- stop tests (`ctrl+C`)

Now our smoke test should run quickly and reliably. We're no longer testing `@esri/arcgis-rest-portal` nor any of it's dependencies, but that's a good thing.

## Next steps

In [Workshop 5: Auth](./5-auth.md) we'll add the ability to sign in and make authenticated searches using [@esri/arcgis-rest-auth](https://esri.github.io/arcgis-rest-js/api/auth/).
