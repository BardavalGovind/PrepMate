import React, { useState } from 'react';
import { MdCreate, MdDelete } from 'react-icons/md';
import { GiNotebook } from 'react-icons/gi';
import moment from 'moment';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const NoteCard = ({ title, date, content, tags, onEdit, onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const synth = window.speechSynthesis;

  const speakOut = () => {
    if (!isSpeaking && content.trim()) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'en-US';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      <div className="w-full sm:w-80 h-72 border rounded-lg p-5 sm:p-6 shadow-lg hover:shadow-2xl bg-gradient-to-r from-orange-100 to-blue-100 transition-all transform hover:scale-105 flex flex-col justify-between relative focus:outline-none focus:ring-4 focus:ring-blue-500">
        <div className="absolute top-2 left-2 text-gray-600 text-3xl sm:text-4xl">
          <GiNotebook />
        </div>

        <div className="flex flex-col items-center justify-center h-full space-y-1 sm:space-y-2 text-center">
          <h6 className="text-base sm:text-xl font-semibold text-gray-900">{title}</h6>
          <span className="text-xs sm:text-sm text-gray-700">{moment(date).format('Do MMM YYYY')}</span>
        </div>

        <div className="text-xs sm:text-sm text-gray-200 flex flex-wrap gap-1 mt-3 justify-center">
          {tags?.length > 0 ? (
            tags.map((item, index) => (
              <span key={index} className="bg-white bg-opacity-30 text-white py-1 px-2 rounded-full">
                #{item}
              </span>
            ))
          ) : (
            <span className="text-gray-400 italic">No Tags</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
              <div
              className="text-blue-600 font-bold text-sm sm:text-lg cursor-pointer transition-all"
              onClick={() => setModalIsOpen(true)}
            >
              Explore &gt;&gt;&gt;
            </div>


          <div className="flex gap-2 sm:gap-3">
            <MdCreate
              className="text-base sm:text-lg text-green-600 cursor-pointer hover:text-green-800 transition-all duration-200"
              onClick={onEdit}
            />
            <MdDelete
              className="text-base sm:text-lg text-red-600 cursor-pointer hover:text-red-800 transition-all duration-200"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="w-11/12 sm:w-3/4 md:w-2/3 lg:max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 relative mt-24 max-h-[85vh] overflow-y-auto"
        style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-800 text-center">{title}</h2>
        <span className="text-xs sm:text-sm text-gray-500 text-center block mt-2">
          {moment(date).format('Do MMM YYYY')}
        </span>
        <p className="mt-4 text-gray-700 whitespace-pre-line overflow-y-auto max-h-60 sm:max-h-72 text-xs sm:text-base p-2">
          {content}
        </p>

        {/* Buttons centered at the bottom */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4">
          <button
            className="px-3 sm:px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-200 text-xs sm:text-base"
            onClick={speakOut}
            disabled={isSpeaking}
          >
            Listen
          </button>
          {isSpeaking && (
            <button
              className="px-3 sm:px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-200 text-xs sm:text-base"
              onClick={stopSpeaking}
            >
              Stop Listening
            </button>
          )}
          <button
            className="px-3 sm:px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200 text-xs sm:text-base"
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
