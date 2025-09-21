import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App.tsx";

console.log("[UNTANGLE] Content script loaded!", window.location.href);

// Check if we're in an iframe or restricted context
const isInIframe = window !== window.top;
const isRestrictedDomain = ['extension://', 'chrome://', 'moz-extension://'].some(protocol => 
  window.location.href.startsWith(protocol)
);

console.log("[UNTANGLE] Context check:", { isInIframe, isRestrictedDomain });

// Wait for DOM to be ready and create the app
const initializeApp = () => {
  try {
    // Check if our container already exists (avoid duplicate mounting)
    if (document.getElementById("crxjs-app")) {
      console.log("[UNTANGLE] App already mounted, skipping...");
      return;
    }

    if (!document.body) {
      console.log("[UNTANGLE] Body not ready, retrying...");
      setTimeout(initializeApp, 100);
      return;
    }

    console.log("[UNTANGLE] Creating container...");
    const container = document.createElement("div");
    container.id = "crxjs-app";
    
    // Add inline styles as fallback
    container.style.cssText = `
      position: fixed !important;
      right: 20px !important;
      bottom: 20px !important;
      z-index: 2147483647 !important;
      width: auto !important;
      height: auto !important;
      pointer-events: auto !important;
    `;
    
    document.body.appendChild(container);
    console.log("[UNTANGLE] Container added to DOM");
    
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log("[UNTANGLE] Viewport button mounted successfully!");
    
    // Verify the button is actually visible
    setTimeout(() => {
      const button = container.querySelector('.toggle-button');
      if (button) {
        console.log("[UNTANGLE] Button found in DOM:", button);
      } else {
        console.error("[UNTANGLE] Button not found in DOM!");
      }
    }, 1000);
    
  } catch (error) {
    console.error("[UNTANGLE] Error initializing app:", error);
  }
};

// Don't load in iframes or restricted domains
if (!isInIframe && !isRestrictedDomain) {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM is already ready
    initializeApp();
  }
} else {
  console.log("[UNTANGLE] Skipping initialization due to context restrictions");
}
