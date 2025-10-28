import React, { useState } from "react";
import { motion } from "framer-motion";
import "./App.css"; // Import the separate CSS file
import calm1 from "./images/calm1.jpeg";
import calm2 from "./images/calm2.jpeg";


const calmingImages = [calm1,calm2];


// Function to provide random media suggestions
const getMediaSuggestion = (type) => {
  const media = {
    music: [
      "🎧 Try listening to 'Deep Focus' playlists on Spotify for calm and concentration.",
      "🎹 Search YouTube for 'Ambient Piano Music' to help quiet your mind.",
      "🌊 Nature sounds like rain or ocean waves can be incredibly soothing.",
    ],
    podcast: [
      "🎙️ I recommend 'The Daily Stoic' podcast for simple, actionable wisdom.",
      "🧠 Check out 'Therapy for Black Girls' or 'The Happiness Lab' for mental wellness insights.",
      "😴 Look for guided sleep stories or meditations on your preferred podcast app.",
    ],
  };
  const options = media[type];
  return options[Math.floor(Math.random() * options.length)];
};


export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  
  // Expanded keywords and responses including depression, media, and general tips
  const responses = {
    stress: ["🌱 Take a deep breath…", "Notice 5 things around you.", "Try a 5-minute guided meditation.", "Focus on what you can control right now."],
    motivation: ["Small wins create momentum 🌟", "What's one small step you can take right now?", "Break your task into chunks: micro-goals."],
    sleep: ["💤 Dim lights 1 hour before sleep.", "Avoid screens before bed.", "Try a simple body scan for relaxation."],
    anxiety: ["Consistency beats intensity. Progress matters more than perfection ✨", "Focus on your breathing to calm your mind.", "Remember, it's okay to feel this way. You're not alone."],
    depression: ["☀️ Try to get outside for 10 minutes, even if it's cloudy. Sunlight helps.", "Connect with one person you trust today, even with a short message.", "Small acts of self-care are major victories. You are resilient."],
    music: [getMediaSuggestion('music')],
    podcast: [getMediaSuggestion('podcast')],
  };

  const getRandomCalmingImage = () => {
    const index = Math.floor(Math.random() * calmingImages.length);
    return calmingImages[index];
  };

  const getResponse = (text) => {
    const lower = text.toLowerCase();

    // Detect name (e.g., Hi I am Alia)
    const nameMatch = text.match(/(?:hi|hello|hey),? i am (\w+)/i);
    if (!name && nameMatch) {
      const extractedName = nameMatch[1];
      setName(extractedName);
      return `✨ Hi ${extractedName}! I'm happy to meet you. How are you feeling today?`;
    }

    // Keyword responses
    for (const key in responses) {
      // Check for keyword match, or phrases like 'tip for X' or 'suggest X'
      if (lower.includes(key) || (lower.includes("tip") && lower.includes(key)) || (lower.includes("suggest") && lower.includes(key))) {
        const options = responses[key];
        
        // Handle responses that are functions (like music/podcast suggestions)
        const responseText = typeof options[0] === 'function' 
            ? options[0]() // Execute the function to get the text
            : options[Math.floor(Math.random() * options.length)]; // Pick a random string
        
        return responseText;
      }
    }

    // Default
    return `💙 I hear you, ${name || 'friend'}. How can I support you today? Try 'stress', 'anxiety', 'depression', 'motivation', 'sleep', or ask for 'music' or 'podcast'.`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    let reply = getResponse(userMessage);

    // Check for calming image request
    if (userMessage.toLowerCase().includes("calming image")) {
      const url = getRandomCalmingImage();
      reply = "🌄 Here's a calming image for you.";
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userMessage },
        { sender: "bot", text: reply, image: url },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: userMessage },
        { sender: "bot", text: reply },
      ]);
    }

    setInput("");
  };

  return (
    <div className="app">
      {/* The motion.img is now just a background element for the CSS glow */}
      <div className="bg-floating"></div>
      <div className="chat-container">
        <h1 className="chat-header">🌸 Zentora Mentalcare Bot</h1>
        <p>Your safe space for support 💙</p>
        <div className="chat-window">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
              {msg.image && <img src={msg.image} alt="calm" className="calm-image" />}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
