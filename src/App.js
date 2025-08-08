import { useEffect, useRef } from "react";
import MessageBubble from "./components/MessageBubble";
import MessageInput from "./components/MessageInput";
import Loader from "./components/Loader";
import useChat from "./hooks/useChat";
import { useDarkMode } from "./context/DarkModeContext";


function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const threadId = "default-thread"; 
  const { messages, sendMessage, isSending, error } = useChat(threadId);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, [setDarkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "bg-[#1B3C53]" : "bg-white"}`}>

      <header
        className={`flex items-center justify-between transition-colors duration-300 px-4 py-2 shadow
        ${darkMode ? "bg-[#F9F3EF] text-black" : "bg-[#1B3C53] text-[#F9F3EF]"}`}
      >
        <div
          className={`text-xl font-bold transition-colors duration-300
          ${darkMode ? "text-black" : "text-[#F9F3EF]"}`}
        >
          Weather Agent Chat
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 border rounded transition-colors duration-300
            ${darkMode
              ? "bg-[#1B3C53] text-[#F9F3EF] hover:bg-[#456882]"
              : "bg-[#F9F3EF] text-black hover:bg-[#456882]"}`}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </header>

      <div className="flex-1 overflow-y-auto my-4">
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id || i} message={msg} />
          ))}
          {isSending && <Loader />}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="w-full max-w-2xl px-4 pb-4 mx-auto">
        <MessageInput onSend={sendMessage} disabled={isSending} />
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center p-2">{error}</div>
      )}
    </div>
  );
}

export default App;
