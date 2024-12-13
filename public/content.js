function extractAllText() {
  // Get all text from the page
  const bodyText = document.body.innerText;
  return bodyText;
}

// Modify the script to return the extracted text
(() => {
  const extractedText = extractAllText();
  return extractedText; // Return the text so it can be captured by executeScript
})();