import React, { useState } from 'react';
import { MdCreate, MdDelete } from 'react-icons/md';
import { GiNotebook } from 'react-icons/gi';
import moment from 'moment';
import Modal from 'react-modal';

const NoteCard = ({ title, date, content, tags, onEdit, onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const synth = window.speechSynthesis;

  const speakOut = () => {
    if (!isSpeaking) {
      synth.cancel(); 
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'en-US';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      synth.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      <div className="w-80 h-72 border rounded-lg p-6 shadow-xl hover:shadow-2xl bg-gradient-to-r from-orange-100 to-blue-100 transition-all transform hover:scale-105 flex flex-col justify-between relative focus:outline-none focus:ring-4 focus:ring-blue-500">
        <div className="absolute top-4 left-4 text-gray-600 text-5xl">
          <GiNotebook />
        </div>

        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <h6 className="text-2xl font-semibold text-gray-900 text-center">{title}</h6>
          <span className="text-base text-gray-700">{moment(date).format('Do MMM YYYY')}</span>
        </div>

        <div className="text-xs text-gray-200 flex flex-wrap gap-1 mt-4 justify-center">
          {tags.map((item, index) => (
            <span key={index} className="bg-white bg-opacity-30 text-white py-1 px-2 rounded-full">
              #{item}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div 
            className="text-center text-blue-600 font-bold text-lg cursor-pointer hover:text-yellow-300 transition-all duration-300 animate-pulse"
            onClick={() => setModalIsOpen(true)}
          >
            Explore &gt;&gt;&gt;
          </div>

          <div className="flex gap-4">
            <MdCreate
              className="text-xl text-green-600 cursor-pointer hover:text-green-600 transition-all duration-200"
              onClick={onEdit}
            />
            <MdDelete
              className="text-xl text-red-600 cursor-pointer hover:text-red-600 transition-all duration-200"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)}
        className="w-2/3 h-2/3 bg-white rounded-lg shadow-lg p-6 mx-auto top-40 relative"

        style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">{title}</h2>
        <span className="text-sm text-gray-500 text-center block mt-2">{moment(date).format('Do MMM YYYY')}</span>
        <p className="mt-4 text-gray-700 whitespace-pre-line overflow-y-auto max-h-80">{content}</p>

        {/* Buttons centered at the bottom */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
          <button 
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-200"
            onClick={speakOut}
            disabled={isSpeaking}
          >
            Listen
          </button>
          {isSpeaking && (
            <button 
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-200"
              onClick={stopSpeaking}
            >
              Stop Listening
            </button>
          )}
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
            onClick={() => setModalIsOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default NoteCard;



