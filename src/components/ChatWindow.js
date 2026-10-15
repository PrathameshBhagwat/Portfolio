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

// Helper function to render clean and safe markdown elements
function parseMarkdown(text) {
  if (!text) return "";
  
  const lines = text.split("\n");
  const parsedElements = [];
  let currentList = [];
  let listType = "ul"; // 'ul' or 'ol'
  
  const parseInline = (str) => {
    if (!str) return [];
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const tokens = str.split(regex);
    
    return tokens.map((token, idx) => {
      if (!token) return null;
      if (token.startsWith("**") && token.endsWith("**")) {
        return <strong key={idx}>{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={idx}
            style={{
              backgroundColor: "rgba(249, 115, 22, 0.12)",
              color: "var(--accent-orange)",
              padding: "0.15rem 0.35rem",
              borderRadius: "4px",
              fontSize: "0.85em",
              fontFamily: "monospace"
            }}
          >
            {token.slice(1, -1)}
          </code>
        );
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

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === "ol") {
        parsedElements.push(<ol key={`list-${parsedElements.length}`} style={{ paddingLeft: "1.2rem", margin: "0.3rem 0" }}>{currentList}</ol>);
      } else {
        parsedElements.push(<ul key={`list-${parsedElements.length}`} style={{ paddingLeft: "1.2rem", margin: "0.3rem 0" }}>{currentList}</ul>);
      }
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith("# ")) {
      flushList();
      parsedElements.push(<h3 key={index} style={{ margin: "0.5rem 0 0.25rem", fontWeight: "700" }}>{parseInline(trimmed.substring(2))}</h3>);
      return;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      parsedElements.push(<h3 key={index} style={{ margin: "0.5rem 0 0.25rem", fontWeight: "700" }}>{parseInline(trimmed.substring(3))}</h3>);
      return;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      parsedElements.push(<h3 key={index} style={{ margin: "0.4rem 0 0.2rem", fontWeight: "700" }}>{parseInline(trimmed.substring(4))}</h3>);
      return;
    }
    if (trimmed.startsWith("#### ")) {
      flushList();
      parsedElements.push(<h4 key={index} style={{ margin: "0.3rem 0 0.15rem", fontWeight: "600" }}>{parseInline(trimmed.substring(5))}</h4>);
      return;
    }
    
    // Numbered list item: 1. Item
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      currentList.push(<li key={`li-${index}`}>{parseInline(numMatch[2])}</li>);
      return;
    }

    // Bullet list item: - Item or * Item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      currentList.push(<li key={`li-${index}`}>{parseInline(trimmed.substring(2))}</li>);
      return;
    }
    
    if (trimmed === "") {
      flushList();
      return;
    }
    
    flushList();
    parsedElements.push(<p key={index} style={{ margin: "0.25rem 0" }}>{parseInline(line)}</p>);
  });
  
  flushList();
  return parsedElements;
}

// Sub-component for individual Message bubble
function MessageBubble({ message, onAction, isTyping }) {
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
        {isUser ? (
          message.text
        ) : message.text ? (
          parseMarkdown(message.text)
        ) : (
          <div className={styles.typingIndicator}>
            <span />
            <span />
            <span />
          </div>
        )}
        
        {/* Copy button for Assistant messages */}
        {!isUser && message.text && (
          <button 
            className={styles.headerBtn} 
            onClick={handleCopy}
            style={{ position: "absolute", top: "4px", right: "4px", opacity: 0.6, padding: "2px" }}
            title="Copy Message"
            aria-label="Copy message text"
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
                disabled={isTyping}
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
      try {
        const parsed = JSON.parse(savedChat);
        // If history contains only connection errors from past bugs, clear them out
        const hasOnlyErrors = Array.isArray(parsed) && parsed.every(m => m.id?.startsWith("err-msg") || m.text === t.ai_error_connection);
        if (hasOnlyErrors || !Array.isArray(parsed) || parsed.length === 0) {
          localStorage.removeItem("portfolio_chat_history");
        } else {
          setTimeout(() => setMessages(parsed), 0);
          return;
        }
      } catch (e) {
        localStorage.removeItem("portfolio_chat_history");
      }
    }

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
  }, [lang, t.ai_welcome, t.ai_sug_1, t.ai_sug_2, t.ai_error_connection]);

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
      // Target selector normalization for different model aliases
      const targetMap = {
        "#projects": "#project",
        "#project": "#project",
        "#toolbox": "#skills",
        "#skills": "#skills",
        "#timeline": "#education",
        "#education": "#education",
        "#certifications": "#certificates",
        "#certificate": "#certificates",
        "#certificates": "#certificates",
        "#hero": "#home",
        "#home": "#home",
        "#about": "#about",
        "#contact": "#contact",
        "#experience": "#experience"
      };
      const rawTarget = (action.target || "").trim();
      const normalizedTarget = targetMap[rawTarget.toLowerCase()] || rawTarget;
      smoothScrollTo(normalizedTarget, { offset: -80 });
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
    if (!text || isTyping) return;

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
      
      let accumulatedText = "";
      let incomingActions = [];
      let pendingRaf = null;
      let sseBuffer = "";
      
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

      const flushToState = () => {
        const currentText = accumulatedText;
        const currentActions = incomingActions;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamMsgId
              ? { 
                  ...msg, 
                  text: currentText, 
                  ...(currentActions.length > 0 ? { actions: currentActions } : {}) 
                }
              : msg
          )
        );
        pendingRaf = null;
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (pendingRaf) cancelAnimationFrame(pendingRaf);
          flushToState();
          break;
        }

        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split("\n");
        sseBuffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine || !cleanLine.startsWith("data: ")) continue;
          const dataStr = cleanLine.slice(6).trim();
          if (!dataStr || dataStr === "[DONE]") continue;

          try {
            const data = JSON.parse(dataStr);
            if (data.type === "text") {
              accumulatedText += data.content;
              if (!pendingRaf) {
                pendingRaf = requestAnimationFrame(flushToState);
              }
            } else if (data.type === "actions") {
              incomingActions = data.actions;
              flushToState();
            }
          } catch (e) {
            console.error("Error parsing stream chunk:", e);
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
    } finally {
      setIsTyping(false);
    }
  }, [inputVal, isTyping, messages, settings.language, t.ai_error_connection]);

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
          <MessageBubble key={msg.id} message={msg} onAction={handleAction} isTyping={isTyping} />
        ))}
        {isTyping && !messages.some(m => m.sender === "assistant" && m.text === "") && (
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
            disabled={isTyping}
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
