function fillForm(data) {
    let inputs = document.querySelectorAll("input[type='text'], textarea");
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    let radios = document.querySelectorAll("input[type='radio']");
    
    inputs.forEach((input, index) => {
        if (data.textInputs && data.textInputs[index]) {
            input.value = data.textInputs[index];
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    checkboxes.forEach((checkbox, index) => {
        if (data.checkboxes && data.checkboxes.includes(index)) {
            checkbox.click();
        }
    });

    radios.forEach((radio, index) => {
        if (data.radio && data.radio === index) {
            radio.click();
        }
    });

    console.log("Form filled successfully!");
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fillForm") {
        fillForm(message.data);
        sendResponse({ status: "Form filled" });
    }
});
