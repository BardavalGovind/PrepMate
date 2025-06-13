import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'regenerator-runtime/runtime';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Header from './components/Header';
import Search from './pages/Search';
import About from './pages/About';
import Upload from './pages/Upload';
import Faq from './pages/Faq';
import Profile from './pages/Profile';
import NoteCardRender from './components/NoteCardRender';
import AIChat from './pages/GeminiAi';
import CreateNote from './pages/CreateNote';
import ReadingMode from './pages/ReadingMode';
import AddEditNotes from './pages/AddEditNotes';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './Redux/slices/user-slice';
import axios from 'axios';

const App = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          {isAuthenticated ? (
            <>
              <Route path='/Userprofile' element={<Profile />} />
              <Route path='/uploadFile' element={<Upload />} />
              <Route path='/searchFile' element={<Search />} />
              <Route path='/ViewTextNotes' element={<NoteCardRender />} />
              <Route path='/ai' element={<AIChat />} />
              <Route path='/notes/addnew' element={<AddEditNotes type="add" />} />
              <Route path='/notes/edit/:id' element={<AddEditNotes type="edit" />} />
              <Route path='/CreateNote' element={<CreateNote />} />
              <Route path='/notes/read/:id' element={<ReadingMode />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </>
          )}
          <Route path='/about' element={<About />} />
          <Route path='/faq' element={<Faq />} />
        </Routes>
      </Router>

      <ToastContainer position="top-center" autoClose={700} />
    </>
  );
};

export default App;
