import React, { useState } from 'react';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import TagInput from '../components/TagInput';

const AddEditNotes = ({ noteData, type, onClose, showMessage, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;

  console.log("User ID in AddEditNotes:", userId);

  // Add note
  const addNewNote = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/notes/add-note",
        { title, content, tags, userId }
      );

      if (response.data && response.data.note) {
        setError(null);
        showMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit note
  const editNote = async () => {
    try {
      const noteId = noteData._id;

      const response = await axios.put(
        `http://localhost:5000/notes/edit-note/${noteId}`,
        { title, content, tags, userId }
      );

      if (response.data && response.data.note) {
        setError(null);
        showMessage("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Handle add or edit
  const handleAddOrEditNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className='relative'>
      <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500'
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go To Gym At 5'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className='flex flex-col mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          type="text"
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      <button
        className='bg-blue-500 font-medium mt-5 p-3 my-1 w-full rounded text-sm text-white'
        onClick={handleAddOrEditNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;








// import React, { useState } from 'react';
// import axios from 'axios';
// import { MdClose } from 'react-icons/md';
// import { useSelector } from 'react-redux';
// import TagInput from '../components/TagInput';

// const AddEditNotes = ({ onClose, showMessage, getAllNotes }) => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState([]);
//   const [error, setError] = useState(null);

//   const user = useSelector((state) => state.user.userData);
//   const userId = user?._id;

//   console.log("user id in addNotefn: ", userId);


//   // Add note
//   const addNewNote = async () => {
//     try {
    
//       const response = await axios.post(
//         "http://localhost:5000/notes/add-note",
//         { title, content, tags, userId },
        
//       );

//       if (response.data && response.data.note) {
//         setError(null);
//         showMessage("Note Added Successfully");
//         getAllNotes();
//         onClose();
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.message) {
//         setError(error.response.data.message);
//       }
//     }
//   };

//   const handleAddNote = () => {
//     if (!title) {
//       setError("Please enter the title");
//       return;
//     }

//     if (!content) {
//       setError("Please enter the content");
//       return;
//     }

//     setError("");
//     addNewNote();
//   };

//   return (
//     <div className='relative'>
//       <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500' onClick={onClose}>
//         <MdClose className="text-xl text-slate-400" />
//       </button>

//       <div className='flex flex-col gap-2'>
//         <label className='input-label'>TITLE</label>
//         <input
//           type="text"
//           className='text-2xl text-slate-950 outline-none'
//           placeholder='Go To Gym At 5'
//           value={title}
//           onChange={({ target }) => setTitle(target.value)}
//         />
//       </div>

//       <div className='flex flex-col mt-4'>
//         <label className='input-label'>CONTENT</label>
//         <textarea
//           type="text"
//           className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
//           placeholder='Content'
//           rows={10}
//           value={content}
//           onChange={({ target }) => setContent(target.value)}
//         ></textarea>
//       </div>

//       <div className='mt-3'>
//         <label className='input-label'>TAGS</label>
//         <TagInput tags={tags} setTags={setTags} />
//       </div>

//       {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

//       <button
//         className='bg-blue-500 font-medium mt-5 p-3 my-1 w-full rounded text-sm text-white'
//         onClick={handleAddNote}
//       >
//         ADD
//       </button>
//     </div>
//   );
// };

// export default AddEditNotes;











// import React from 'react';
// import TagInput from '../components/TagInput';
// import { useState } from "react";
// import { MdClose } from "react-icons/md";
// import axios from 'axios';


// const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showMessage }) => {

//   const [title, setTitle] = useState(noteData?.title || "");
//   const [content, setContent] = useState(noteData?.content || "");
//   const [tags, setTags] = useState(noteData?.tags || [])

//   const [error, setError] = useState(null);

//   // add note
//   const addNewNote = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       console.log("Auth Token:", token);

//       if (!token) {
//         setError("Authentication token missing. Please log in again.");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:5000/add-note",
//         {
//           title,
//           content,
//           tags,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(response);

//       if (response.data && response.data.note) {
//         setError(null);
//         showMessage("Note Added Successfully")
//         getAllNotes();
//         onClose();
//       }
//     }
//     catch (error) {
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         setError(error.response.data.message);
//       }
//     }
//   }


  
//   // edit note
//   const editNote = async () => {
//     const noteId = noteData._id;
//     const token = localStorage.getItem('authToken');
//     console.log('Token:', token);
//     if (!token) {
//       setError("Authentication token missing. Please log in again.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         "http://localhost:5000/edit-note/" + noteId,
//         {
//           title,
//           content,
//           tags,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data && response.data.note) {
//         setError(null);
//         showMessage("Note Updated Successfully");
//         getAllNotes();
//         onClose();
//       }
//     }
//     catch (error) {
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         setError(error.response.data.message);
//       }
//     }
//   };

//   const handleAddNote = () => {
//     if (!title) {
//       setError("please enter the title");
//       return;
//     };

//     if (!content) {
//       setError("please enter the content")
//       return;
//     }

//     setError("");

//     if (type === 'edit') {
//       editNote();
//     }
//     else {
//       addNewNote();
//     }
//   };
//   return (
//     <div className='relative'>
//       <button
//         className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500'
//         onClick={onClose}>
//         <MdClose className="text-xl text-slate-400" />
//       </button>

//       <div className='flex flex-col gap-2'>
//         <label className='input-label'>TITLE</label>
//         <input
//           type="text"
//           className='text-2xl text-slate-950 outline-none'
//           placeholder='Go To Gym At 5'
//           value={title}
//           onChange={({ target }) => setTitle(target.value)}
//         />
//       </div>

//       <div className='flex flex-col mt-4'>
//         <label className='input-label'>CONTENT</label>
//         <textarea
//           type="text"
//           className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
//           placeholder='Content'
//           rows={10}
//           value={content}
//           onChange={({ target }) => setContent(target.value)}
//         ></textarea>
//       </div>

//       <div className='mt-3'>
//         <label className='input-label'>TAGS</label>
//         <TagInput tags={tags} setTags={setTags} />
//       </div>

//       {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

//       <button
//         className='bg-blue-500 font-medium mt-5 p-3 
//         my-1 w-full rounded text-sm text-white'
//         onClick={handleAddNote}
//       >
//         {type === "edit" ? "UPDATE" : "ADD"}
//       </button>
//     </div>

//   );
// };

// export default AddEditNotes;
