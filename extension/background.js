chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "downloadJSON") {
      let dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(message.data);
      chrome.downloads.download({
        url: dataUrl,
        filename: "form_responses.json",
        saveAs: false
      }, (downloadId) => {
        sendResponse({ downloadId: downloadId });
      });
      return true;
    }
  });
  