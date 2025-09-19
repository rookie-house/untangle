import { useEffect, useState } from "react";
import "./App.css";

interface Message {
  type: "demistify" | "user" | "llm" | "loading" | "error" | "info";
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await chrome.runtime.sendMessage({ action: "checkAuthStatus" });
    };
    init();

    const listener = (message: any) => {
      if (message.action === "authStatusResponse") {
        const authStatus = message.payload.isAuthenticated;
        setIsAuthenticated(authStatus);
        setIsLoading(false);

        if (authStatus) {
          const sendInitialRequest = async () => {
            try {
              const [activeTab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
              });
              if (activeTab && activeTab.id) {
                setMessages([{ type: "loading", text: "" }]);
                chrome.runtime.sendMessage({
                  action: "demistifyRequest",
                  tabId: activeTab.id,
                });
              }
            } catch (error) {
              console.error(
                "Error sending initial message from side panel:",
                error
              );
              setMessages([
                { type: "demistify", text: "Error: Could not start process." },
              ]);
            }
          };
          sendInitialRequest();
        } else {
          setMessages([
            { type: "info", text: "Please log in to use this feature." },
          ]);
        }
      } else if (message.action === "demistifyResponse" && message.payload) {
        setMessages((prevMessages) => {
          const filteredMessages = prevMessages.filter(
            (msg) => msg.type !== "loading"
          );
          return [
            ...filteredMessages,
            { type: "llm", text: message.payload.text },
          ];
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const handleLogin = () => {
    const loginUrl = "https://untangle.rookie.house/";
    chrome.tabs.create({ url: loginUrl });
  };

  const handleScreenshot = () => {
    chrome.runtime.sendMessage({
      action: "takeScreenshot",
    });
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: input },
        { type: "loading", text: "" },
      ]);

      chrome.runtime.sendMessage({
        action: "chatRequest",
        payload: { text: input },
      });

      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="chat-panel">
        <div className="chat-messages">
          <div className="loading-message">
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="chat-panel auth-panel">
        <h2 className="auth-title">Authentication Required</h2>
        <p>Log in to begin your chat.</p>
        <button onClick={handleLogin} className="action-btn primary-btn">
          <span>Log In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((msg, idx) =>
          msg.type === "loading" ? (
            <div key={idx} className="loading-message">
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          ) : (
            <div
              key={idx}
              className={`chat-message ${msg.type === "user" ? "user-message" : "demistify-message"}`}
            >
              {msg.text}
            </div>
          )
        )}
      </div>
      <div className="chat-input-row">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat-input"
            placeholder="Type a message or take a screenshot..."
          />
          <button
            onClick={handleScreenshot}
            className="screenshot-btn"
            title="Take Screenshot"
          >
            <div className="screenshot-icon"></div>
          </button>
        </div>
        <button onClick={handleSend} className="chat-send-btn">
          Send
        </button>
      </div>
    </div>
  );
}
