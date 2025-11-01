import React, { useState, useRef } from "react";
import "./TTS.css"; // make sure this path is correct
import Header from '../components/Header'

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function TTS() {
  const [text, setText] = useState("");
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fileType, setFileType] = useState("text"); // "text" or "file"

  const utteranceRef = useRef(null);

  const handleSpeak = () => {
    if (!text.trim()) return;
    

    // Stop any previous speech
    window.speechSynthesis.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e.error);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const handlePauseResume = () => {
    if (!isSpeaking) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Handle file upload (.txt or .pdf)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file);
    } else if (fileName.endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let pdfText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          pdfText += pageText + "\n";
        }
        setText(pdfText);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a .txt or .pdf file only");
    }
  };

  return (
  <div>
    <Header/>
    <div className="tts-container">
      <div className="container">
        <h2>Text to Speech</h2>


        {/* Dropdown for input type */}
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            style={{
              marginBottom: "15px",
              padding: "8px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="text">Type Text</option>
            <option value="file">Upload File (.txt or .pdf)</option>
          </select>

        {/* Conditional input */}
          {fileType === "text" ? (
            <textarea
              placeholder="Type something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
            />
          ) : (
            <input
              type="file"
              accept=".txt, .pdf"
              onChange={handleFileUpload}
              style={{ width: "100%", marginBottom: "20px" }}
            />
          )}

        <div className="buttons">
          <button onClick={handleSpeak}>▶ Speak</button>
          <button onClick={handlePauseResume} disabled={!isSpeaking}>
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <button onClick={handleStop} disabled={!isSpeaking}>
            ⏹ Stop
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default TTS;
