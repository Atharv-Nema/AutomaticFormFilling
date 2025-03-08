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


function extractFormData() {
    let formData = {
        url: window.location.href,
        title: document.title,
        responses: []
    };

    let questions = document.querySelectorAll(".Qr70ae");
    let inputs = document.querySelectorAll("input, textarea");

    inputs.forEach((input, index) => {
        let questionText = questions[index] ? questions[index].innerText : `Question ${index + 1}`;
        let responseValue = "";

        if (input.type === "radio" || input.type === "checkbox") {
            if (input.checked) {
                responseValue = input.nextSibling ? input.nextSibling.innerText : "Selected";
            }
        } else {
            responseValue = input.value;
        }

        formData.responses.push({
            question: questionText,
            answer: responseValue
        });
    });

    console.log("extracted form data: ", formData);
    return formData;
}

function downloadJSON(data) {
    let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "form_responses.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

document.addEventListener("submit", (event) => {
    let extractedData = extractFormData();
    
    downloadJSON(extractedData);

    setTimeout(() => {
        event.target.submit();
    }, 500);
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fillForm") {
        fillForm(message.data);
        sendResponse({ status: "Form filled" });
    }
});
