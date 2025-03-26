import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Profile = () => {

  const user = useSelector((state) => state.user.userData);
  if (!user) {
    return <p>Loading profile...</p>; 
  }
  const userId = user?._id;
  const [userFiles, setUserFiles] = useState([]);

  useEffect(() => {
    console.log("User Data:", user); 
    console.log("User ID:", userId); 
  
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
  
    const getUserFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${BACKEND_URL}/notes/getFiles/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserFiles(result.data.data);
      } catch (error) {
        console.error("Error fetching files:", error.response?.data || error.message);
      }
    };
  
    getUserFiles();
  }, [userId]);
  

  const numberofUploads = userFiles.length;
  const numberofFiles = userFiles.reduce((count, file) => count + 1, 0);

  return (
    <div className="lg:h-heightWithoutNavbar flex flex-col items-center justify-center border border-red-500 lg:flex-row">
      <div className="flex w-full flex-col items-center justify-center border-[3px] border-green-500 py-4 lg:h-full lg:w-[40%]">
        <div className="grid h-[200px] w-[200px] place-content-center overflow-hidden rounded-full bg-gray-400 text-2xl font-black">
          <img src={user?.profileImage} alt="userprofile" className="" />
        </div>
        <div className="">
          <div className=" my-2 flex flex-col items-center justify-center ">
            <h2 className="text-2xl font-black">
              <span>{user.firstName}</span> <span>{user.lastName}</span>
            </h2>
            <p className="mt-1 text-center">{user.userName}</p>
            <p className="mt-1 text-center">
              {user.userBio}
            </p>
          </div>
        </div>
        {/* counts */}
        <div className="flex items-center justify-center gap-4">
          <div className="grid h-[80px] w-[100px] place-content-center">
            <p className="text-center text-[12px] font-bold">
              No. of Uploads :
            </p>
            <p className="text-center text-5xl font-black">{numberofUploads}</p>
          </div>
          <span className="h-[60px] w-[1px] bg-gray-400" />
          <div className="grid h-[80px] w-[100px] place-content-center">
            <p className="text-center text-[12px] font-bold">No. of Files :</p>
            <p className="text-center text-5xl font-black">{numberofFiles}</p>
          </div>
        </div>
      </div>
      <div className="h-auto w-full border-[3px] border-amber-500 p-5 lg:h-full lg:w-[60%]">
        <h1 className="mb-3 text-xl font-black">My Documents :</h1>
        <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3">
          {userFiles.map((file) => (
            <a
              href={`${BACKEND_URL}/files/${file.files}`}
              key={file._id}
              className="mb-3 flex h-[35px] max-w-[250px] items-center justify-between gap-10 rounded-xl border border-black px-4"
              target="_blank"
            >
              <p className="font-semibold"> {file.fileName}</p>
            </a>
          ))}
        </div>
      </div>
    </div >
  );
};

export default Profile;