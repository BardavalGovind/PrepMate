import React from 'react';

const TTSSTTControls = ({ text, setText }) => {
  const handleTextToSpeech = () => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const handleSpeechToText = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prevText) => prevText + ' ' + transcript);
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={handleTextToSpeech}>Text to Speech</button>
      <button onClick={handleSpeechToText}>Speech to Text</button>
    </div>
  );
};

export default TTSSTTControls;
