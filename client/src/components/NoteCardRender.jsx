import React, { useState, useEffect } from 'react';
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

  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;
  const token = localStorage.getItem('token'); 

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const closeModal = () => {
    setOpenAddEditModal({ ...openAddEditModal, isShown: false });
  };

  const showMessage = (message, type) => {
    setShowMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseMsg = () => {
    setShowMsg((prev) => ({
      ...prev,
      isShown: false,
    }));
  };

  const getAllNotes = async () => {
    try { 
      if (!userId) {
        console.log("User not logged in or userId is missing");
        return; 
      }
      const response = await axios.get(
        "http://localhost:5000/notes/get-all-notes",
        {
           params: { userId },
           headers: {
            Authorization: `Bearer ${token}`,
           },
        }
    );

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)));
      }
    } catch (error) {
      console.log("Error occurred while fetching notes:", error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/notes/delete-note/${noteId}`,
        {
          data: { userId }, 
          headers: {
            Authorization: `Bearer ${token}`,
          },
       }
      );

      if (response.data && !response.data.error) {
        setAllNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        showMessage("Note Deleted Successfully", "delete");
      }
    } catch (error) {
      console.log("Error occurred while deleting the note:", error);
    }
  };

  // Search Notes based on query
  const onSearchNote = async (query) => {
    if (!query) {
      setIsSearch(false);
      await getAllNotes(); 
    } else {
      try {
        const response = await axios.get(
          "https://prepmate-nb0h.onrender.com/notes/search-notes", 
          {
            params: { query, userId },
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
      );
      if(response.data && response.data.notes) {
          setIsSearch(true);
          setAllNotes(response.data.notes);
        }
      } catch (error) {
        console.log("Error occurred during search:", error);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getAllNotes(); 
    }
  }, [userId]);

  return (
    <>
      <div className="container mx-auto">
        {/* Search Bar */}
        <NotesSearch onSearch={onSearchNote} />

        {allNotes?.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8 mx-auto w-fit">
            {allNotes?.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                onEdit={() => handleEdit(item)}  
                onDelete={() => deleteNote(item._id)} 
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={AddNotesImg}
            message={`Start creating your first note! Click on the bottom right button to prepare notes. Let's get started!`}
          />
        )}
      </div>

      {/* Fixed Add Note Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 fixed right-10 bottom-10 z-50"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal}
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
          onClose={closeModal}
          showMessage={showMessage}
          getAllNotes={getAllNotes}
        />
      </Modal>

      <Message
        isShown={showMsg.isShown}
        message={showMsg.message}
        type={showMsg.type}
        onClose={handleCloseMsg}
      />
    </>
  );
};

export default NoteCardRender;

