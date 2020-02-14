# Building an Application

## Scaffold the application

### Prerequisites

- node, npm, and yarn - already installed
- Git - already installed on mac, windows users can download https://git-scm.com/download/win

### Create React App
- open a terminal to the root folder where you keep your projects and enter:
```shell
npx create-react-app enterprise-arcgis-app
cd enterprise-arcgis-app
```

### Run the app
- in your terminal, enter
```shell
yarn start
```

- open a browser to http://localhost:3000/

### Add some markup and CSS
- open `src/index.css` and **replace** its contents with:

```css
/* bootstrap styles */
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css";

body {
  padding-top: 3.5rem;
}
```

- open `src/App.js` and **replace** its contents with:

```jsx
import React from 'react';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a className="navbar-brand" href="#">Enterprise ArcGIS App</a>
      </nav>
      <div className="container mt-5">
      </div>
    </>
  );
}

export default App;
```

After saving those files your browser should show a bootstrap navigation bar instead of the React logo.

#### Notes:
- [npx](https://www.npmjs.com/package/npx)
- application [component](https://reactjs.org/docs/components-and-props.html#function-and-class-components)
- JSX, [fragments](https://reactjs.org/docs/fragments.html)
- compiled css, js
