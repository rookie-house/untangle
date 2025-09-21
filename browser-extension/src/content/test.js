// Simple test script to verify content script injection works
console.log("[UNTANGLE TEST] Content script injection working!");

// Create a simple test element
const testDiv = document.createElement('div');
testDiv.id = 'untangle-test';
testDiv.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  padding: 10px;
  z-index: 999999;
  font-family: monospace;
`;
testDiv.textContent = 'UNTANGLE TEST';

// Add when DOM is ready
const addTest = () => {
  if (document.body) {
    document.body.appendChild(testDiv);
    console.log("[UNTANGLE TEST] Test element added");
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (testDiv.parentNode) {
        testDiv.parentNode.removeChild(testDiv);
        console.log("[UNTANGLE TEST] Test element removed");
      }
    }, 3000);
  } else {
    setTimeout(addTest, 100);
  }
};

addTest();