document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", function () {
      const textInput = document.getElementById("text-input");
      const text = textInput.value;
      chrome.runtime.sendMessage({ action: "saveData", data: text });
    });
  });