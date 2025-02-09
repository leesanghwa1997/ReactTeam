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
  const [selectedArtist, setSelectedArtist] = useState(() =>
    sessionStorage.getItem('selectedArtist')
      ? JSON.parse(sessionStorage.getItem('selectedArtist'))
      : null,
  ); 
  const [selectedMyPlayList, setSelectedMyPlayList] = useState(() =>
    sessionStorage.getItem('selectedMyPlayList')
      ? JSON.parse(sessionStorage.getItem('selectedMyPlayList'))
      : null,
  ); 

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

  useEffect(() => {
    if (selectedArtist) {
      sessionStorage.setItem('selectedArtist', JSON.stringify(selectedArtist));
    }
  }, [selectedArtist]);

  useEffect(() => {
    if (selectedMyPlayList) {
      sessionStorage.setItem('selectedMyPlayList', JSON.stringify(selectedMyPlayList));
    }
  }, [selectedMyPlayList]);

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        selectedAlbum,
        setSelectedAlbum,
        selectedArtist,
        setSelectedArtist,
        selectedMyPlayList,
        setSelectedMyPlayList,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
