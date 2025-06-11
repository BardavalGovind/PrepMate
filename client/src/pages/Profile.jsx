import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import defaultProfile from "../images/profile.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const customUser = useSelector((state) => state.user.userData);
  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = customUser?._id;
  // console.log("User ID in profile:", userId);

  useEffect(() => {
    if (!userId) return;

    const fetchFiles = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) throw new Error("No token found");

        const response = await axios.get(`${BACKEND_URL}/notes/getFiles/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`${BACKEND_URL}/notes/getFiles/${userId}`);
        setUserFiles(response.data.data);
        console.log("Fetched files :", response.data.data);

        setUserFiles(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  if (!customUser) return <div className="flex justify-center items-center h-screen"><p>Loading profile...</p></div>;

  const { firstName, lastName, userName } = customUser;

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Section */}
          <div className="w-full lg:w-1/3 flex items-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
              <div className="flex flex-col items-center">
                <div className="mb-6 grid h-40 w-40 place-content-center overflow-hidden rounded-full border-[6px] border-blue-300 shadow-md">
                  <img src={defaultProfile} alt="userprofile" className="h-full w-full object-cover" />
                </div>

                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">{firstName} {lastName}</h2>
                  <p className="mt-2 text-gray-500">@{userName || firstName}</p>
                </div>

                <div className="w-full p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-inner">
                  <p className="text-center text-sm font-medium text-gray-600">Total Files</p>
                  <p className="text-center text-4xl font-bold text-blue-700">{userFiles.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-md p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  My Documents
                </h2>
                {!loading && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {userFiles.length} {userFiles.length === 1 ? 'file' : 'files'}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              ) : userFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto p-2">
                  {userFiles.map((file) => (
                    <a
                      href={`${BACKEND_URL}/files/${file.file}`}
                      key={file._id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400 mr-3 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600">{file.fileName}</p>
                      </div>
                      <span className="text-blue-600 text-xs font-semibold">View</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="col-span-full py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No documents found</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload your first document to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;