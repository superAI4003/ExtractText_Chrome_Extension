import "./App.css"; 
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect, useRef } from "react";
import { BsSendCheck } from "react-icons/bs";
import ReactLoading from "react-loading";

function App() {
  const commands = [
    {
      command: "please search",
      callback: () => handleOpenNewTab(),
    },
    {
      command: "please go back",
      callback: () => {
        setPrompt("") 
        resetTranscript()},
    },
  ];

  const handleOpenNewTab = () => {
    // Attempt to open a new tab
    const newWindow = window.open(`https://www.google.com/search?q=`, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null; // Ensures the new tab is not linked to the original window
    } else {
      console.log("Popup blocked. Please allow popups for this site.");
    }
  };
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState(transcript);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [result, setResult] = useState(""); 
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  
  useEffect(() => {
    chrome.storage.local.get("extractedText", (data) => {
      if (data.extractedText) {
        setContent(data.extractedText);
      }
    });
    startListening();
  }, []);

  useEffect(() => {
    setPrompt(transcript);
  }, [transcript]);

  const handleSend = async () => {
    stopListening();
    setLoadingResponse(true);
    await getResponseForGivenPrompt();
    setLoadingResponse(false);
    resetTranscript();
  };
  const getResponseForGivenPrompt = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(
        "content:" + content + "prompt" + prompt
      );
      const response = result.response;
      setResult(response.text());
    } catch (error) {
      console.log("Something Went Wrong"+error);
      setLoadingResponse(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#0E1D2E] text-[#F0F4F8]">
      <div className="w-[60%] mx-auto pt-10">
        <h1 className="text-center text-white font-semibold text-6xl pb-10">
          Chrome Extension
        </h1>
        <a
        href="https://www.example.com"
        target="_blank"
        rel="noopener noreferrer"
        ref={linkRef}
        style={{ display: "none" }}
      >
        Hidden Link
      </a>
        <div className="text-[17px] pb-7">
          <p className="text-[#829AB1] pb-2">Extracted Text:</p>
          <textarea
            id="Job Description"
            rows={9}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="hover:outline-none rounded-lg focus:outline-none px-4 py-2 focus:border-[#0D529B] border-[#112B46] border-2 bg-[#0F2033] text-[#829AB1] w-full transition-all duration-500"
          />
        </div>
        <div className="text-[17px] pb-7">
          <p className="text-[#829AB1] pb-2">Result Text:</p>
          <textarea
            id="Job Description"
            rows={9}
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="hover:outline-none  rounded-lg focus:outline-none px-4 py-2 focus:border-[#0D529B] border-[#112B46] border-2 bg-[#0F2033] text-[#829AB1] w-full transition-all duration-500"
          />
        </div> 
        <div className=" flex gap-3 pl-8 rounded-full hover:outline-none  focus:outline-none px-4 py-2 focus:border-[#0D529B] border-[#112B46] border-2 bg-[#0F2033] text-[#829AB1] w-full transition-all duration-500">
          <input
            className="bg-[#0F2033] text-white text-[12px] outline-none w-full"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button onClick={handleSend}>
            {!loadingResponse ? (
              <BsSendCheck />
            ) : (
              <ReactLoading
                type="bars"
                color="#ffffff"
                height={20}
                width={20}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
