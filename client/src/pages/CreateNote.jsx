import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SpeechToText from "./VoiceNote";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Please enter the title");
    if (!content.trim()) return setError("Please enter the content");
    const plainText = content.replace(/<[^>]*>/g, '');

    setError(null);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/notes/add-note`,
        { title, content: plainText, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.note) {
        toast.success("Note added successfully");
        navigate("/notes");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        
        {/* ✅ Back button inside visible block */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded inline-block"
          >
            ← Back
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2 text-gray-900">Create a New Note</h1>
          <p className="text-gray-600">Start a note and capture your thoughts clearly.</p>
        </div>

        <form onSubmit={handleAddNote} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Note Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter a captivating title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Note Content
            </label>
            <RichTextEditor
              id="content"
              value={content}
              onChange={setContent}
              placeholder="Write the content of your note here..."
              className="min-h-[250px]"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6 w-full">
            <div className="w-full sm:w-1/2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Add Note
              </button>
            </div>
            <div className="w-full sm:w-1/2">
              <SpeechToText setContent={setContent} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
