import React, { useState } from "react";

function Search({ onSearch }) {
  const [query, setQuery] = useState("");
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  return (
    <form
      className="d-flex justify-content-center mt-5"
      role="search"
      onSubmit={handleSubmit}
    >
      <input
        className="form-control me-3 px-4 py-3 w-50 shadow rounded-pill border-0"
        type="search"
        placeholder="Search Recipes..."
        name="query"
        onChange={handleInputChange}
      />
      <button className="btn shadow rounded-pill px-4 btn-dark" type="submit">
        Search
      </button>
    </form>
  );
}

export default Search;
