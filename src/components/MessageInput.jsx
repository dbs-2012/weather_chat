import { useState } from "react";

const MessageInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex p-4 bg-white shadow-md mx-auto w-1/2 border rounded-xl my-4">
      <input
        type="text"
        className="flex-1 border rounded-l-lg p-2 focus:outline-none"
        placeholder="Ask about the weather..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="bg-[#1B3C53] text-white px-4 py-2 rounded-r-lg hover:bg-[#456882] disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
