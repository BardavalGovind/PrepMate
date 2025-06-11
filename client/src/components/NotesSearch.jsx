import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const NotesSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useMemo(() => debounce(onSearch, 300), [onSearch]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    debouncedSearch("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search notes by title or description"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {searchQuery && (
        <X
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
          onClick={onClearSearch}
        />
      )}
    </div>
  );
};

export default NotesSearch;
