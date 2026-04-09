import React, { useState, useRef, useEffect } from "react";
import { Send, ExternalLink } from "lucide-react";
import { sendMistralMessage } from "../api/mistral";

const renderAIText = (text) => {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/);
    if (match)
      return (
        <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline hover:text-yellow-300 inline-flex items-center gap-1">
          {match[1]} <ExternalLink size={11} />
        </a>
      );
    return <span key={i}>{part}</span>;
  });
};

const ChatView = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      text: "Привет. Пиши свой текст и пообщаемся",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || isSending) return;
    const userText = chatMessage;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatHistory((prev) => [...prev, { role: "user", text: userText, time }]);
    setChatMessage("");
    setIsSending(true);

    try {
      const aiText = await sendMistralMessage(chatHistory, userText);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", text: aiText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    } catch {
      setChatHistory((prev) => [...prev, { role: "assistant", text: "Сбой в сервере. Напиши Андрею, чтобы он починил", time: "ERR" }]);
    } finally {
      setIsSending(false);
      setTimeout(() => chatInputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="flex flex-col h-[520px]">
      <div className="flex-grow overflow-y-auto space-y-3 mb-3 pr-1 custom-scrollbar text-sm">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] p-3 rounded-2xl ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              style={
                msg.role === "user"
                  ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
                  : { background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", boxShadow: "0 0 20px rgba(250,204,21,0.05)" }
              }
            >
              <div className="text-[9px] uppercase font-bold opacity-50 mb-1.5 flex justify-between gap-4 pb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span>{msg.role === "user" ? "Обезьяна" : "Андрюха"}</span>
                <span>{msg.time}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-slate-200">
                {msg.role === "assistant" ? renderAIText(msg.text) : msg.text}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl rounded-tl-sm" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}>
              <div className="flex gap-1.5 items-center px-1">
                {[0, 150, 300].map((delay) => (
                  <div key={delay} className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          ref={chatInputRef}
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          className="flex-grow rounded-xl px-4 py-3 text-sm outline-none transition-all text-white placeholder:text-slate-600"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
          placeholder="Написать сообщение..."
          disabled={isSending}
          autoFocus
        />
        <button disabled={isSending || !chatMessage.trim()} className="px-4 rounded-xl font-bold text-black disabled:opacity-30 transition-all" style={{ background: "linear-gradient(135deg,#ca8a04,#d97706)" }}>
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChatView;
