import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Book } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddEditNotes from "../pages/AddEditNotes";
import NoteCard from "../pages/NoteCard";
import EmptyCard from "./EmptyCard/EmptyCard";
import AddNotesImg from "../images/addnote.jpg";
import NotesSearch from "./NotesSearch";
import ReadingMode from "../pages/ReadingMode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NoteCardRender = () => {
  const [showAddEditNote, setShowAddEditNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReadingModeOpen, setIsReadingModeOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const openReadingMode = (note) => {
    setCurrentNote(note);
    setIsReadingModeOpen(true);
  };

  const speakOut = () => {
    if (currentNote?.content) {
      speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(currentNote.content);
      speechSynthesis.speak(speech);
      setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    getAllNotes();
  }, [getAllNotes]);

  if (showAddEditNote) {
    return (
      <div className="container mx-auto">
        <AddEditNotes
          noteData={selectedNote}
          type={selectedNote ? "edit" : "add"}
          onClose={() => {
            setShowAddEditNote(false);
            setSelectedNote(null);
          }}
          showMessage={(msg) => toast.success(msg)}
          getAllNotes={getAllNotes}
        />
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto max-w-6xl py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold font-serif">Browse Notes</h1>
        <button
          onClick={() => {
            setSelectedNote(null);
            setShowAddEditNote(true);
          }}
          className="inline-flex items-center bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
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
                onEdit={() => {
                  setSelectedNote(item);
                  setShowAddEditNote(true);
                }}
                onDelete={() => deleteNote(item._id)}
                onClick={openReadingMode}
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

      {isReadingModeOpen && currentNote && (
        <ReadingMode
          title={currentNote.title}
          content={currentNote.content}
          onClose={() => {
            setIsReadingModeOpen(false);
            stopSpeaking();
          }}
          isSpeaking={isSpeaking}
          speakOut={speakOut}
          stopSpeaking={stopSpeaking}
        />
      )}
    </div>
  );
};

export default NoteCardRender;
