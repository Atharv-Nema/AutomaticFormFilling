// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3NMU2BJOmifISJXLuQLWeh8IQvErqM2Q",
  authDomain: "cues-2025-lent-hackathon.firebaseapp.com",
  projectId: "cues-2025-lent-hackathon",
  storageBucket: "cues-2025-lent-hackathon.firebasestorage.app",
  messagingSenderId: "379001364433",
  appId: "1:379001364433:web:4868adab9966d627474af0",
  measurementId: "G-DLES4CJQ7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


function autofillForm() {
    console.log("Autofill script running...");

    const predefinedAnswers = {
        "Your Name:": "my name is John Doe",
        "Your Email:": "i think my email is johndoe@example.com",
        "Age:": "25",
        "Some facts about myself:": "I'm a software developer. I love go and python blah blah blah",
    };

    // Step 1: Extract all question texts and store them with their containers
    const questionMappings = [];
    // Note that .M7eMe is the class for span of the question text
    document.querySelectorAll("span.M7eMe").forEach((textElement) => {
        const questionText = textElement.innerText.trim();
        const questionContainer = textElement.closest('.geS5n'); // The container that holds both the question and input box has class geS5n

        if (questionText && questionContainer) {
            questionMappings.push({ questionText, questionContainer });
        }
    });

    console.log("Extracted form field mappings:", questionMappings);

    // Step 2: Find all input fields and match them to questions
    // Note that .whsOnd is the class for input fields
    document.querySelectorAll("input.whsOnd.zHQkBf").forEach(async (input) => {
        const matchingField = questionMappings.find(field => field.questionContainer.contains(input));

        if (matchingField) {
            const questionText = matchingField.questionText;
            console.log(`Checking field: "${questionText}"`);
            const contextString = Object.entries(predefinedAnswers)
                .map(([key, value]) => `${key} ${value}`)
                .join("\n");
            const response = await fetch("http://127.0.0.1:5000/ask", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  question: questionText,
                  context: contextString,
                })
              });
            const data = await response.json();
            if (data.answer) {
                console.log(`Filling "${questionText}" with "${data.answer}"`);
                input.value = data.answer;
                // Dispatch events so Google Forms registers the change
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                console.log(`Error: ${data.error}`);
            }
        } else {
            console.warn("Could not find a matching question for input:", input);
        }
    });

    // Handle textarea inputs
    document.querySelectorAll("textarea.KHxj8b").forEach(async (textarea) => {
        const matchingField = questionMappings.find(field => field.questionContainer.contains(textarea));

        if (matchingField) {
            const questionText = matchingField.questionText;
            console.log(`Checking textarea: "${questionText}"`);
            const contextString = Object.entries(predefinedAnswers)
                .map(([key, value]) => `${key} ${value}`)
                .join("\n");
            const response = await fetch("http://127.0.0.1:5000/ask", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  question: questionText,
                  context: contextString,
                })
              });
            const data = await response.json();
            if (data.answer) {
                console.log(`Filling "${questionText}" with "${data.answer}"`);
                textarea.value = data.answer;
                // Dispatch events so Google Forms registers the change
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                console.log(`Error: ${data.error}`);
            }
        } else {
            console.warn("Could not find a matching question for textarea:", textarea);
        }
    });

    console.log("Autofill process complete.");
}

//Code to extract form data on submission
function identifyQuestionType(container) {
    if (container.querySelector("input[type='file']")) {
      return "file_upload";
    }
    if (container.querySelector("input[type='date']")) {
      return "date";
    }
    if (container.querySelector("input[type='time']")) {
      return "time";
    }
    if (container.querySelector("select") || container.querySelector('div[role="listbox"]')) {
      return "dropdown";
    }
    if (container.querySelector('span[aria-label*="star"]') || container.innerText.toLowerCase().includes("star")) {
      return "rating";
    }
    let radios = container.querySelectorAll("input[type='radio']");
    if (radios.length > 0) {
      let numbers = container.innerText.match(/\b\d+\b/g);
      if (numbers && new Set(numbers).size >= 2) {
        return "linear_scale";
      }
      return "multiple_choice";
    }
    let checkboxes = container.querySelectorAll("input[type='checkbox']");
    if (checkboxes.length > 0) {
      if (container.querySelector("table") || container.querySelector(".grid")) {
        return "checkbox_grid";
      }
      return "checkboxes";
    }
    if (container.querySelector("textarea")) {
      return "paragraph";
    }
    if (container.querySelector("input[type='text']")) {
      return "short_answer";
    }
    return "unknown";
  }
  
function extractFormData() {
    const formData = {
      url: window.location.href,
      title: document.title,
      responses: []
    };
  
    const questionContainers = document.querySelectorAll(".Qr7Oae");
    questionContainers.forEach(container => {
      const questionText = container.innerText.trim();
      const type = identifyQuestionType(container);
      let answer = "";
      switch (type) {
        case "multiple_choice": {
          const selected = container.querySelector("input[type='radio']:checked");
          if (selected) {
            const label = container.querySelector(`label[for="${selected.id}"]`);
            answer = label ? label.innerText.trim() : selected.value;
          }
          break;
        }
        case "linear_scale": {
          const selected = container.querySelector("input[type='radio']:checked");
          if (selected) {
            answer = selected.value;
          }
          break;
        }
        case "rating": {
          const selected = container.querySelector("input[type='radio']:checked");
          if (selected) {
            const label = container.querySelector(`label[for="${selected.id}"]`);
            answer = label ? label.innerText.trim() : selected.value;
          }
          break;
        }
        case "checkboxes": {
          const selected = container.querySelectorAll("input[type='checkbox']:checked");
          answer = Array.from(selected).map(checkbox => {
            const label = container.querySelector(`label[for="${checkbox.id}"]`);
            return label ? label.innerText.trim() : checkbox.value;
          }).join(", ");
          break;
        }
        case "checkbox_grid": {
          const selected = container.querySelectorAll("input[type='checkbox']:checked");
          answer = Array.from(selected).map(checkbox => {
            const label = container.querySelector(`label[for="${checkbox.id}"]`);
            return label ? label.innerText.trim() : checkbox.value;
          }).join(", ");
          break;
        }
        case "dropdown": {
          const selectEl = container.querySelector("select");
          if (selectEl) {
            answer = selectEl.options[selectEl.selectedIndex].text.trim();
          } else {
            const listbox = container.querySelector('div[role="listbox"]');
            if (listbox) {
              answer = listbox.innerText.trim();
            }
          }
          break;
        }
        case "file_upload": {
          const fileInput = container.querySelector("input[type='file']");
          if (fileInput && fileInput.files && fileInput.files.length > 0) {
            answer = Array.from(fileInput.files).map(function(file) {
              return file.name;
            }).join(", ");
          }
          break;
        }
        case "date":
        case "time":
        case "short_answer": {
          const input = container.querySelector("input");
          if (input) {
            answer = input.value.trim();
          }
          break;
        }
        case "paragraph": {
          const textarea = container.querySelector("textarea");
          if (textarea) {
            answer = textarea.value.trim();
          }
          break;
        }
        default:
          answer = "";
      }
      formData.responses.push({
        question: questionText,
        type: type,
        answer: answer
      });
    });
    return formData;
  }
  
function downloadJSON(data, callback) {
    //Save the data to a text file

}
  
function attachSubmitListener() {
    const buttonCandidates = document.querySelectorAll('div[role="button"]');
    const submitButton = Array.from(buttonCandidates).find(function(btn) {
      return btn.innerText.trim().toLowerCase().includes("submit");
    });
    if (submitButton) {
      if (submitButton.dataset.listenerAttached === "true") return;
      submitButton.dataset.listenerAttached = "true";
      submitButton.addEventListener("click", function handleClick(event) {
        event.preventDefault();
        const extractedData = extractFormData();
        downloadJSON(extractedData, function() {
          submitButton.removeEventListener("click", handleClick, true);
          delete submitButton.dataset.listenerAttached;
          submitButton.click();
        });
      }, true);
    } else {
      setTimeout(attachSubmitListener, 500);
    }
}
  
const observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
      if (mutation.addedNodes.length) {
        attachSubmitListener();
      }
    }
});
observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", attachSubmitListener);
  
// Run autofill function when the page loads
window.onload = () => {
    console.log("Window loaded. Running autofillForm...");
    autofillForm();
    
};
