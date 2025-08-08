import { useDarkMode } from "../context/DarkModeContext";

const MessageBubble = ({ message }) => {
  const { darkMode } = useDarkMode();

  const isUser = message.role === "user";
  const align = isUser ? "justify-end" : "justify-start";

  const bubbleColor = isUser
    ? darkMode
      ? "bg-gray-300 text-black"
      : "bg-gray-100 text-black"
    : darkMode
      ? "bg-gray-800 text-gray-200"
      : "bg-white text-black";

  // const timestampColor = darkMode ? "text-gray-400" : "text-gray-500";

  const bubbleWidth = isUser ? "w-3/4" : "w-full";

  const bubbleShadow = isUser ? "shadow" : "";

  return (
    <div className={`flex ${align}`}>
      <div
        className={` rounded-lg ${message.role === "agent" ? "p-3" : "pr-10 p-3"
            } ${bubbleWidth} ${bubbleColor} ${bubbleShadow} transition-colors duration-300`}
      >
        <div
          className={`whitespace-pre-line ${message.role === "agent" ? "leading-[2.5]" : "leading-relaxed"
            }`}
        >{message.content}</div>
        {/* <div className={`text-[10px] mt-1 text-right ${timestampColor}`}>
          {message.timestamp}
        </div> */}
      </div>
    </div>
  );
};

export default MessageBubble;
