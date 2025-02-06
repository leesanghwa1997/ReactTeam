import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null); // 선택한 앨범 상태 추가

    return (
        <SearchContext.Provider value={{ searchResults, setSearchResults, selectedAlbum, setSelectedAlbum }}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;
