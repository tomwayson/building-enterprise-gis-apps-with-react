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

TODO

## Add a paging control

TODO

## Add the search form

TODO

## Tests???

TODO

## Next steps

In [Workshop 5: Auth](./5-auth.md) we'll add the ability to sign in and make authenticated searches using [@esri/arcgis-rest-auth](https://esri.github.io/arcgis-rest-js/api/auth/).
