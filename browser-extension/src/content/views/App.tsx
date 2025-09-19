import Logo from "@/assets/crx.svg";
import "./App.css";

function App() {
  const openSidePanel = async () => {
    try {
      await chrome.runtime.sendMessage({
        action: "openSidePanelRequest",
      });
      console.log("Request sent to open side panel.");
    } catch (error) {
      console.error("Error sending message:", error);
      alert(
        "Could not send a request to open side panel. See console for details."
      );
    }
  };

  return (
    <button className="toggle-button" onClick={openSidePanel}>
      <img src={Logo} alt="CRXJS logo" className="button-icon" />
    </button>
  );
}

export default App;
