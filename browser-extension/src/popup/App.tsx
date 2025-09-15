import { useState } from 'react';
import { Sparkles, Camera, Zap } from 'lucide-react';
import './App.css';
import WebScraper, { type ScrapeResult } from '@/lib/webScraper';
import { HighlightConfig, highlightLinks, removeHighlights } from '@/lib/highLight';

export default function App() {
  const [screenshotCaptured, setScreenshotCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapeResult | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleDemystify = async () => {
    setIsLoading(true);
    try {
      console.log('Starting demystify process...');
      const result = await WebScraper();
      setScrapedData(result);
      
      // Highlight links after scraping
      const highlightConfig: HighlightConfig = {
        externalLinks: result.externalLinks,
        internalLinks: result.internalLinks
      };
      
      await highlightLinks(highlightConfig);
      setIsHighlighted(true);
      
      console.log('Scraped Data:', result);
    } catch (error) {
      console.error('Detailed error:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}\nCheck console for details.`);
      } else {
        alert('An unknown error occurred.\n Check console for details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHighlight = async () => {
    try {
      if (isHighlighted) {
        await removeHighlights();
        setIsHighlighted(false);
      } else if (scrapedData) {
        const highlightConfig: HighlightConfig = {
          externalLinks: scrapedData.externalLinks,
          internalLinks: scrapedData.internalLinks
        };
        await highlightLinks(highlightConfig);
        setIsHighlighted(true);
      }
    } catch (error) {
      console.error('Error toggling highlights:', error);
    }
  };

  const handleScreenshot = () => {
    setScreenshotCaptured(true);
    setTimeout(() => setScreenshotCaptured(false), 3000);
  };

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="logo-container">
          <div className="logo">
            <Zap size={24} className="logo-icon" />
          </div>
          <div className="company-info">
            <h1 className="company-name">Your Company</h1>
            <p className="tagline">Smart Web Assistant</p>
          </div>
        </div>
      </header>

      {/* Main Actions */}
      <div className="actions-container">
        <button
          onClick={handleDemystify}
          disabled={isLoading}
          className="action-btn primary-btn"
        >
          <Sparkles size={18} />
          <span>{isLoading ? 'Processing...' : 'Demystify'}</span>
        </button>

        <button
          onClick={handleScreenshot}
          className="action-btn secondary-btn"
        >
          <Camera size={18} />
          <span>Screenshot</span>
        </button>

        {scrapedData && (
          <button
            onClick={handleToggleHighlight}
            className="action-btn secondary-btn"
          >
            <Zap size={18} />
            <span>{isHighlighted ? 'Remove Highlights' : 'Highlight Links'}</span>
          </button>
        )}
      </div>

      {screenshotCaptured && (
        <div className="status-message success">
          ✓ Screenshot captured successfully!
        </div>
      )}

      {isHighlighted && (
        <div className="status-message success">
          ✓ Links highlighted on page!
        </div>
      )}

      {/* Display scraped data */}
      {scrapedData && (
        <div className="status-message">
          <strong>Scraped:</strong> {scrapedData.title} 
          <br />
          <small>
            Links: <span style={{color: '#ff6b6b'}}>●</span> {scrapedData.externalLinks.length} external, 
            <span style={{color: '#4ecdc4'}}>●</span> {scrapedData.internalLinks.length} internal
          </small>
        </div>
      )}

     
    </div>
  );
}