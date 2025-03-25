import React from "react";

const About = () => {
  return (
    <div className="h-heightWithoutNavbar flex flex-col items-center justify-start p-6 lg:flex-row lg:p-10 bg-white">
      {/* Left Section - Image */}
      <div className="grid h-full w-full place-content-center animate-fadeIn">
        <img
          src="./aboutUs.svg"
          alt="About Us"
          className="w-[250px] sm:w-[350px] md:w-[450px] lg:w-[600px] drop-shadow-lg"
        />
      </div>

      {/* Right Section - Content */}
      <div className="flex h-full w-full flex-col items-start justify-center text-black">
        <div className="max-w-3xl">
          <h1 className="relative w-fit text-3xl font-bold text-blue-600 before:absolute before:bottom-0 before:h-[3px] before:w-[60%] before:bg-blue-900 before:rounded-md lg:text-4xl">
            About PrepMate
          </h1>

          <p className="mt-3 text-[16px] lg:text-lg text-black leading-relaxed">
            Welcome to <strong>PrepMate</strong>, your **smart study companion** designed to
            make **note-taking, document management, and content retrieval** effortless. Whether
            you prefer **typing, voice-to-text, or AI-powered assistance**, PrepMate has you covered!
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-xl">📂</span>
              <p className="text-black"><strong>Upload & Organize:</strong> Upload and manage all your study notes in one place.</p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">🔎</span>
              <p className="text-black"><strong>Search Effortlessly:</strong> Find any document quickly with our **smart search feature**.</p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-purple-600 text-xl">📝</span>
              <p className="text-black"><strong>Voice & Text Notes:</strong> Type or use voice-to-text to create notes instantly.</p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-red-600 text-xl">🎙️</span>
              <p className="text-black"><strong>Text-to-Speech:</strong> Listen to your notes using the **Read Aloud feature**.</p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-yellow-500 text-xl">🤖</span>
              <p className="text-black"><strong>AI-Powered Assistance:</strong> Get help from **Gemini AI** to summarize and improve your notes.</p>
            </div>
          </div>

          <p className="mt-6 text-black font-medium">
            Get started with PrepMate and **redefine your learning experience today!**
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
