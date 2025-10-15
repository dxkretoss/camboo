import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchItems, setsearchItems] = useState("");

  return (
    <SearchContext.Provider value={{ searchItems, setsearchItems }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
