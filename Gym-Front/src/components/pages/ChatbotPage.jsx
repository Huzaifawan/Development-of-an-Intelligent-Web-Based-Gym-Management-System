import React, { useState, useRef, useEffect } from "react";
import { chatbotApi } from "../../api/chatbotApi";
import { FaRobot, FaPaperPlane, FaTimes, FaUser } from "react-icons/fa";

const ChatbotPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! 👋 Welcome to GetFit. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await chatbotApi.sendMessage(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            response.data.botResponse || "Sorry, I could not understand that.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I am having trouble responding right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        {isOpen ? (
          <FaTimes className="text-dark text-2xl" />
        ) : (
          <FaRobot className="text-dark text-2xl" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass-card flex flex-col overflow-hidden shadow-2xl animate-slideUp">
          {/* Header */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <FaRobot className="text-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-white">GetFit Assistant</h3>
                <p className="text-xs text-gray-400">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${msg.type === "user" ? "bg-gradient-to-r from-primary to-secondary text-dark" : "bg-card border border-border text-gray-300"} rounded-2xl px-4 py-2`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.type === "bot" ? (
                      <FaRobot className="text-xs" />
                    ) : (
                      <FaUser className="text-xs" />
                    )}
                    <span className="text-xs opacity-75">
                      {msg.type === "bot" ? "Assistant" : "You"}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-dark border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <FaPaperPlane className="text-dark" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Try asking about memberships, trainers, or pricing
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotPage;
