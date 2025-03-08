document.getElementById("fill").addEventListener("click", () => {
    let data = document.getElementById("formData").value;
    try {
        let parsedData = JSON.parse(data);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "fillForm", data: parsedData });
        });
    } catch (error) {
        alert("Invalid JSON format.");
    }
});
