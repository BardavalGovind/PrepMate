import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UploadNote = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;

  const submitFile = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User is not logged in.");
      toast.error("User is not logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      setLoading(true); 
      const token = localStorage.getItem("token");
      await axios.post(`${BACKEND_URL}/notes/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Notes Uploaded Successfully!");
      setTitle("");
      setDescription("");
      setTags("");
      setFile(null);
      setError("");
    } catch (error) {
      toast.error("Failed to upload notes.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 to-blue-400 p-4">
      <form
        className="w-full max-w-lg bg-white rounded-lg p-6 md:border md:border-gray-300 shadow-lg"
        onSubmit={submitFile}
      >
        <h1 className="mb-4 text-xl font-bold text-center">Upload Your Notes</h1>

        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-3 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full mb-3 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Tags"
          required
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="block w-full mb-3 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />

        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-40 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-center p-3"
        >
          <svg
            className="h-8 w-8 text-gray-500 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="text-sm text-gray-500 font-semibold">
            Click to Upload or Drag & Drop
          </p>
          <p className="text-xs text-gray-500">Only PDF files are allowed</p>
          <input
            type="file"
            accept="application/pdf"
            required
            id="dropzone-file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        {/* Loader or Submit Button */}
        {loading ? (
          <button
            disabled
            className="mt-4 w-full rounded-lg bg-gray-500 py-2 font-bold text-white cursor-not-allowed"
          >
            Uploading...
          </button>
        ) : (
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-blue-500 py-2 font-bold text-white hover:bg-blue-600 transition"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default UploadNote;
