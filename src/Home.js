import React from 'react';
import './Home.css';
import { title } from './config/app';
import AgoSearch from './AgoSearch';
import { useHistory } from 'react-router-dom';

function Home() {
  const history = useHistory();
  function onSearch (q) {
    history.push(`/items?q=${q}`);
  }
  return (
    <div className="jumbotron">
      <h1 className="display-3 text-light text-center mb-5">{title}</h1>
      <AgoSearch onSearch={onSearch} />
    </div>
  );
}

export default Home;
