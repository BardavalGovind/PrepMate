import axios from 'axios';
import React, {useState} from 'react';
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const SearchBar = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");

  const user = useSelector((state)=> state.user.userData);
  const token = localStorage.getItem('token');

  const handleSearch = async (e)=>{
    e.preventDefault();

    try{
      const notes = await axios.get(`${BACKEND_URL}/notes/getFiles`, {
        params: {
          title: searchQuery,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if(notes.data.data.length > 0){
        setSearchResults(notes.data.data);
        setSearchStatus("Found");
      }
      else{
        setSearchResults([]);
        setSearchStatus("Not-Found");
      }
    }
    catch(error){
      console.log("Error fetching notes: ", error);
    }
  }

  const showPDF = async (files)=> {
    window.open(`${BACKEND_URL}/files/${files}`, "_blank", "noreferrer");
  };

  return (
    <div className='flex h-heightWithoutNavbar
    flex-col items-center justify-start p-4'>
      <div className='flex w-full items-center justify-center'>
        <form className='w-full rounded-xl border border-black 
        max-w-[700px] bg-[#374151] p-4' onSubmit={handleSearch}>
            <div className='flex items-center justify-between'>
                {/* search logo */}
                <FaSearch className='text-2xl text-white'/>
                {/* input */}
                
                <input 
                  type='search' 
                  placeholder='Search for Notes' 
                  className='w-full ml-3 bg-[#374151] text-white' 
                  value={searchQuery}
                  onChange={(e)=> setSearchQuery(e.target.value)}
                />
                <button type='submit'
                 className='bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4
                 py-2 text-sm font-medium text-white hover:bg-blue-800
                 focus:outline-none focus:ring-4 focus:ring-blue-300
                 dark:bg-blue-600 dark:hover:bg-blue-700
                 dark:focus:ring-blue-800'>
                    Search</button>
            </div>
        </form>
      </div>
      {/* documents */}
      <div className='mt-5
       w-full grid grid-cols-1 gap-5 border
       sm:grid-cols-2 lg:grid-cols-4'>

        {searchStatus === "Found" && searchResults.length > 0 && searchResults.map((notes)=>(
          <div
            key={notes._id}
            className='flex w-full max-w-[300px] flex-wrap-reverse items-center justify-between
            rounded-xl bg-[#374151] px-3 py-2 text-white shadow-lg'
          >
            <p className='mt-2 text-sm'>
              <span className='font-bold'>File name: </span>
              <span>{notes.fileName}</span>
            </p>

            <button onClick={() => showPDF(notes.files)}>Show PDF</button>
          </div>
        ))}

        {searchStatus === "Not-Found" && (
          <div className='mt-4 text-center text-gray-600 dark:text-gray-400'>
            No Notes Found
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchBar;