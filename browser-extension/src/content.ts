console.log("🚀 content.ts loaded on", window.location.href);

window.addEventListener("message", (event) => {
  console.log("🟢 Content script received window message:", event);

  // if (event.origin !== "https://untangle.rookie.house") {
  //   console.warn("Blocked message from origin:", event.origin);
  //   return;
  // }

  if (event.data.type === "SAVE_TO_EXTENSION") {
    console.log("🟠 Forwarding token to service worker:", event.data.token);
    chrome.runtime.sendMessage(
      {
        action: "SAVE_TOKEN",
        token: event.data.token,
      },
      (response) => {
        console.log("🟡 Got response from service worker:", response);
      }
    );
  }
});
