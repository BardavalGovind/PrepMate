import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
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
import { useSelector } from 'react-redux';
import NoteCardRender from './components/NoteCardRender';
import AIChat from './pages/GeminiAi';


const App = () => {
  const isAuthenticated = useSelector((state)=> state.user.isAuthenticated);

  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>} />

          {isAuthenticated ? (
            <>
              <Route path='/profile' element={<Profile/>} />
              <Route path='/upload' element={<Upload/>} />
              <Route path='/search' element={<Search/>} />
              <Route path='/notecardrender' element={<NoteCardRender/>} />
              <Route path='/geminiai' element={<AIChat/>} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Login />}/>
              <Route path='/signup' element={<Signup />} />
            </>
  
          )}
          <Route path='/about' element={<About/>} />
          <Route path='/faq' element={<Faq/>} />
        </Routes>
      </Router>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}
export default App;


