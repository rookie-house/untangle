import { useState, useEffect } from "react";
import { Sparkles, Camera, Zap } from "lucide-react";
import "./App.css";

export default function App() {
  const [screenshotCaptured, setScreenshotCaptured] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ userId: string; userName: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await chrome.runtime.sendMessage({ action: "checkAuthStatus" });
    };
    checkAuth();

    const listener = (message: any) => {
      if (message.action === "authStatusResponse") {
        setIsAuthenticated(message.payload.isAuthenticated);
        setUser(message.payload.user || null);
        setIsLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const handleDemystify = async () => {
    if (isAuthenticated) {
      try {
        const [activeTab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (activeTab && activeTab.id) {
          await chrome.sidePanel.open({ tabId: activeTab.id });
        }
      } catch (error) {
        console.error("Error opening side panel:", error);
        alert("Could not open side panel. Are you on a valid webpage?");
      }
    }
  };

  const handleLogin = () => {
    const loginUrl = "https://untangle.rookie.house/";
    chrome.tabs.create({ url: loginUrl });
  };

  const handleScreenshot = () => {
    setScreenshotCaptured(true);
    setTimeout(() => setScreenshotCaptured(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="popup-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="popup-container auth-container">
        <h2 className="auth-title">Please Log In</h2>
        <p>Access your user data and features.</p>
        <button onClick={handleLogin} className="action-btn primary-btn">
          <span>Log In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="logo-container">
          <div className="logo">
            <Zap size={24} className="logo-icon" />
          </div>
          <div className="company-info">
            <h1 className="company-name">Your Company</h1>
            <p className="tagline">Welcome, {user?.userName}!</p>
          </div>
        </div>
      </header>

      <div className="actions-container">
        <button onClick={handleDemystify} className="action-btn primary-btn">
          <Sparkles size={18} />
          <span>Demystify</span>
        </button>
        <button onClick={handleScreenshot} className="action-btn secondary-btn">
          <Camera size={18} />
          <span>Screenshot</span>
        </button>
      </div>

      {screenshotCaptured && (
        <div className="status-message success">
          ✓ Screenshot captured successfully!
        </div>
      )}
    </div>
  );
}
