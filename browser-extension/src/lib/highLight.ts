type HighlightConfig = {
  externalLinks?: string[];
  internalLinks?: string[];
  customHighlights?: {
    selector: string;
    className: string;
    color: string;
    borderColor: string;
  }[];
};

type HighlightOptions = {
  externalColor?: string;
  internalColor?: string;
  externalBorderColor?: string;
  internalBorderColor?: string;
};

async function highlightLinks(
  config: HighlightConfig, 
  options: HighlightOptions = {}
): Promise<void> {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (highlightConfig: HighlightConfig, highlightOptions: HighlightOptions) => {
        // Remove any existing highlights first
        const existingHighlights = document.querySelectorAll('.web-scraper-highlight');
        existingHighlights.forEach(el => {
          el.classList.remove(
            'web-scraper-highlight', 
            'external-link-highlight', 
            'internal-link-highlight'
          );
        });

        // Default colors
        const defaultOptions = {
          externalColor: '#ff6b6b',
          internalColor: '#4ecdc4',
          externalBorderColor: '#ff5252',
          internalBorderColor: '#26a69a',
          ...highlightOptions
        };

        // Add CSS styles for highlighting
        const style = document.createElement('style');
        style.id = 'web-scraper-styles';
        
        // Remove existing styles if they exist
        const existingStyle = document.getElementById('web-scraper-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        let cssRules = `
          .external-link-highlight {
            background-color: ${defaultOptions.externalColor} !important;
            border: 2px solid ${defaultOptions.externalBorderColor} !important;
            border-radius: 3px !important;
            box-shadow: 0 0 5px rgba(255, 107, 107, 0.5) !important;
            transition: all 0.3s ease !important;
            padding: 2px 4px !important;
          }
          .internal-link-highlight {
            background-color: ${defaultOptions.internalColor} !important;
            border: 2px solid ${defaultOptions.internalBorderColor} !important;
            border-radius: 3px !important;
            box-shadow: 0 0 5px rgba(78, 205, 196, 0.5) !important;
            transition: all 0.3s ease !important;
            padding: 2px 4px !important;
          }
          .external-link-highlight:hover {
            background-color: ${defaultOptions.externalBorderColor} !important;
            transform: scale(1.02) !important;
          }
          .internal-link-highlight:hover {
            background-color: ${defaultOptions.internalBorderColor} !important;
            transform: scale(1.02) !important;
          }
        `;

        // Add custom highlight styles if provided
        if (highlightConfig.customHighlights) {
          highlightConfig.customHighlights.forEach((custom, index) => {
            const className = `custom-highlight-${index}`;
            cssRules += `
              .${className} {
                background-color: ${custom.color} !important;
                border: 2px solid ${custom.borderColor} !important;
                border-radius: 3px !important;
                box-shadow: 0 0 5px ${custom.color}80 !important;
                transition: all 0.3s ease !important;
                padding: 2px 4px !important;
              }
              .${className}:hover {
                background-color: ${custom.borderColor} !important;
                transform: scale(1.02) !important;
              }
            `;
          });
        }

        style.textContent = cssRules;
        document.head.appendChild(style);

        let highlightedCount = 0;

        // Highlight external links
        if (highlightConfig.externalLinks) {
          highlightConfig.externalLinks.forEach(linkUrl => {
            const links = document.querySelectorAll(`a[href="${linkUrl}"]`);
            links.forEach(link => {
              link.classList.add('web-scraper-highlight', 'external-link-highlight');
              highlightedCount++;
            });
          });
        }

        // Highlight internal links
        if (highlightConfig.internalLinks) {
          highlightConfig.internalLinks.forEach(linkUrl => {
            const links = document.querySelectorAll(`a[href="${linkUrl}"]`);
            links.forEach(link => {
              link.classList.add('web-scraper-highlight', 'internal-link-highlight');
              highlightedCount++;
            });
          });
        }

        // Apply custom highlights
        if (highlightConfig.customHighlights) {
          highlightConfig.customHighlights.forEach((custom, index) => {
            const elements = document.querySelectorAll(custom.selector);
            elements.forEach(element => {
              element.classList.add('web-scraper-highlight', `custom-highlight-${index}`);
              highlightedCount++;
            });
          });
        }

        console.log(`Highlighted ${highlightedCount} elements`);
        return { success: true, highlightedCount };
      },
      args: [config, options]
    });

  } catch (error) {
    console.error('Error highlighting elements:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    throw new Error(`Failed to highlight elements: ${errorMessage}`);
  }
}

async function removeHighlights(): Promise<void> {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Remove all highlights
        const highlightedElements = document.querySelectorAll('.web-scraper-highlight');
        highlightedElements.forEach(el => {
          // Remove all highlight classes
          const classesToRemove = Array.from(el.classList).filter(className => 
            className.includes('highlight') || className === 'web-scraper-highlight'
          );
          el.classList.remove(...classesToRemove);
        });

        // Remove the styles
        const style = document.getElementById('web-scraper-styles');
        if (style) {
          style.remove();
        }

        console.log('All highlights removed');
        return { success: true };
      }
    });

  } catch (error) {
    console.error('Error removing highlights:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    throw new Error(`Failed to remove highlights: ${errorMessage}`);
  }
}

export { highlightLinks, removeHighlights };
export type { HighlightConfig, HighlightOptions };