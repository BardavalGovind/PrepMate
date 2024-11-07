import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TTSSTTControls from './TTSS';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await axios.get('/api/notes');
      setNotes(response.data);
    };
    fetchNotes();
  }, []);

  const addNote = async () => {
    const response = await axios.post('/api/notes', { content: newNote });
    setNotes([...notes, response.data]);
    setNewNote("");
  };

  return (
    <div>
      <TTSSTTControls text={newNote} setText={setNewNote} />
      <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map(note => <li key={note._id}>{note.content}</li>)}
      </ul>
    </div>
  );
};

export default Notes;
