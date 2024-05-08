import React, { useState } from "react";

const Search = ({ keyword, setKeyword, setPage, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleClickButton();
    }
  };
  const handleClickButton = () => {
    setKeyword(searchTerm.trim());
    setPage(1);
  };
  return (
    <div className="input-group " style={{ width: 300 }}>
      <input
        value={searchTerm}
        type="text"
        name="table_search"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control float-right"
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
      />
      <div className="input-group-append">
        <button
          onClick={handleClickButton}
          type="submit"
          className="btn  btn-secondary   "
        >
          <i className="fas fa-search" />
        </button>
      </div>
    </div>
  );
};

export default Search;
