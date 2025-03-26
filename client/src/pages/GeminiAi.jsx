import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { Send, Loader2, Trash, Plus } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chats, loading]);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newUserMessage = { sender: "user", text: question };
    setChats((prevChats) => [...prevChats, newUserMessage]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/notes/AIcontent`,
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let aiResponse = res.data.result || "No response received.";
      setChats((prevChats) => [
        ...prevChats,
        { sender: "ai", text: formatResponse(aiResponse) },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChats((prevChats) => [
        ...prevChats,
        { sender: "ai", text: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    return text
      .split("\n")
      .map((line, index) => `<p key=${index} style="margin-bottom: 8px;">${line}</p>`)
      .join("");
  };

  const handleNewChat = () => setChats([]);

  const filteredHistory = useMemo(() => {
    return history.filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  return (
    <div className="flex flex-col sm:flex-row h-screen min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="sm:w-[300px] w-full bg-gray-800 p-6 flex flex-col shadow-lg flex-shrink-0 h-[50vh] sm:h-auto">
        <button
          onClick={handleNewChat}
          className="bg-blue-600 w-full py-3 rounded-lg text-white font-semibold mb-4 hover:bg-blue-500 transition flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" /> New Chat
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history..."
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          aria-label="Search chat history"
        />
        <div className="flex-grow overflow-y-auto max-h-[40vh] sm:max-h-full mt-2 space-y-2">
          {filteredHistory.map((chat) => (
            <div
              key={chat.id}
              className="p-2 rounded-lg cursor-pointer flex justify-between items-center text-sm font-medium bg-blue-500 hover:bg-blue-400 transition"
              tabIndex={0}
            >
              <span>{chat.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHistory(history.filter((c) => c.id !== chat.id));
                }}
                className="hover:text-red-400"
                aria-label="Delete chat"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex flex-col flex-grow bg-gray-900">
        <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[70vh] sm:max-h-[80vh]">
          {chats.map((chat, index) => (
            <div key={index} className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 max-w-[85%] sm:max-w-[60%] rounded-lg ${
                  chat.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                }`}
                dangerouslySetInnerHTML={{ __html: chat.text }}
              />
            </div>
          ))}
          {loading && (
            <div className="p-3 bg-gray-700 text-white rounded-lg animate-pulse">Typing...</div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 flex items-center bg-gray-800 rounded-full border-t mx-2 sm:mx-auto sm:w-[85%] mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white w-full"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full text-lg hover:bg-blue-600 transition flex items-center"
            aria-label="Send message"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={22} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
