import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { X } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ReadingMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [fontSize, setFontSize] = useState(18);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/notes/get-handwritten-note/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setNote(res.data.note))
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
  }, [id, navigate]);

  const adjustFontSize = (delta) => {
    setFontSize((prev) => Math.min(Math.max(prev + delta, 14), 24));
  };

  const speakOut = () => {
    if (note?.content) {
      const speech = new SpeechSynthesisUtterance(note.content);
      speechSynthesis.speak(speech);
      setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!note) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200 z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading Note...</p>
        <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your note</p>
      </div>
    </div>
  );
}


  const backgroundClass = "bg-gradient-to-br from-blue-200 to-indigo-200";

  return (
    <div className={`fixed inset-0 z-50 ${backgroundClass}`}>
      <div className="container mx-auto px-4 py-8 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
            <p className="text-sm text-gray-500">
              {moment(note.createdOn).format("MMMM Do YYYY")}
            </p>
          </div>

          <div className="flex gap-3 items-center ml-auto">
            <button
              onClick={() => adjustFontSize(-1)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              A-
            </button>
            <button
              onClick={() => adjustFontSize(1)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              A+
            </button>

            {!isSpeaking ? (
              <button
                onClick={speakOut}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Listen
              </button>
            ) : (
              <button
                onClick={stopSpeaking}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Stop
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-300 text-gray-600 hover:text-gray-900"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 max-w-3xl mx-auto"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {note.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingMode;
