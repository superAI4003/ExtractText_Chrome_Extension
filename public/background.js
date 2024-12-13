chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractAll") {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          chrome.scripting.executeScript(
              {
                  target: { tabId: tabs[0].id },
                  func: () => {
                      // Define the function to extract text
                      function extractAllText() {
                          const bodyText = document.body.innerText;
                          return bodyText;
                      }
                      return extractAllText(); // Call and return the result
                  }
              },
              (injectionResults) => {
                  if (chrome.runtime.lastError) {
                      console.error(chrome.runtime.lastError);
                      sendResponse({ success: false, error: chrome.runtime.lastError.message });
                      return;
                  }
                  for (let i = 0; i < injectionResults.length; i++) {
                      if (injectionResults[i].result) {
                          const extractedText = injectionResults[i].result;
                          console.log(extractedText); // Log the extracted text
                      }
                  }
                  console.log(injectionResults);
                  sendResponse({ success: true });
              }
          );
      });
      return true; // Indicates async response
  }
  else if (request.action === "extractSelected") {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            // Function to extract selected text
            function extractSelectedText() {
              const selection = window.getSelection();
              return selection ? selection.toString() : '';
            }
            return extractSelectedText();
          }
        },
        (injectionResults) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
            return;
          }
          for (let i = 0; i < injectionResults.length; i++) {
            if (injectionResults[i].result) {
              const selectedText = injectionResults[i].result;
              console.log(selectedText); // Log the selected text
              sendResponse({ success: true, text: selectedText });
            }
          }
        }
      );
    });
    return true; // Indicates async response
  }
});