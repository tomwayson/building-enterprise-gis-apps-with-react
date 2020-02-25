import React from 'react';
import { useLocation } from 'react-router-dom';

// parse query string for search params or provide default values
function parseSearch (search) {
  const params = new URLSearchParams(search);
  const q = params.get('q') || '';
  const start = parseInt(params.get('start')) || 1;
  const num = parseInt(params.get('num')) || 10;
  return { q, start, num };
}

function Items() {
  const { search } = useLocation();
  const { q, start, num } = parseSearch(search);
  return <p>{JSON.stringify({ q, start, num })}</p>;
}

export default Items;
