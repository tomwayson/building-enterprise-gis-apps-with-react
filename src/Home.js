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
