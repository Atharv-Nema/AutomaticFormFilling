function fillForm(data) {
    console.log("[DEBUG] fillForm() called with data:", data);
    let inputs = document.querySelectorAll("input[type='text'], textarea");
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    let radios = document.querySelectorAll("input[type='radio']");
    
    inputs.forEach((input, index) => {
        if (data.textInputs && data.textInputs[index]) {
            console.log("[DEBUG] Filling input", index, "with", data.textInputs[index]);
            input.value = data.textInputs[index];
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    checkboxes.forEach((checkbox, index) => {
        if (data.checkboxes && data.checkboxes.includes(index)) {
            console.log("[DEBUG] Clicking checkbox", index);
            checkbox.click();
        }
    });

    radios.forEach((radio, index) => {
        if (data.radio && data.radio === index) {
            console.log("[DEBUG] Clicking radio button", index);
            radio.click();
        }
    });

    console.log("[DEBUG] Form filled successfully!");
}

function extractFormData() {
    console.log("[DEBUG] extractFormData() called.");
    let formData = {
        url: window.location.href,
        title: document.title,
        responses: []
    };

    let questions = document.querySelectorAll(".Qr7Oae"); // Class for questions in Google Forms
    console.log("[DEBUG] Found", questions.length, "questions with class .Qr7Oae");

    let inputs = document.querySelectorAll("input, textarea");
    console.log("[DEBUG] Found", inputs.length, "input and textarea elements");

    inputs.forEach((input, index) => {
        let questionText = questions[index] ? questions[index].innerText : `Question ${index + 1}`;
        let responseValue = "";

        if (input.type === "radio" || input.type === "checkbox") {
            if (input.checked) {
                let label = document.querySelector(`label[for="${input.id}"]`);
                responseValue = label ? label.innerText : "Selected";
            }
        } else {
            responseValue = input.value;
        }
        console.log("[DEBUG] Extracting response for question", index, ":", questionText, "->", responseValue);
        formData.responses.push({
            question: questionText,
            answer: responseValue
        });
    });

    console.log("[DEBUG] Extracted Form Data:", formData);
    return formData;
}

function downloadJSON(data, callback) {
    console.log("[DEBUG] downloadJSON() called with data:", data);
    let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "form_responses.json";

    document.body.appendChild(downloadLink);
    console.log("[DEBUG] Triggering download...");
    downloadLink.click();
    
    setTimeout(() => {
        console.log("[DEBUG] Removing download link and revoking URL");
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        if (callback) {
            console.log("[DEBUG] Calling download callback");
            callback();
        }
    }, 100);
}

document.addEventListener("submit", (event) => {
    console.log("[DEBUG] Submit event triggered");
    event.preventDefault();

    let extractedData = extractFormData();
    console.log("[DEBUG] Data extracted, initiating download...");
    
    downloadJSON(extractedData, () => {
        console.log("[DEBUG] Download complete, submitting form...");
        event.target.submit();
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[DEBUG] Received message:", message);
    if (message.action === "fillForm") {
        fillForm(message.data);
        sendResponse({ status: "Form filled" });
    }
});
