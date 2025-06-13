import React, { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ setContent }) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const lastLengthRef = useRef(0);

  const startListening = () => {
    resetTranscript();
    lastLengthRef.current = 0;
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    appendNewWords(); 
  };

  const appendNewWords = () => {
    const words = transcript.trim().split(" ");
    const newWords = words.slice(lastLengthRef.current);

    if (newWords.length > 0) {
      setContent((prevContent) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = prevContent;

        const currentText = tempDiv.textContent || tempDiv.innerText || "";
        const updatedText = `${currentText} ${newWords.join(" ")}`.trim();

        return `<p>${updatedText}</p>`;
      });

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
        type="button"
        onClick={startListening}
        className={`w-32 h-12 text-lg font-semibold flex items-center justify-center rounded-xl shadow-md transition-all duration-300 
          ${listening ? "bg-blue-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
      >
        Speak Out
      </button>
      <button
        type="button"
        onClick={stopListening}
        className="w-32 h-12 text-lg font-semibold flex items-center justify-center rounded-xl shadow-md bg-orange-500 hover:bg-red-600 text-white transition-all duration-300"
      >
        Stop
      </button>
    </div>
  );
};

export default SpeechToText;
