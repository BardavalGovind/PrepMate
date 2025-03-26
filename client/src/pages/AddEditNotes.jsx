import React, { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { FaStickyNote } from "react-icons/fa";
import { useSelector } from "react-redux";
import TagInput from "../components/TagInput";
import SpeechToText from "./VoiceNote";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddEditNotes = ({ noteData, type, onClose, showMessage, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;
  const token = localStorage.getItem("token");

  const handleApiRequest = async (apiCall, successMessage) => {
    if (!title.trim()) return setError("Please enter the title");
    if (!content.trim()) return setError("Please enter the content");

    setError(null);
    try {
      const response = await apiCall();
      if (response?.data?.note) {
        showMessage(successMessage);
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  const addNewNote = () =>
    handleApiRequest(
      () =>
        axios.post(
          `${BACKEND_URL}/notes/add-note`,
          { title, content, tags, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      "Note Added Successfully"
    );

  const editNote = () =>
    handleApiRequest(
      () =>
        axios.put(
          `${BACKEND_URL}/notes/edit-note/${noteData._id}`,
          { title, content, tags, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      "Note Updated Successfully"
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 md:px-8">
      <div className="relative w-full max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-gradient-to-r from-orange-200 to-blue-200 p-6 sm:p-8 rounded-2xl shadow-xl border-2">
        {/* Close Button */}
        <button
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center absolute -top-5 -right-5 sm:-top-6 sm:-right-6 bg-white shadow-md hover:bg-red-500 hover:text-white transition-all duration-300"
          onClick={onClose}
        >
          <MdClose className="text-lg sm:text-2xl" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <FaStickyNote className="text-2xl sm:text-3xl text-yellow-500" />
          <h2 className="text-gray-800 text-lg sm:text-2xl font-bold text-center font-handwritten">
            {type === "edit" ? "Edit Your Note" : "Create a New Note"}
          </h2>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <input
            type="text"
            className="text-sm sm:text-lg p-3 sm:p-4 border rounded-xl focus:outline-none bg-white text-black w-full"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="text-sm sm:text-lg p-3 sm:p-4 border rounded-xl focus:outline-none bg-white text-black w-full"
            placeholder="Note Content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ resize: "vertical" }}
          />

          <TagInput tags={tags} setTags={setTags} />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-3 sm:mt-4">{error}</p>}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-6">
          <button
            className="w-full sm:w-auto py-2 px-4 sm:py-3 sm:px-6 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300"
            onClick={type === "edit" ? editNote : addNewNote}
          >
            {type === "edit" ? "Update Note" : "Add Note"}
          </button>

          <SpeechToText setContent={setContent} />
        </div>
      </div>
    </div>
  );
};

export default AddEditNotes;
