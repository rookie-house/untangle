import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log("[UNTANGLE] App component mounted");
  }, []);
  
  const openSidePanel = async () => {
    try {
      console.log("[UNTANGLE] Button clicked, sending message...");
      const response = await chrome.runtime.sendMessage({
        action: "openSidePanelRequest",
      });
      console.log("[UNTANGLE] Message sent successfully, response:", response);
    } catch (error) {
      console.error("[UNTANGLE] Error sending message:", error);
      // Show user-friendly error
      alert("Could not open sidepanel. Please refresh the page and try again.");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <button 
      className="toggle-button" 
      onClick={openSidePanel}
      title="Open Untangle Sidepanel"
      aria-label="Open Untangle Sidepanel"
      style={{
        // Inline styles as fallback
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 2147483647,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #288cd7, #1e6aa3)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      }}
    >
      📋
    </button>
  );
}

export default App;
