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
      } else if (message.action === "chatResponse" && message.payload) {
        setMessages((prevMessages) => {
          const filteredMessages = prevMessages.filter(
            (msg) => msg.type !== "loading"
          );
          return [
            ...filteredMessages,
            { type: "llm", text: message.payload.text },
          ];
        });
      } else if (message.action === "screenshotResponse" && message.payload) {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Add user message showing file upload
        setMessages((prev) => [
          ...prev,
          { type: "user", text: `📁 Uploaded file: ${file.name}` },
          { type: "loading", text: "" },
        ]);

        // Simulate processing and generate demo response
        setTimeout(() => {
          const demoResponse = generateDemoResponse(file.name);
          setMessages((prev) => {
            const filteredMessages = prev.filter(msg => msg.type !== "loading");
            return [
              ...filteredMessages,
              { type: "llm", text: demoResponse }
            ];
          });

          // Trigger random highlighting on the page
          chrome.runtime.sendMessage({
            action: "highlightRandomText",
            payload: { fileName: file.name }
          });
        }, 1500);
      };
      
      if (file.type.startsWith('text/')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const generateDemoResponse = (fileName: string): string => {
    const responses = [
      `🔍 **Analysis of ${fileName}:**\n\n✨ **Key Insights:**\n• This document contains valuable information about project requirements\n• Found 3 important action items that need attention\n• Detected potential compliance issues in sections 2-4\n• Recommended next steps: Review with legal team\n\n📊 **Summary:** This file appears to be a critical business document with high priority items.`,
      
      `📋 **File Summary for ${fileName}:**\n\n🎯 **Important Findings:**\n• Document contains financial data requiring secure handling\n• 5 key performance indicators identified\n• Risk assessment shows medium-high priority\n• Stakeholder approval needed for next phase\n\n💡 **AI Recommendation:** Schedule review meeting within 48 hours.`,
      
      `🔎 **Document Intelligence Results:**\n\n🚀 **Key Highlights:**\n• Technical specifications meet current standards\n• Implementation timeline: 2-3 weeks estimated\n• Resource allocation appears optimal\n• Quality assurance checkpoints established\n\n⚡ **Action Required:** Begin phase 1 implementation immediately.`,
      
      `📄 **Content Analysis Complete:**\n\n🎪 **Notable Elements:**\n• Strategic planning document with Q4 objectives\n• Budget allocation requires CFO approval\n• Cross-department collaboration needed\n• Success metrics clearly defined\n\n🔔 **Priority Level:** High - Requires executive review.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
            placeholder="Type a message or upload a file..."
          />
          <input
            type="file"
            id="file-upload"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            accept=".txt,.pdf,.doc,.docx,.json,.csv,.md"
          />
          <button
            onClick={() => document.getElementById("file-upload")?.click()}
            className="file-upload-btn"
            title="Upload File"
          >
            📁
          </button>
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
