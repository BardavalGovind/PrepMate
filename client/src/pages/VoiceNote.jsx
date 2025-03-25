import React, { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ setContent }) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const lastLengthRef = useRef(0); 

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    appendNewWords(); 
  };

  const appendNewWords = () => {
    const words = transcript.split(" "); 
    const newWords = words.slice(lastLengthRef.current);

    if (newWords.length > 0) {
      setContent((prevContent) => prevContent + " " + newWords.join(" "));
      lastLengthRef.current = words.length;
    }
  };

  useEffect(() => {
    if (listening) {
      appendNewWords();
    }
  }, [transcript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p className="text-red-500 text-sm">Your browser doesn't support speech recognition.</p>;
  }

  return (
    <div className="flex gap-4">
      <button
        className={`w-32 h-12 text-lg font-semibold flex items-center justify-center 
          rounded-xl shadow-md transition-all duration-300 
          ${listening ? "bg-green-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
        onClick={startListening}
      >
        Speak Out
      </button>
      <button
        className="w-32 h-12 text-lg font-semibold flex items-center justify-center 
          rounded-xl shadow-md bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
        onClick={stopListening}
      >
        Stop
      </button>
    </div>
  );
};

export default SpeechToText;
