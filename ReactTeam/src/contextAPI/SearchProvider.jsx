import React, { createContext, useEffect, useState } from 'react';

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState(() =>
    sessionStorage.getItem('searchResults')
      ? JSON.parse(sessionStorage.getItem('searchResults'))
      : [],
  );
  const [selectedAlbum, setSelectedAlbum] = useState(() =>
    sessionStorage.getItem('selectedAlbum')
      ? JSON.parse(sessionStorage.getItem('selectedAlbum'))
      : null,
  ); // 선택한 앨범 상태 추가

  useEffect(() => {
    if (searchResults) {
      sessionStorage.setItem('searchResults', JSON.stringify(searchResults));
    }
  }, [searchResults]);

  useEffect(() => {
    if (selectedAlbum) {
      sessionStorage.setItem('selectedAlbum', JSON.stringify(selectedAlbum));
    }
  }, [selectedAlbum]);

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        selectedAlbum,
        setSelectedAlbum,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
