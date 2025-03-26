import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Loader2, Trash, Plus } from "lucide-react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);
  const token = localStorage.getItem('token');

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
    setChats((prevChats) => [...prevChats, newUserMessage]);
    setLoading(true);
    setQuestion("");
  
    try {
      const res = await axios.post(
        `${BACKEND_URL}/notes/AIcontent`, 
        { question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let aiResponse = res.data.result || "No response received.";
  
      const words = aiResponse.split(" ");
      let currentText = "";
  
      words.forEach((word, index) => {
        setTimeout(() => {
          currentText += word + " ";
          
          let formattedText = formatResponse(currentText); 
  
          setChats((prevChats) => {
            let updatedChats = [...prevChats];
            let lastMessage = updatedChats[updatedChats.length - 1];
  
            if (lastMessage?.sender === "ai") {
              lastMessage.text = formattedText;
            } else {
              updatedChats.push({ sender: "ai", text: formattedText });
            }
  
            return [...updatedChats];
          });
        }, index * 100);
      });
  
    } catch (error) {
      console.error("Error fetching response:", error);
      setChats((prevChats) => [...prevChats, { sender: "ai", text: "Error fetching response." }]);
    } finally {
      setLoading(false);
    }
  };
  

  const formatResponse = (text) => {
    return text
      .split("\n")
      .map((line, index) => {
        let boldedLine = line.replace(/(:\s*|-\s*|^)(\w+)/g, (match, p1, p2) => {
          return `${p1}<u>${p2}</u>`;
        });
        return `<p key=${index} style="margin-bottom: 8px;">${boldedLine}</p>`;
      })
      .join("");
  };

  const updateHistory = (chatMessages) => {
    if (chatMessages.length === 0) return;

    const newChat = {
      id: Date.now(),
      name: `Chat ${history.length + 1}`,
      messages: chatMessages,
    };

    const updatedHistory = [...history, newChat];
    setHistory(updatedHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
  };

  const handleNewChat = () => {
    setChats([]);
    setSelectedChat(null);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setChats(chat.messages);
  };

  const handleDeleteChat = (chatId) => {
    setHistory(history.filter((chat) => chat.id !== chatId));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white w-full flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="sm:w-[300px] w-full bg-gray-800 text-white p-6 flex flex-col shadow-lg flex-shrink-0 sm:h-auto h-[60vh]">
        <button
          onClick={handleNewChat}
          className="bg-blue-600 w-full py-4 px-6 rounded-lg text-white text-lg font-semibold mb-6 hover:bg-blue-500 transition"
        >
          <Plus size={20} className="inline-block mr-1" /> New Chat
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history..."
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
        />
        <div className="flex-grow space-y-2 overflow-y-auto max-h-[40vh] sm:max-h-full">
          {history
            .filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center text-lg font-medium ${
                  selectedChat?.id === chat.id ? "bg-blue-600" : "bg-blue-500"
                } hover:bg-blue-400 transition`}
                onClick={() => handleSelectChat(chat)}
              >
                <span>{chat.name}</span>
                <Trash
                  size={20}
                  className="cursor-pointer hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                />
              </div>
            ))}
        </div>
      </aside>

      {/* Chat Container */}
      <div className="flex flex-col flex-grow bg-gray-900">
        <div
          ref={chatContainerRef}
          className="flex-grow p-6 space-y-4 rounded-lg mx-auto w-full sm:w-[85%] max-h-[70vh] overflow-y-auto"
        >
          {chats.map((chat, index) => (
            <div key={index} className={`flex w-full ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-4 max-w-[90%] sm:max-w-[70%] break-words rounded-lg ${
                  chat.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                }`}
                dangerouslySetInnerHTML={{ __html: chat.text }}
              ></div>
            </div>
          ))}
          {loading && <div className="p-4 bg-gray-700 text-white rounded-lg animate-pulse">Typing...</div>}
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex items-center bg-gray-800 rounded-full border-t mx-auto w-full sm:w-[85%] mb-4">

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white w-full"
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