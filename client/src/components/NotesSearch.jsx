import React, { useState } from "react";

const NotesSearch = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        onSearch(searchQuery);
    };
    const onClearSearch = () => {
        setSearchQuery("");
        onSearch("");
    }

    return (
        <div className="search-bar flex justify-center items-center mt-5 mb-5">
            <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={handleSearch}
            >
                Search
            </button>

            {/* Clear Search Button */}
                <button
                    className="ml-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                    onClick={onClearSearch}
                >
                    Clear
                </button>
            {/* )} */}
        </div>
    );
};

export default NotesSearch;
