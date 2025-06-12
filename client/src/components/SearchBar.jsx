import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { FaSearch } from "react-icons/fa";
import { X } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");

  const token = localStorage.getItem('token');

  const fetchNotes = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchStatus("");
      return;
    }

    try {
      const res = await axios.get(`${BACKEND_URL}/notes/getFiles`, {
        params: { title: query },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.data.length > 0) {
        setSearchResults(res.data.data);
        setSearchStatus("Found");
      } else {
        setSearchResults([]);
        setSearchStatus("Not-Found");
      }
    } catch (error) {
      console.log("Error fetching notes: ", error);
    }
  };

  const debouncedFetchNotes = useMemo(() => debounce(fetchNotes, 300), []);

  useEffect(() => {
    debouncedFetchNotes(searchQuery);
  }, [searchQuery]);

  const showPDF = (files) => {
    window.open(`${BACKEND_URL}/files/${files}`, "_blank", "noreferrer");
  };

  const onClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchStatus("");
  };

  return (
    <div className='flex h-heightWithoutNavbar flex-col items-center justify-start p-4 bg-white'>
      {/* Search Bar */}
      <div className='flex w-full items-center justify-center'>
        <form
          className='relative w-full max-w-[700px] rounded-xl border border-black bg-[#374151] p-6'
          onSubmit={(e) => e.preventDefault()} 
        >
          <div className='flex items-center justify-between relative'>
            <FaSearch className='text-2xl text-white' />
            <input
              type='text'
              placeholder='Search for Notes'
              className='ml-3 w-full bg-[#374151] text-white border-none focus:outline-none pr-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={onClearSearch}
              />
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {searchStatus === "Found" && searchResults.length > 0 ? (
        <div className='mt-5 w-full grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {searchResults.map((notes) => (
            <div
              key={notes._id}
              className='flex w-full max-w-[300px] items-center justify-between rounded-xl bg-[#374151] px-3 py-2 text-white shadow-lg'
            >
              <p className='mt-2 text-sm'>
                <span className='font-bold'>File name: </span>
                <span>{notes.fileName}</span>
              </p>
              <button onClick={() => showPDF(notes.file)}>Show PDF</button>
            </div>
          ))}
        </div>
      ) : searchStatus === "Not-Found" ? (
        <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center transition-opacity duration-300 ease-in-out opacity-100">
          <div className="text-6xl text-gray-400">
            <FaSearch />
          </div>
          <p className="mt-4 text-xl font-semibold text-gray-600">No Notes Found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try checking your spelling or search with a different title.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
