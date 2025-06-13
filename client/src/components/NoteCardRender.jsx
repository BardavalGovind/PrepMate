import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import NoteCard from "../pages/NoteCard";
import EmptyCard from "./EmptyCard/EmptyCard";
import AddNotesImg from "../images/addnote.jpg";
import NotesSearch from "./NotesSearch";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NoteCardRender = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;
  const token = localStorage.getItem("token");

  const getAllNotes = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/notes/get-all-notes`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.notes) {
        const sortedNotes = response.data.notes.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );
        setAllNotes(sortedNotes);
        setFilteredNotes(sortedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [userId, token]);

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${BACKEND_URL}/notes/delete-note/${noteId}`, {
        data: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllNotes((prev) => prev.filter((note) => note._id !== noteId));
      setFilteredNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success("Note Deleted Successfully");
    } catch (error) {
      console.error("Error deleting the note:", error);
    }
  };

  const onSearchNote = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredNotes(allNotes);
    } else {
      const filtered = allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, [getAllNotes]);

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold font-serif">Browse Notes</h1>
        <button
          onClick={() => navigate("/notes/addnew")}
          className="inline-flex items-center bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-2 rounded transition"
        >
          <Book className="mr-2 h-4 w-4" />
          Start a New Note
        </button>
      </div>

      <div className="mb-8 w-full">
        <NotesSearch onSearch={onSearchNote} />
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredNotes.slice(0, 20).map((item) => (
            <div key={item._id} className="group">
              <NoteCard
                id={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                onEdit={() => navigate(`/notes/edit/${item._id}`)}
                onDelete={() => deleteNote(item._id)}
                onClick={() => navigate(`/notes/read/${item._id}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2">
          <EmptyCard
            imgSrc={AddNotesImg}
            message="Start creating your first note! Click on the (Start a New Note) button to prepare notes. Let's get started!"
            title="No Notes Yet!"
            subtitle="Try adding some notes to get started."
          />
        </div>
      )}
    </div>
  );
};

export default NoteCardRender;
