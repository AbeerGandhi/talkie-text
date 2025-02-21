import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  const mic = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use different browser.');
      return;
    }

    mic.current = new SpeechRecognition();
    mic.current.continuous = true;
    mic.current.interimResults = true;
    mic.current.lang = 'en-US';

    mic.current.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setNote(transcript);
    };

    mic.current.onerror = event => {
      console.error('Speech recognition error:', event.error);
    };

    if (isListening) {
      mic.current.start();
    } else {
      mic.current.stop();
    }

    return () => {
      mic.current.stop();
    };
  }, [isListening]);

  const handleSaveNote = () => {
    if (note.trim()) {
      setSavedNotes([...savedNotes, note]);
      setNote('');
    }
  };

  return (
    <>
      <h1 align="center"> SPEAK & SAVE </h1>
      <div className="container">
        <div className="box">
          <h2>Live Transcription</h2>
          {isListening ? <span>🎙️ </span> : <span>🛑  </span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            {isListening ? 'Stop' : 'Start'}
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Saved Entries</h2>
          {savedNotes.map((n, index) => (
            <p key={index}>{n}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
