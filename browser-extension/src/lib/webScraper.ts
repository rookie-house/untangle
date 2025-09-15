type ScrapeResult = {
  title: string;
  pageBody: string | null;
  externalLinks: string[];
  internalLinks: string[];
  url?: string;
};

async function WebScraper(): Promise<ScrapeResult> {
  try {
    console.log('Starting WebScraper...');
    
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    console.log('Current tab:', tab);
    
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    if (!tab.url) {
      throw new Error('Tab URL not accessible');
    }

    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      throw new Error('Cannot access browser internal pages');
    }
    
    console.log('Attempting to inject script into tab:', tab.id);
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        console.log('Script injected successfully, starting scraping...');
        
        try {
          const title = document.title || 'No title';
          const pageBody = document.body ? document.body.innerHTML : null;
          const externalLinks: string[] = [];
          const internalLinks: string[] = [];
          const currentUrl = window.location.href;

          console.log('Document title:', title);
          console.log('Current URL:', currentUrl);

          const links = document.querySelectorAll('a[href]');
          console.log(`Found ${links.length} links`);
          
          links.forEach((link) => {
            const href = link.getAttribute('href');
            if (href) {
              if (href.startsWith('http') || href.startsWith('https')) {
                try {
                  const linkDomain = new URL(href).hostname;
                  const currentDomain = window.location.hostname;
                  if (linkDomain !== currentDomain) {
                    externalLinks.push(href);
                  } else {
                    internalLinks.push(href);
                  }
                } catch (urlError) {
                  console.log('URL parsing error for:', href);
                  internalLinks.push(href);
                }
              } else {
                internalLinks.push(href);
              }
            }
          });

          const result = {
            title,
            pageBody: pageBody ? pageBody.substring(0, 1000) + '...' : null,
            externalLinks: [...new Set(externalLinks)],
            internalLinks: [...new Set(internalLinks)],
            url: currentUrl
          };
          
          console.log('Scraping completed successfully:', {
            title: result.title,
            bodyLength: result.pageBody?.length,
            externalLinksCount: result.externalLinks.length,
            internalLinksCount: result.internalLinks.length
          });
          
          return result;
        } catch (error) {
          console.error('Error in page context:', error);
          let errorMessage = 'Unknown error';
          if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
            errorMessage = (error as any).message;
          }
          throw new Error(`Page scraping failed: ${errorMessage}`);
        }
      }
    });

    console.log('Script execution completed:', results);

    if (results && results[0] && results[0].result) {
      return results[0].result as ScrapeResult;
    } else {
      throw new Error('No results returned from content script');
    }

  } catch (error) {
    console.error('WebScraper error details:', error);
    
    // More specific error messages
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
      const errMsg = (error as any).message as string;
      if (errMsg.includes('Cannot access')) {
        throw new Error('Cannot access this page (likely a browser internal page)');
      } else if (errMsg.includes('activeTab')) {
        throw new Error('Permission denied - make sure the extension has activeTab permission');
      } else if (errMsg.includes('scripting')) {
        throw new Error('Cannot inject script - make sure the extension has scripting permission');
      } else {
        throw new Error(`Failed to scrape webpage: ${errMsg}`);
      }
    } else {
      throw new Error('Failed to scrape webpage: Unknown error');
    }
  }
}

export default WebScraper;
export type { ScrapeResult };