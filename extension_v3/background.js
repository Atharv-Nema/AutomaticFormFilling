chrome.runtime.onStartup.addListener(function() {
    console.log("Background script started!");
  });

  
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "saveData") {
      const data = request.data;
      console.log("Data saved:", data);
    }
  });
