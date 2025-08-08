import { useState, useRef } from "react";
import { v4 as uuid } from "uuid";

const url =
  process.env.REACT_APP_API_URL

export default function useChat(threadId, rollNumber) {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  function preprocessMessage(original) {
    const lower = original.toLowerCase();
    const forecastKeywords = [
      "tomorrow",
      "next",
      "forecast",
      "in 1 day",
      "in 2 days",
      "in 3 days",
      "weekend",
      "in next week",
      "in the coming week"
    ];

    if (forecastKeywords.some(keyword => lower.includes(keyword))) {
      return `You are a smart weather assistant. If this is a forecast question, provide the most accurate forecast you can (including rain probability, temperature, wind) for "${original}". If you cannot get real forecast data, give your best possible estimation using reasoning.`;
    }
    return original;
  }

  async function sendMessage(text) {
    if (!text.trim()) return;

    const processedText = preprocessMessage(text);

    const userMsg = {
      id: uuid(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(),
      threadId,
    };

    const tempAgentId = uuid();
    const agentMsg = {
      id: tempAgentId,
      role: "agent-temp",
      content: "",
      timestamp: new Date().toLocaleTimeString(),
      threadId,
    };

    setMessages(prev => [...prev, userMsg, agentMsg]);
    setIsSending(true);
    setError("");
    abortRef.current = new AbortController();

    const body = {
      messages: [{ role: "user", content: processedText }],
      runId: "weatherAgent",
      maxRetries: 3,
      maxSteps: 10,
      temperature: 0.5,
      topP: 1,
      runtimeContext: {},
      threadId: Number(rollNumber) || 60003210080,
      resourceId: "weatherAgent",
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "x-mastra-dev-playground": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value || new Uint8Array(), { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          const trimmed = line.trim();

          if (trimmed.startsWith("0:")) {
            try {
              const parsed = JSON.parse(trimmed.slice(2).trim());
              if (typeof parsed === "string") {
                fullMessage += parsed;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === tempAgentId ? { ...m, content: fullMessage } : m
                  )
                );
              }
            } catch {
              console.warn("Could not parse text chunk:", trimmed);
            }
          } else if (trimmed.startsWith("a:")) {
            try {
              const toolData = JSON.parse(trimmed.slice(2).trim());
              console.log("Structured weather data:", toolData.result);
            } catch {
              console.warn("Could not parse tool data:", trimmed);
            }
          }
        }
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === tempAgentId ? { ...m, role: "agent", content: fullMessage } : m
        )
      );
    } catch (err) {
      console.error("Chat error:", err);
      setError("❌ Failed to fetch response. Please try again.");
      setMessages(prev =>
        prev.map(m =>
          m.id === tempAgentId
            ? { ...m, role: "agent", content: "[Error: " + err.message + "]" }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  function cancelStreaming() {
    abortRef.current?.abort();
    setIsSending(false);
  }

  return { messages, sendMessage, isSending, cancelStreaming, setMessages };
}
