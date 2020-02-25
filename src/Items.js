import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { searchItems } from '@esri/arcgis-rest-portal';
import ItemsTable from './ItemsTable';
import AgoSearch from './AgoSearch';
import { ItemPager } from 'react-arcgis-hub';

// parse query string for search params or provide default values
function parseSearch (search) {
  const params = new URLSearchParams(search);
  const q = params.get('q') || '';
  const start = parseInt(params.get('start')) || 1;
  const num = parseInt(params.get('num')) || 10;
  return { q, start, num };
}

const defaultResponse = {
  results: [],
  total: 0
};

function buildPath(params) {
  let searchParams = new URLSearchParams(params);
  return `/items?${searchParams.toString()}`;
}

function Items() {
  const { search } = useLocation();
  const { q, start, num } = parseSearch(search);
  const [response, setResponse] = useState(defaultResponse);
  const { results, total } = response;
  const history = useHistory();
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

  function onSearch (newQ) {
    const path = buildPath({
      q: newQ,
      num
    });
    history.push(path);
  }

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

  return <>
    <div className="row mb-2">
      <div className="col-9">
        <h2>
          Your search for &quot;{q}&quot; yielded {total} items
        </h2>
      </div>
      <div className="col-3">
        <AgoSearch onSearch={onSearch} q={q} inline />
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        <ItemsTable items={results} />
        <ItemPager 
          pageSize={num}
          totalCount={total}
          pageNumber={pageNumber}
          changePage={changePage}
        />
      </div>
    </div>
  </>;
}

export default Items;
