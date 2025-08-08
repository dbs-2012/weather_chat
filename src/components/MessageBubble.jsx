const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  const align = isUser ? "justify-end" : "justify-start";
  const bubbleColor = isUser ? "bg-[#456882] text-white" : "bg-white text-black";

  return (
    <div className={`flex ${align}`}>
      <div className={`max-w-xs p-3 rounded-xl shadow ${bubbleColor}`}>
        <div>{message.content}</div>
        <div className="text-[10px] mt-1 text-gray-400 text-right">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
