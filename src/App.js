import React from 'react';
import { title } from './config/app';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a className="navbar-brand" href="#">{ title }</a>
      </nav>
    </>
  );
}

export default App;
