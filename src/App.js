import { useEffect, useRef } from "react";
import MessageBubble from "./components/MessageBubble";
import MessageInput from "./components/MessageInput";
import Loader from "./components/Loader";
import useChat from "./hooks/useChat";

function App() {
  const threadId = "default-thread"; // you can support multiple threads later
  const { messages, sendMessage, isSending, error } = useChat(threadId);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#1B3C53] text-white p-4 text-xl font-bold shadow">
        Weather Agent Chat
      </header>

      <main className="flex-1 overflow-y-auto p-4 py-10 space-y-2">
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id || i} message={msg} />
        ))}
        {isSending && <Loader />}
        <div ref={chatEndRef} />
      </main>

      <MessageInput onSend={sendMessage} disabled={isSending} />

      {error && (
        <div className="text-red-600 text-sm text-center p-2">{error}</div>
      )}
    </div>
  );
}

export default App;
