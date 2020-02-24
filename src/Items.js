import React from 'react';
import { useLocation } from 'react-router-dom';

function Items() {
  const { search } = useLocation();
  return <p>{search}</p>;
}

export default Items;
