"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiTrash2, FiX, FiClipboard, FiCheck, FiSliders, FiGlobe } from "react-icons/fi";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { useSpeechSynthesis } from "../context/SpeechContext";
import { translations } from "../data/translations";
import SpeechSettings from "./SpeechSettings";
import MessageSpeechPlayer from "./MessageSpeechPlayer";
import styles from "./AIAssistant.module.css";

// Helper function to render simple markdown safe elements
function parseMarkdown(text) {
  if (!text) return "";
  
  const lines = text.split("\n");
  const parsedElements = [];
  let currentList = [];
  
  const parseInline = (str) => {
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const tokens = str.split(regex);
    
    return tokens.map((token, idx) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return <strong key={idx}>{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith("[") && token.includes("](")) {
        const midIdx = token.indexOf("](");
        const label = token.slice(1, midIdx);
        const url = token.slice(midIdx + 2, -1);
        return (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-orange)", textDecoration: "underline", fontWeight: "600" }}
          >
            {label}
          </a>
        );
      }
      return token;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith("#### ")) {
      if (currentList.length > 0) {
        parsedElements.push(<ul key={`list-${index}`}>{currentList}</ul>);
        currentList = [];
      }
      parsedElements.push(<h4 key={index}>{parseInline(trimmed.substring(5))}</h4>);
      return;
    }
    
    if (trimmed.startsWith("### ")) {
      if (currentList.length > 0) {
        parsedElements.push(<ul key={`list-${index}`}>{currentList}</ul>);
        currentList = [];
      }
      parsedElements.push(<h3 key={index}>{parseInline(trimmed.substring(4))}</h3>);
      return;
    }
    
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(<li key={`li-${index}`}>{parseInline(trimmed.substring(2))}</li>);
      return;
    }
    
    if (trimmed === "") {
      if (currentList.length > 0) {
        parsedElements.push(<ul key={`list-${index}`}>{currentList}</ul>);
        currentList = [];
      }
      return;
    }
    
    if (currentList.length > 0) {
      parsedElements.push(<ul key={`list-${index}`}>{currentList}</ul>);
      currentList = [];
    }
    parsedElements.push(<p key={index}>{parseInline(line)}</p>);
  });
  
  if (currentList.length > 0) {
    parsedElements.push(<ul key={`final-list`}>{currentList}</ul>);
  }
  
  return parsedElements;
}

// Sub-component for individual Message bubble
function MessageBubble({ message, onAction }) {
  const [copied, setCopied] = useState(false);
  const { speakingMsgId } = useSpeechSynthesis();
  const isUser = message.sender === "user";
  const isSpeakingThis = speakingMsgId === message.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightClass = isSpeakingThis ? styles.speechHighlight : "";

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userWrapper : styles.assistantWrapper}`}>
      <div 
        className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.assistantBubble} ${highlightClass}`}
        style={{ transition: "all 0.3s ease" }}
      >
        {isUser ? message.text : parseMarkdown(message.text)}
        
        {/* Copy button for Assistant messages */}
        {!isUser && message.text && (
          <button 
            className={styles.headerBtn} 
            onClick={handleCopy}
            style={{ position: "absolute", top: "4px", right: "4px", opacity: 0.6, padding: "2px" }}
            title="Copy Message"
          >
            {copied ? <FiCheck size={14} style={{ color: "#22c55e" }} /> : <FiClipboard size={14} />}
          </button>
        )}

        {/* Voice Controls for Assistant messages */}
        {!isUser && message.text && (
          <MessageSpeechPlayer messageId={message.id} text={message.text} />
        )}

        {/* Dynamic Action Buttons inside response */}
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className={styles.actionGroup}>
            {message.actions.map((act, index) => (
              <button 
                key={index} 
                className={styles.actionBtn} 
                onClick={() => onAction(act)}
              >
                {act.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <span className={styles.messageTime}>{message.time}</span>
    </div>
  );
}

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const smoothScrollTo = useSmoothScroll();
  const { stop, settings } = useSpeechSynthesis();

  const lang = settings?.language || "en";
  const t = translations[lang];

  const suggestions = [
    t.ai_sug_1,
    t.ai_sug_3,
    t.ai_sug_4,
    t.ai_sug_2,
    t.ai_sug_5
  ];

  // Initialize welcome message
  useEffect(() => {
    const savedChat = localStorage.getItem("portfolio_chat_history");
    if (savedChat) {
      setTimeout(() => setMessages(JSON.parse(savedChat)), 0);
    } else {
      const welcomeMsg = {
        id: "welcome",
        sender: "assistant",
        text: t.ai_welcome,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: t.ai_sug_1, type: "text", value: t.ai_sug_1 },
          { label: t.ai_sug_2, type: "download", url: "/assets/Prathamesh_Bhagwat_Resume.pdf" }
        ]
      };
      setTimeout(() => setMessages([welcomeMsg]), 0);
    }
  }, [lang, t.ai_welcome, t.ai_sug_1, t.ai_sug_2]);

  // Save chat to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("portfolio_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAction = (action) => {
    if (action.type === "scroll") {
      if (window.innerWidth <= 480 && onClose) {
        onClose();
      }
      smoothScrollTo(action.target, { offset: -80 });
    } else if (action.type === "download") {
      const link = document.createElement("a");
      link.href = action.url;
      link.setAttribute("download", action.url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (action.type === "link") {
      window.open(action.url, "_blank", "noopener,noreferrer");
    } else if (action.type === "text") {
      handleSendMessage(action.value);
    }
  };

  const handleSendMessage = useCallback(async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    if (!textToSend) setInputVal("");

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `user-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender: "user",
      text,
      time
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          language: settings.language
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Accumulate streaming text in a ref to avoid setState on every chunk
      let accumulatedText = "";
      let incomingActions = [];
      let pendingRaf = null;
      
      const streamMsgId = `stream-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Place dummy streaming message
      setMessages((prev) => [
        ...prev,
        {
          id: streamMsgId,
          sender: "assistant",
          text: "",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      setIsTyping(false);

      // Throttled flush: only call setMessages at RAF frequency, not per-chunk
      const flushToState = () => {
        const currentText = accumulatedText;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamMsgId ? { ...msg, text: currentText } : msg
          )
        );
        pendingRaf = null;
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Final flush on stream end
          if (pendingRaf) cancelAnimationFrame(pendingRaf);
          flushToState();
          break;
        }

        const chunkStr = decoder.decode(value);
        const lines = chunkStr.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.type === "text") {
                accumulatedText += data.content;
                // Schedule a RAF flush only if one isn't already pending
                if (!pendingRaf) {
                  pendingRaf = requestAnimationFrame(flushToState);
                }
              } else if (data.type === "actions") {
                incomingActions = data.actions;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamMsgId ? { ...msg, actions: incomingActions } : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing stream chunk:", e);
            }
          }
        }
      }

    } catch (error) {
      console.error("Chat message send failure:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          sender: "assistant",
          text: t.ai_error_connection,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }
  }, [inputVal, messages, settings.language, t.ai_error_connection]);

  const clearChat = () => {
    stop();
    localStorage.removeItem("portfolio_chat_history");
    const welcomeMsg = {
      id: "welcome",
      sender: "assistant",
      text: t.ai_welcome,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: t.ai_sug_1, type: "text", value: t.ai_sug_1 },
        { label: t.ai_sug_2, type: "download", url: "/assets/Prathamesh_Bhagwat_Resume.pdf" }
      ]
    };
    setMessages([welcomeMsg]);
  };

  return (
    <div className={styles.chatWindow}>
      {showVoiceSettings && <SpeechSettings onClose={() => setShowVoiceSettings(false)} />}
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.avatar}>P</div>
          <div className={styles.headerMeta}>
            <span className={styles.headerTitle}>{t.ai_title}</span>
            <span className={styles.headerStatus}>
              <span className={styles.statusDot} />
              {lang === "en" ? "Online" : lang === "hi" ? "ऑनलाइन" : "ऑनलाइन"}
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.headerBtn} 
            onClick={() => setShowVoiceSettings(!showVoiceSettings)} 
            title={lang === "en" ? "Language & Speech Settings" : lang === "hi" ? "भाषा और भाषण सेटिंग्स" : "भाषा आणि भाषण सेटिंग्ज"}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.5rem", borderRadius: "6px", border: "1px solid var(--card-border)", backgroundColor: "var(--input-bg)" }}
          >
            <FiGlobe size={14} />
            <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>{lang === "en" ? "Language" : lang === "hi" ? "भाषा" : "भाषा"}</span>
          </button>
          <button className={styles.headerBtn} onClick={clearChat} title={t.ai_clear}>
            <FiTrash2 size={16} />
          </button>
          <button className={styles.headerBtn} onClick={() => { stop(); onClose(); }} title={lang === "en" ? "Close Chat" : lang === "hi" ? "चैट बंद करें" : "चॅट बंद करा"}>
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messageList} onWheel={(e) => e.stopPropagation()}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onAction={handleAction} />
        ))}
        {isTyping && (
          <div className={`${styles.messageWrapper} ${styles.assistantWrapper}`}>
            <div className={`${styles.messageBubble} ${styles.assistantBubble}`}>
              <div className={styles.typingIndicator}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className={styles.suggestionsContainer}>
        {suggestions.map((sug, idx) => (
          <button 
            key={idx} 
            className={styles.suggestionChip}
            onClick={() => handleSendMessage(sug)}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
        className={styles.chatInputForm}
      >
        <div className={styles.chatInputWrapper}>
          <input
            type="text"
            className={styles.inputField}
            placeholder={t.ai_placeholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
            aria-label="Ask the AI Assistant"
          />
        </div>
        <button 
          type="submit" 
          className={styles.sendBtn}
          disabled={!inputVal.trim() || isTyping}
          aria-label="Send message"
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
}
