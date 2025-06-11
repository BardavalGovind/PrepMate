import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SpeechToText from "./VoiceNote";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddEditNotes = ({ noteData = {}, type, onClose, showMessage, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Please enter the title");
    if (!content.trim()) return setError("Please enter the content");
    setError(null);

    const plainText = content.replace(/<[^>]*>/g, "");

    try {
      const url =
        type === "edit"
          ? `${BACKEND_URL}/notes/edit-note/${noteData._id}`
          : `${BACKEND_URL}/notes/add-note`;

      const method = type === "edit" ? "put" : "post";

      const { data } = await axios[method](
        url,
        { title, content: plainText, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.note) {
        type === "edit"
          ? showMessage?.("Note Updated Successfully")
          : toast.success("Note added successfully");

        getAllNotes?.();
        onClose?.() || navigate("/notecardrender");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md border border-gray-200 p-8 relative">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2 text-gray-900">
            {type === "edit" ? "Edit Note" : "Create a New Note"}
          </h1>
          <p className="text-gray-600">
            {type === "edit"
              ? "Modify your note content or title."
              : "Start a note and capture your thoughts clearly."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Note Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter a captivating title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              type="submit"
              className="w-full sm:w-1/2 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              {type === "edit" ? "Update Note" : "Add Note"}
            </button>

            <div className="w-full sm:w-1/2">
              <SpeechToText setContent={setContent} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditNotes;
