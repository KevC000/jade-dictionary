import React from "react";

import { SearchHoverCard } from "../hover-cards/SearchHoverCard";
import { SearchInput } from "../search-input/SearchInput";
import { handleKeyPress } from "@/src/lib/utils/events";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
};

const HomeSearchBar = ({ query, setQuery, onSearch }: Props) => {
  const onKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onSearch();
    });
  };

  return (
    <div className="flex-1 max-w-[20rem] w-full bg-transparent border-none">
      <SearchHoverCard
        searchBar={
          <div className="flex w-full max-w-md mx-auto">
            <SearchInput
              query={query}
              setQuery={setQuery}
              handleSearch={onSearch}
              handleKeyPress={onKeyPressSearch}
            />
          </div>
        }
      />
    </div>
  );
};

export default HomeSearchBar;
