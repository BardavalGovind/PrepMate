import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UploadNote = () => {
  const [title, setTitle] = useState("");
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

      toast.success(`${title} uploaded successfully!`);
      setTitle("");
      setFile(null);
      setError("");
    } catch (error) {
      toast.error("Failed to upload notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <form
        onSubmit={submitFile}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-blue-500 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Upload Your Notes</h1>
          <p className="text-orange-100 mt-2">Share your knowledge with others</p>
        </div>

        <div className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg p-3 border border-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />

          <div>
            <label
              htmlFor="dropzone-file"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 text-center p-4"
            >
              <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400">Only PDF files are allowed</p>
              <input
                id="dropzone-file"
                type="file"
                accept="application/pdf"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadNote;
