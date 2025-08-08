import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { useDarkMode } from "../context/DarkModeContext"; // adjust path as needed

const MessageInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");
  const { darkMode } = useDarkMode(); // use context here

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`relative mx-auto w-full border rounded-3xl transition-colors duration-300 ${darkMode ? "border-none bg-[#456882]" : "border-gray-300 bg-white"
        }`}
      style={{
        boxShadow:
          "0 4px 6px rgba(0, 0, 0, 0.1), -4px 0 6px rgba(0, 0, 0, 0.1), 4px 0 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <textarea
        rows={3}
        className={`w-full p-4 pr-12 rounded-3xl resize-none transition-colors duration-300
    ${darkMode
            ? "bg-[#456882] text-white border-[#1B3C53] focus:border-[#1B3C53]"
            : "bg-white text-black border-white focus:border-white"}
    focus:outline-none focus:ring-0
  `}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
      />

      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={`absolute right-3 bottom-3 p-2 rounded-full transition
    ${darkMode ? "bg-white text-black hover:bg-gray-300" : "bg-black text-white hover:bg-gray-700"}
  `}
        aria-label="Send message"
      >

        <FiSend size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
