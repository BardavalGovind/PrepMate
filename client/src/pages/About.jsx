import React from "react";

const About = () => {
  return (
    <div className="h-heightWithoutNavbar flex flex-col items-center justify-start p-5 lg:flex-row">
      <div className="grid h-full w-full place-content-center">
        <img
          src="./aboutUs.svg"
          alt="About Us"
          className="w-[300px] sm:w-[400px] md:w-[450px] lg:w-[600px]"
        />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div>
          <h1 className="relative w-fit text-2xl font-bold before:absolute before:top-[90%] before:h-[3px] before:w-[60%] before:bg-[#2563eb] lg:text-4xl lg:before:top-full">
            About Us
          </h1>
          <p className="mt-1 text-[15px] lg:mt-3">
            Welcome to <strong>PrepMate</strong>, your go-to platform for creating, organizing, 
            and managing study notes efficiently. Designed to streamline note-taking, 
            our platform helps students and professionals keep their learning resources 
            structured and easily accessible.
          </p>
        </div>
      <div>
          <h1 className="relative w-fit text-2xl font-bold before:absolute before:top-[90%] before:h-[3px] before:w-[60%] before:bg-[#2563eb] lg:text-4xl lg:before:top-full">
            Who We Are
          </h1>
          <p className="mt-1 text-[15px] lg:mt-3">
            <strong>PrepMate</strong> is not just a note-making tool; it's a productivity-driven 
            platform designed to enhance learning experiences. Founded by a team of passionate 
            learners and tech enthusiasts, our mission is to provide an intuitive and seamless 
            way to organize knowledge.
          </p>
        </div>
        <div>
          <h1 className="relative w-fit text-2xl font-bold before:absolute before:top-[90%] before:h-[3px] before:w-[60%] before:bg-[#2563eb] lg:text-4xl lg:before:top-full">
            Our Mission
          </h1>
          <p className="mt-1 text-[15px] lg:mt-3">
            At <strong>PrepMate</strong>, we strive to empower students and professionals with 
            a smart note-taking system that fosters better retention and organization. 
            Our goal is to break barriers in knowledge management, making study materials 
            and ideas effortlessly accessible anytime, anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
