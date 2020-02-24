import React, { useState } from 'react';

function AgoSearch({ onSearch }) {
  const [q, setQ] = useState("");
  function onChange(e) {
    // hold onto a copy of the search term
    setQ(e.target.value);
  }
  function onSubmit(e) {
    // don't actually submit the form
    e.preventDefault();
    // call search function that was passed in as a prop
    onSearch && onSearch(q);
  }
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <div className="input-group input-group-lg">
        <input
          className="form-control"
          placeholder="search for items"
          value={q}
          onChange={onChange}
        />
        <div className="input-group-append">
          <button className="btn btn-secondary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default AgoSearch;
