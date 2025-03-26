import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MdAdd } from 'react-icons/md';
import { useSelector } from 'react-redux';
import AddEditNotes from "../pages/AddEditNotes";
import NoteCard from "../pages/NoteCard";
import Modal from "react-modal";
import EmptyCard from "./EmptyCard/EmptyCard";
import AddNotesImg from "../images/addnote.jpg";
import NotesSearch from "./NotesSearch";
import Message from './FeedbackMessage/Message';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
Modal.setAppElement("#root");

const NoteCardRender = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showMsg, setShowMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;
  const token = localStorage.getItem('token');

  // Fetch notes from API
  const getAllNotes = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/notes/get-all-notes`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.notes) {
        const sortedNotes = response.data.notes.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        setAllNotes(sortedNotes);
        setFilteredNotes(sortedNotes); 
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [userId, token]);

  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${BACKEND_URL}/notes/delete-note/${noteId}`, {
        data: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      setFilteredNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      showMessage("Note Deleted Successfully", "delete");
    } catch (error) {
      console.error("Error deleting the note:", error);
    }
  };

  // // Search Notes Locally
  const onSearchNote = (query) => {
    setSearchQuery(query);
    if (!query) {
      setIsSearch(false);
      setFilteredNotes(allNotes); 
    } else {
      setIsSearch(true);
      const filtered = allNotes.filter((note) =>
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
    <>
      <div className="container mx-auto">
        {/* Search Bar */}
        <NotesSearch onSearch={onSearchNote} />
        {filteredNotes?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mt-8 mx-auto w-fit">
          {filteredNotes.slice(0, 20).map((item) => (
            <div className="flex justify-center">
              <div className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] md:w-[300px] md:h-[300px] lg:w-[320px] lg:h-[320px]  mb-8">
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  onEdit={() => setOpenAddEditModal({ isShown: true, data: item, type: "edit" })}
                  onDelete={() => deleteNote(item._id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyCard
          imgSrc={AddNotesImg}
          message="Start creating your first note! Click on the bottom right button to prepare notes. Let's get started!"
        />
      )}
      </div>

      {/* Fixed Add Note Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 fixed right-10 bottom-10 z-50"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease-in-out' }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* Modal for Adding/Editing Notes */}
      {openAddEditModal.isShown && (
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => setOpenAddEditModal({ ...openAddEditModal, isShown: false })}
          className="w-full h-auto max-h-[80vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-y-auto"
          style={{
            content: {
              maxWidth: "100vw",
              maxHeight: "90vh",
              overflow: "hidden",
              borderRadius: "16px",
            },
          }}
        >
          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => setOpenAddEditModal({ ...openAddEditModal, isShown: false })}
            showMessage={(message, type) => setShowMsg({ isShown: true, message, type })}
            getAllNotes={getAllNotes}
          />
        </Modal>
      )}

      {/* Feedback Message */}
      {showMsg.isShown && (
        <Message
          isShown={showMsg.isShown}
          message={showMsg.message}
          type={showMsg.type}
          onClose={() => setShowMsg({ ...showMsg, isShown: false })}
        />
      )}
    </>
  );
};

export default NoteCardRender;
