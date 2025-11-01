import React, { useState, useRef } from "react";
import "./TTS.css";
import Header from "../components/Header";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function TTS() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fileType, setFileType] = useState("text");

  const utteranceRef = useRef(null);

  // 🧠 Smart LibreTranslate endpoint switch
  const getLibreTranslateURL = async () => {
    try {
      // Try local first
      const localCheck = await fetch("http://127.0.0.1:5000", { method: "GET" });
      if (localCheck.ok) return "http://127.0.0.1:5000/translate";
    } catch {
      console.warn("Local LibreTranslate not found, using online fallback.");
    }
    // fallback to public
    return "https://libretranslate.com/translate";
  };

  // 🧠 Translate text using LibreTranslate
  const translateText = async () => {
    if (!text.trim()) return alert("Please enter or upload text first!");

    try {
      const url = await getLibreTranslateURL();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: targetLang,
          format: "text",
        }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
        return data.translatedText;
      } else throw new Error("Invalid response");
    } catch (err) {
      console.error("Translation failed:", err);
      alert("⚠ Translation failed. Make sure LibreTranslate is running locally or try again later.");
    }
  };

  // 🎙️ Speak function
  const handleSpeak = async () => {
    let textToSpeak = translatedText || text;
    if (!textToSpeak.trim()) return alert("No text to speak!");

    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate;
      utterance.lang =
        {
          en: "en-US",
          hi: "hi-IN",
          es: "es-ES",
          fr: "fr-FR",
          de: "de-DE",
          ja: "ja-JP",
          ko: "ko-KR",
        }[targetLang] || "en-US";

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = (e) => console.error("Speech error:", e.error);

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

  // 📄 Handle file upload (.txt or .pdf)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => setText(event.target.result);
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
      <Header />
      <div className="tts-container">
        <div className="container">
          <h2>Text Translate & Speech</h2>

          {/* Input type */}
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

          <label style={{ display: "block", marginTop: "10px" }}>Translate to:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            style={{
              marginBottom: "20px",
              padding: "8px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>

          <div className="buttons">
            <button onClick={translateText}>🌍 Translate</button>
            <button onClick={handleSpeak}>▶ Speak</button>
            <button onClick={handlePauseResume} disabled={!isSpeaking}>
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button onClick={handleStop} disabled={!isSpeaking}>
              ⏹ Stop
            </button>
          </div>

          {translatedText && (
            <div
              style={{
                marginTop: "20px",
                background: "#f0f8ff",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <h3>Translated Text:</h3>
              <textarea
                value={translatedText}
                readOnly
                rows={5}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  fontSize: "16px",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TTS;

