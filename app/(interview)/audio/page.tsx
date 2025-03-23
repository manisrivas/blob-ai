"use client";
import { useState, useEffect } from "react";
import GoeeyEffect from "@/components/goofy";
import OpenAI from "openai";
import { X } from "lucide-react";

const openai = new OpenAI({
  //apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function ChatWithGooey() {
  const [messages, setMessages] = useState([]);
  const [gooeyState, setGooeyState] = useState("idle");
  const [isListening, setIsListening] = useState(false);
  const [showChat, setShowChat] = useState(false);
  let recognition;

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender === "bot") {
      setGooeyState("speaking");
      speak(messages[messages.length - 1].text);
    }
  }, [messages]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => setGooeyState("speaking");
    utterance.onend = () => {
      setGooeyState("listening");
      setTimeout(startListening, 500);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error("Speech recognition not supported.");
      return;
    }

    if (recognition) recognition.abort();

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setGooeyState("listening");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setMessages((prev) => [...prev, { text: transcript, sender: "user" }]);

      const botReply = await getAIResponse(transcript);
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      speak(botReply);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech" || event.error === "network") {
        setTimeout(startListening, 1000);
      }
    };

    recognition.onend = () => {
      setTimeout(startListening, 500);
    };

    recognition.start();
  };

  const getAIResponse = async (userText) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userText }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error("AI API error:", error);
      return "I didn't get that, try again!";
    }
  };

  useEffect(() => {
    startListening();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Gooey Effect Component */}
      <div className="relative">
        <GoeeyEffect />
        {/* Speech Bubble Appears Below Component */}
        {messages.length > 0 && (
          <div className="absolute bottom-[-4rem] left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg text-gray-700">
            {messages[messages.length - 1].text}
          </div>
        )}
      </div>

      {/* Chat Box (Hidden by Default) */}
      {showChat && (
        <div className="absolute bottom-10 right-10 w-96 bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={() => setShowChat(false)}>
              <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-md max-w-[80%] ${
                  msg.sender === "bot" ? "bg-blue-200 self-start" : "bg-green-200 self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Chat Button */}
      {!showChat && (
        <button
          className="absolute bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
          onClick={() => setShowChat(true)}
        >
          Open Chat
        </button>
      )}
    </div>
  );
}
