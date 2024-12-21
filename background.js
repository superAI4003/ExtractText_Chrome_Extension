let iconState = false;
chrome.action.onClicked.addListener((tab) => {
  iconState = !iconState;
  const newIcon = iconState ? "icons/icon2.png" : "icons/icon1.png";
  
  chrome.action.setIcon({ path: newIcon, tabId: tab.id });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // This function will be executed in the context of the web page
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        return selectedText;
      } else {
        return document.body.innerText;
      }
    }
  }, (results) => {
    if (results && results[0] && results[0].result) {
      const extractedText = results[0].result;
      console.log(extractedText);
      chrome.storage.local.set({ extractedText }, () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("js/index.html") });
      });
    }
  });
});