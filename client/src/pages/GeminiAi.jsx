import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Loader2, Trash, Plus } from "lucide-react";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chats, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newUserMessage = { sender: "user", text: question };
    setChats([...chats, newUserMessage]);
    setLoading(true);
    setQuestion("");
    try {
      const res = await axios.post("http://localhost:5000/notes/AIcontent", { question });
      let aiResponse = res.data.result;
      let words = aiResponse.split(" ");
      let index = 0;

      const displayResponse = () => {
        if (index < words.length) {
          setChats((prevChats) => {
            let updatedChats = [...prevChats];
            let lastMessage = updatedChats[updatedChats.length - 1];

            if (lastMessage?.sender === "ai") {
              lastMessage.text += " " + words[index];
            } else {
              updatedChats.push({ sender: "ai", text: words[index] });
            }
            return [...updatedChats];
          });

          index++;
          setTimeout(displayResponse, 100);
        } else {
          setLoading(false);
        }
      };

      displayResponse();

      if (!selectedChat) {
        const newHistoryItem = {
          id: Date.now(),
          name: `Chat ${history.length + 1}`,
          chats: [...chats, newUserMessage],
        };
        setHistory([...history, newHistoryItem]);
        setSelectedChat(newHistoryItem);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setChats((prevChats) => [...prevChats, { sender: "ai", text: "Error fetching response." }]);
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setChats([]);
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      {/* Sidebar */}
      <aside className="w-[300px] bg-gray-300 text-white p-6 flex flex-col shadow-lg flex-shrink-0">
        <button
          onClick={handleNewChat}
          className="bg-orange-600 w-full py-4 px-6 rounded-lg text-white text-lg font-semibold mb-6 hover:bg-blue-600 transition"
        >
          <Plus size={20} className="inline-block mr-1" /> New Chat
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history..."
          className="w-full p-3 mb-4 rounded bg-gray-100 text-black border border-gray-600 focus:outline-none"
        />
        <div className="flex-grow space-y-2 overflow-y-auto">
          {history
            .filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center text-lg font-medium ${
                  selectedChat?.id === chat.id ? "bg-orange-600" : "bg-orange-500"
                } hover:bg-blue-700 transition`}
                onClick={() => setSelectedChat(chat)}
              >
                <span>{chat.name}</span>
                <Trash
                  size={20}
                  className="cursor-pointer hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHistory(history.filter((c) => c.id !== chat.id));
                  }}
                />
              </div>
            ))}
        </div>
      </aside>

      {/* Chat Container */}
      <div className="flex flex-col flex-grow bg-gray-100">
        <div
          ref={chatContainerRef}
          className="flex-grow p-6 space-y-4 bg-gray-100 rounded-lg mx-auto w-[85%] max-h-[70vh] overflow-y-auto"
        >
          {chats.map((chat, index) => (
            <div key={index} className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-4 rounded-2xl text-white shadow-md max-w-[70%] break-words ${
                  chat.sender === "user" ? "bg-orange-500" : "bg-green-500"
                }`}
              >
                {chat.text}
              </div>
            </div>
          ))}
          {loading && <div className="p-4 bg-gray-100 text-white rounded-lg animate-pulse">Typing...</div>}
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex items-center bg-white rounded-full border-t mx-auto w-[85%]">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-2 px-5 py-3 bg-blue-500 text-white rounded-full text-lg hover:bg-blue-600 transition flex items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
