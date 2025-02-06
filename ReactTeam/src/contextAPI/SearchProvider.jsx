import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <SearchContext.Provider value={{ searchResults, setSearchResults }}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;
