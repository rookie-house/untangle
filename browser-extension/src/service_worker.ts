// src/service_worker.ts

import api from "./lib/api/api";

chrome.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.action) {
    case "checkAuthStatus":
      try {
        const { access_token } = await chrome.storage.local.get("access_token");

        if (access_token) {
          api.getAxios().interceptors.request.use(async (config) => {
            config.headers.Authorization = `Bearer ${access_token}`;
            return config;
          });

          const userDetails = await api.auth.ping();

          chrome.runtime.sendMessage({
            action: "authStatusResponse",
            payload: {
              isAuthenticated: true,
              user: {
                userDetails,
              },
            },
          });
        } else {
          chrome.runtime.sendMessage({
            action: "authStatusResponse",
            payload: {
              isAuthenticated: false,
            },
          });
        }
      } catch (error) {
        console.error("API check failed:", error);
        chrome.runtime.sendMessage({
          action: "authStatusResponse",
          payload: {
            isAuthenticated: false,
          },
        });
      }
      break;
    case "demistifyRequest":
      try {
        const { tabId } = message;
        console.log(
          "Service Worker received initial request for tab ID:",
          tabId
        );
        console.log("Sender info:", sender);
        const scraperFunction = () => {
          console.log("Scraping script injected and running.");
          const title = document.title;
          const bodyText = document.body
            ? document.body.innerText
            : "No body found.";
          const url = window.location.href;
          return { title, bodyText, url };
        };

        const [executionResult] = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: scraperFunction,
        });

        if (!executionResult || !executionResult.result) {
          throw new Error("Failed to get scraped data.");
        }

        const scrapedData = executionResult.result;
        console.log("Scraping successful. Data:", scrapedData);

        const simulatedApiResponse = `This is a simple demystification of "${scrapedData.title}". It discusses [a few key points from the scraped text].`;

        chrome.runtime.sendMessage({
          action: "demistifyResponse",
          payload: {
            text: simulatedApiResponse,
          },
        });
      } catch (error) {
        console.error("Service Worker Error during demistify:", error);
        chrome.runtime.sendMessage({
          action: "demistifyResponse",
          payload: {
            text: `Error: ${
              typeof error === "object" && error !== null && "message" in error
                ? (error as { message?: string }).message
                : "An unknown error occurred."
            }`,
          },
        });
      }
      break;

    case "openSidePanelRequest":
      if (sender.tab && sender.tab.id) {
        try {
          await chrome.sidePanel.open({ tabId: sender.tab.id });
          console.log(`Side panel opened for tab ID: ${sender.tab.id}`);
        } catch (error) {
          console.error("Error opening side panel:", error);
        }
      } else {
        console.error("Could not determine sender tab ID.");
      }
      return;

    default:
      console.warn("Unknown action received:", message.action);
      break;
  }
});
