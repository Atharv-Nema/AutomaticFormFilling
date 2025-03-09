chrome.runtime.onStartup.addListener(function() {
    console.log("Background script started!");
  });

  
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    console.log("This is a background log")
    if (request.action === "saveData") {
      const inputData = request.data;
      const response = await fetch("http://127.0.0.1:8080/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question: "Please convert the data stored in context to a suitable json format. Please do not output anything else, including the ```json and the ``` at the end as it makes string parsing harder",
            context: inputData,
        }),
      });

      const formattedData = await response.json();
      console.log("Data received:", formattedData.answer);

      try {
        parsedJSON = JSON.parse(formattedData.answer);
      } catch (e) {
        console.error("Unable to parse the model's JSON answer:", e);
        return;
      }

      try {
        const addDbResponse = await fetch("http://127.0.0.1:8080/addDatabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedJSON),
        });

        if (!addDbResponse.ok) {
          console.error("Error inserting data into Neo4j:", addDbResponse.statusText);
        } else {
          console.log("Data successfully inserted into Neo4j");
        }
      } catch (err) {
        console.error("Network error while calling /addDatabase:", err);
      }
    }
  });
