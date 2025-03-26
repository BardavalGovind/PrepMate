import React from "react";

const About = () => {
  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 sm:p-6 lg:flex-row lg:p-10 bg-white">
      {/* Left Section - Image */}
      <div className="w-full flex justify-center lg:w-1/2">
        <img
          src="./aboutUs.svg"
          alt="About Us"
          className="w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] drop-shadow-lg transition-all duration-300"
        />
      </div>

      {/* Right Section - Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-start justify-center text-black px-4 sm:px-6 lg:px-10">
        <h1 className="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 before:absolute before:bottom-0 before:h-[3px] before:w-[50%] before:bg-blue-900 before:rounded-md">
          About PrepMate
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-black leading-relaxed">
          Welcome to <strong>PrepMate</strong>, your **smart study companion** designed to
          make **note-taking, document management, and content retrieval** effortless.
          Whether you prefer **typing, voice-to-text, or AI-powered assistance**, PrepMate
          has you covered!
        </p>

        {/* Features List */}
        <div className="mt-6 space-y-4">
          {[
            { icon: "📂", title: "Upload & Organize", desc: "Upload and manage all your study notes in one place.", color: "text-blue-600" },
            { icon: "🔎", title: "Search Effortlessly", desc: "Find any document quickly with our smart search feature.", color: "text-green-600" },
            { icon: "📝", title: "Voice & Text Notes", desc: "Type or use voice-to-text to create notes instantly.", color: "text-purple-600" },
            { icon: "🎙️", title: "Text-to-Speech", desc: "Listen to your notes using the Read Aloud feature.", color: "text-red-600" },
            { icon: "🤖", title: "AI-Powered Assistance", desc: "Get help from Gemini AI to summarize and improve your notes.", color: "text-yellow-500" },
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className={`${feature.color} text-xl sm:text-2xl`}>{feature.icon}</span>
              <p className="text-black text-sm sm:text-base">
                <strong>{feature.title}:</strong> {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-black font-medium text-sm sm:text-base lg:text-lg">
          Get started with PrepMate and <strong>redefine your learning experience today!</strong>
        </p>
      </div>
    </div>
  );
};

export default About;
