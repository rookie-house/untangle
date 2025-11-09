// src/service_worker.ts

// import api from "./lib/api/api";

import { analyzeLegalDocument } from './lib/demo-ai.agent/agents';
import { highlightPhrases as _highlightPhrases } from './lib/highLight';

chrome.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.action) {
    case "checkAuthStatus":
      try {
        const { access_token } = await chrome.storage.local.get("access_token");

        if (access_token) {
          // api.getAxios().interceptors.request.use(async (config) => {
          //   config.headers.Authorization = `Bearer ${access_token}`;
          //   return config;
          // });

          // const userDetails = await api.auth.ping();

          chrome.runtime.sendMessage({
            action: "authStatusResponse",
            payload: {
              isAuthenticated: true,
              user: {
                userDetails:"xyz",
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
    case "SAVE_TOKEN":
      console.log("Received SAVE_TOKEN in service worker:", message.token);
      chrome.storage.local.set({ access_token: message.token }, () => {
        console.log("Token saved successfully in chrome.storage.local");
      });
      break;
    case "demistifyRequest":
      try {
        const { tabId } = message;
        console.log("Service Worker received initial request for tab ID:", tabId);
        console.log("Sender info:", sender);

        const scraperFunction = () => {
          const title = document.title;
          const bodyText = document.body ? document.body.innerText : "No body found.";
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

        const scrapedData = executionResult.result as { title: string; bodyText: string; url?: string };
        console.log("Scraping successful. Data length:", (scrapedData.bodyText || '').length);

        // Analyze the scraped content locally
        const analysis = analyzeLegalDocument({ title: scrapedData.title || '', bodyText: scrapedData.bodyText || '', url: scrapedData.url });

        // Send the explanation back to the UI
        chrome.runtime.sendMessage({
          action: "demistifyResponse",
          payload: {
            text: analysis.explanation,
            confidence: analysis.confidence,
            highlights: analysis.highlights,
          },
        });

        // Trigger highlighting in the page for the returned phrases
        try {
          if (analysis.highlights && analysis.highlights.length > 0) {
            // we can call our local helper which itself uses scripting.executeScript
            await _highlightPhrases(analysis.highlights);
            console.log('Highlights injected:', analysis.highlights.length);
          }
        } catch (hlErr) {
          console.error('Error injecting highlights:', hlErr);
        }
      } catch (error) {
        console.error("Service Worker Error during demistify:", error);
        chrome.runtime.sendMessage({
          action: "demistifyResponse",
          payload: {
            text: `Error: ${typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : "An unknown error occurred."}`,
          },
        });
      }
      break;

    case "chatRequest":
      try {
        const { text } = message.payload;
        console.log("Processing chat request:", text);
        
        // Simulate processing delay
        setTimeout(() => {
          const demoResponses = [
            `🤖 **AI Analysis:** Your message "${text}" has been processed. Here are some insights:\n\n• Detected sentiment: Positive\n• Key topics identified: 2\n• Relevance score: 85%\n\n💡 **Suggestion:** Consider expanding on the main points mentioned.`,
            
            `📊 **Smart Response:** Based on your input "${text}", I've analyzed the content:\n\n• Context understanding: High\n• Action items detected: 1\n• Priority level: Medium\n\n🎯 **Next Steps:** Would you like me to elaborate on any specific aspect?`,
            
            `🔍 **Deep Dive:** Your query "${text}" reveals interesting patterns:\n\n• Complexity level: Moderate\n• Related concepts found: 3\n• Confidence score: 92%\n\n✨ **Insight:** This topic connects well with recent trends in the field.`
          ];
          
          const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
          
          chrome.runtime.sendMessage({
            action: "chatResponse",
            payload: { text: randomResponse }
          });
        }, 1000);
        
      } catch (error) {
        console.error("Error processing chat request:", error);
        chrome.runtime.sendMessage({
          action: "chatResponse", 
          payload: { text: "Sorry, I encountered an error processing your request." }
        });
      }
      break;

    case "takeScreenshot":
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab && activeTab.id) {
          const dataUrl = await chrome.tabs.captureVisibleTab(activeTab.windowId, { format: "png" });
          
          // Simulate screenshot analysis
          setTimeout(() => {
            const screenshotAnalysis = `📸 **Screenshot Analysis Complete:**\n\n🔍 **Visual Elements Detected:**\n• UI components: 12\n• Text blocks: 8\n• Interactive elements: 5\n• Images/graphics: 3\n\n📋 **Page Insights:**\n• Layout quality: Good\n• Accessibility score: 78%\n• Mobile responsiveness: Detected\n\n💡 **Recommendations:**\n• Consider improving contrast in header area\n• Some buttons could be larger for better UX`;
            
            chrome.runtime.sendMessage({
              action: "screenshotResponse", 
              payload: { 
                text: screenshotAnalysis,
                imageData: dataUrl
              }
            });
          }, 1500);
        }
      } catch (error) {
        console.error("Error taking screenshot:", error);
      }
      break;

    case "highlightRandomText":
      try {
        const { tabId } = await chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => ({ tabId: tabs[0]?.id }));
        
        if (tabId) {
          const highlightFunction = () => {
            // Remove any existing highlights
            const existingHighlights = document.querySelectorAll('.untangle-highlight');
            existingHighlights.forEach(el => {
              const parent = el.parentNode;
              if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent || ''), el);
                parent.normalize();
              }
            });

            // Find text nodes and highlight random ones
            const walker = document.createTreeWalker(
              document.body,
              NodeFilter.SHOW_TEXT,
              {
                acceptNode: (node) => {
                  const text = node.textContent?.trim() || '';
                  return text.length > 20 && 
                         !node.parentElement?.closest('script, style, noscript, iframe') &&
                         text.split(' ').length > 3 
                         ? NodeFilter.FILTER_ACCEPT 
                         : NodeFilter.FILTER_REJECT;
                }
              }
            );

            const textNodes: Text[] = [];
            let node;
            while (node = walker.nextNode()) {
              textNodes.push(node as Text);
            }

            // Randomly select 3-5 text nodes to highlight
            const numHighlights = Math.min(Math.floor(Math.random() * 3) + 3, textNodes.length);
            const selectedNodes = textNodes
              .sort(() => 0.5 - Math.random())
              .slice(0, numHighlights);

            selectedNodes.forEach(textNode => {
              const text = textNode.textContent || '';
              const words = text.split(' ');
              
              if (words.length > 5) {
                // Highlight a random phrase of 2-4 words
                const startIndex = Math.floor(Math.random() * (words.length - 4));
                const phraseLength = Math.floor(Math.random() * 3) + 2;
                const phrase = words.slice(startIndex, startIndex + phraseLength).join(' ');
                
                const beforeText = words.slice(0, startIndex).join(' ');
                const afterText = words.slice(startIndex + phraseLength).join(' ');
                
                const highlight = document.createElement('span');
                highlight.className = 'untangle-highlight';
                highlight.style.cssText = `
                  background: linear-gradient(120deg, rgba(255, 255, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%);
                  padding: 2px 4px;
                  border-radius: 3px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  font-weight: 500;
                  animation: highlight-pulse 2s ease-in-out;
                `;
                highlight.textContent = phrase;
                
                const fragment = document.createDocumentFragment();
                if (beforeText) fragment.appendChild(document.createTextNode(beforeText + ' '));
                fragment.appendChild(highlight);
                if (afterText) fragment.appendChild(document.createTextNode(' ' + afterText));
                
                textNode.parentNode?.replaceChild(fragment, textNode);
              }
            });

            // Add CSS animation if not exists
            if (!document.getElementById('untangle-highlight-styles')) {
              const style = document.createElement('style');
              style.id = 'untangle-highlight-styles';
              style.textContent = `
                @keyframes highlight-pulse {
                  0% { background: rgba(255, 255, 0, 0.6); transform: scale(1.02); }
                  50% { background: rgba(255, 165, 0, 0.4); }
                  100% { background: rgba(255, 255, 0, 0.3); transform: scale(1); }
                }
              `;
              document.head.appendChild(style);
            }

            return `Highlighted ${numHighlights} text sections on the page`;
          };

          const [result] = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: highlightFunction,
          });

          console.log('Highlighting result:', result?.result);
        }
      } catch (error) {
        console.error('Error highlighting text:', error);
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
