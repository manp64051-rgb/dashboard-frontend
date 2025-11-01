import React, { useState, useEffect, useRef } from "react";
import "./STT.css"; // scoped CSS
import Header from "../components/Header";

export default function STT() {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [languages] = useState([
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "en-IN", name: "English (India)" },
    { code: "hi-IN", name: "Hindi" },
    { code: "fr-FR", name: "French" },
    { code: "es-ES", name: "Spanish" },
  ]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition API");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Recognition error:", event.error);
      stopRecording();
      if (event.error === "no-speech") alert("No speech detected.");
      else if (event.error === "audio-capture") alert("Microphone not found.");
      else if (event.error === "not-allowed") alert("Microphone permission blocked.");
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.lang = selectedLang;
    recognitionRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "speech.txt";
    a.click();
  };

  const handleClear = () => {
    setTranscript("");
  };

  return (
    <div>
      <Header/>
    <div className="stt-container">
      <div className="container">
        <p className="heading">Speech to Text</p>
        <div className="options">
          <div className="language">
            <p>Language</p>
            <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="line"></div>

        <button
          className={`btn record ${recording ? "recording" : ""}`}
          onClick={recording ? stopRecording : startRecording}
        >
          <div className="icon">
            <ion-icon name="mic-outline"></ion-icon>
            <img src="bars.svg" alt="" />
          </div>
          <p>{recording ? "Listening..." : "Start Listening"}</p>
        </button>

        <p className="heading">Result :</p>
        <div className="result" spellCheck="false" placeholder="Text will be shown here">
          <p className="interim">{transcript}</p>
        </div>

        <div className="buttons">
          <button className="btn clear" onClick={handleClear}>
            <ion-icon name="trash-outline"></ion-icon>
            <p>Clear</p>
          </button>
          <button className="btn download" disabled={!transcript} onClick={handleDownload}>
            <ion-icon name="cloud-download-outline"></ion-icon>
            <p>Download</p>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
