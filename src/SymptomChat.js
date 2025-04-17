import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./SymptomChat.css";

const SymptomChat = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "Hello! Tell me your symptoms and I'll try to help you.",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/symptom-check", {
        symptoms: input,
      });

      const { cause, severity, first_aid, advice } = res.data;
      const botText = `
<b>Possible Cause:</b> ${cause}
<br><b>Severity:</b> ${severity}
<br><b>First Aid:</b> ${first_aid}
<br><b>Advice:</b> ${advice}
      `.trim();

      const botMsg = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <h2 className="chat-heading">🏥 Injury Symptom Assistant</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        ))}
        {loading && <div className="chat-loading">Typing...</div>}
        <div ref={bottomRef}></div>
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter symptoms..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default SymptomChat;
