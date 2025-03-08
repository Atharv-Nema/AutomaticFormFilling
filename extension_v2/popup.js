document.getElementById("save").addEventListener("click", () => {
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
    };

    chrome.storage.local.set({ formData }, () => {
        alert("Data saved!");
    });
});
