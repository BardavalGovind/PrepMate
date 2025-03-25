import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [profilePreviewImage, setProfilePreviewImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("userMobile", userMobile);
      formData.append("userEmail", userEmail);
      formData.append("userName", userName);
      formData.append("userPassword", userPassword);
      formData.append("profileImage", profileImage);

      const result = await axios.post("http://localhost:8001/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User registered successfully!");
    } catch (error) {
      toast.error("Failed to register. Try again.");
    }
  };

  return (
    
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-orange-400 to-blue-400 px-4 p-4">
      <form className="w-full max-w-2xl bg-white rounded-xl p-10 shadow-lg border-2 border-white" onSubmit={registerUser}>

        <h1 className="mb-6 text-center text-4xl font-bold text-gray-700">Register</h1>
        
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold" htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-400" 
              placeholder="John" 
              onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold" htmlFor="lastName">Last Name</label>
            <input
              type="text" 
              id="lastName" 
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-400" 
              placeholder="Doe" 
              onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block font-semibold" htmlFor="userEmail">Email</label>
          <input
              type="email" 
              id="userEmail" 
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-400" 
              placeholder="your.email@example.com" 
              onChange={(e) => setUserEmail(e.target.value)} />
        </div>
        
        <div className="mb-6">
          <label className="block font-semibold" htmlFor="userMobile">Mobile Number</label>
          <input
           type="text" 
           id="userMobile" 
           className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-400" 
           placeholder="0000000000" 
           onChange={(e) => setUserMobile(e.target.value)} />
        </div>
        
        <div className="mb-6">
          <label className="block font-semibold" htmlFor="userName">Username</label>
          <input
           type="text" 
           id="userName" 
           className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-400" 
           placeholder="johndoe123" 
           onChange={(e) => setUserName(e.target.value)} />
        </div>
        
        <div className="mb-6">
          <label className="block font-semibold" htmlFor="userPassword">Password</label>
          <input
           type="password" 
           id="userPassword" 
           className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-400" 
           placeholder="********" 
           onChange={(e) => setUserPassword(e.target.value)} />
        </div>
        
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300">
            {profilePreviewImage ? <img src={profilePreviewImage} alt="Profile" className="h-full w-full object-cover" /> : 
            <p className="flex h-full items-center justify-center text-sm text-gray-500">Profile Image</p>}
          </div>
          <label className="cursor-pointer rounded-md border px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100">
            Upload Image
            <input
             type="file" 
             accept="image/*"
             className="hidden" 
             onChange={(e) => {
              setProfilePreviewImage(URL.createObjectURL(e.target.files[0]));
              setProfileImage(e.target.files[0]);
            }} />
          </label>
        </div>
        
        <button className="w-full rounded-lg bg-blue-600 px-5 py-3 text-white font-bold hover:bg-blue-700 text-lg">Register</button>
        
        <p className="mt-6 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;
