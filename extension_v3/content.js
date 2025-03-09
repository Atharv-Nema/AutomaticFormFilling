function addWidgetsToTextFields() {
    console.log("Adding widgets to text fields...");

    const predefinedAnswers = {
        "Your Name:": "John Doe",
        "Your Email:": "johndoe@example.com",
        "Age:": "25",
        "Tell me about yourself:": "I'm a software developer.",
        "Birthday:": "12-10-2000",
    };

    const questionMappings = [];
    document.querySelectorAll("span.M7eMe").forEach((textElement) => {
        const questionText = textElement.innerText.trim();
        const questionContainer = textElement.closest(".geS5n");

        if (questionText && questionContainer) {
            questionMappings.push({ questionText, questionContainer });
        }
    });
    // Short inputs
    document.querySelectorAll("input.whsOnd.zHQkBf").forEach((input) => {
        const matchingField = questionMappings.find((field) => field.questionContainer.contains(input));

        if (matchingField) {
            const questionText = matchingField.questionText;
            console.log(`Checking field: "${questionText}"`);

            // Prevent duplicate widgets
            if (input.parentElement.classList.contains("custom-input-container")) {
                return;
            }

            // Create a wrapper div
            const wrapper = document.createElement("div");
            wrapper.classList.add("custom-input-container");

            // Create the widget button
            const autofillWidget = document.createElement("button");
            autofillWidget.innerText = "⚡"; // Can replace with an icon
            autofillWidget.classList.add("input-widget");
            autofillWidget.title = "Click to autofill"; // Tooltip when hovered

            // Event listener to autofill the field when clicked
            autofillWidget.addEventListener("click", () => {
                if (predefinedAnswers[questionText]) {
                    console.log(`Filling "${questionText}" with "${predefinedAnswers[questionText]}"`);
                    input.value = predefinedAnswers[questionText];

                    // Dispatch events so Google Forms registers the change
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));

                    console.log(`Widget clicked - filled "${questionText}" with "${predefinedAnswers[questionText]}"`);
                } else {
                    console.log(`No predefined value for "${questionText}"`);
                }
            });

            // Create the generate response widget button
            const generateWidget = document.createElement("button");
            generateWidget.innerText = "📝";
            generateWidget.classList.add("generate-widget");
            generateWidget.title = "Click to enter additional info and generate a response";


            // Event listener to open a pop-up for user input
            generateWidget.addEventListener("click", () => {
                const additionalContext = prompt(`Enter additional details for: "${questionText}"`);
                if (additionalContext) {
                    console.log(`Generating new response for "${questionText}" with additional input: "${additionalContext}"`);

                    // Simulate a new response generation (Replace this with actual AI generation logic)
                    const generatedResponse = `Generated response based on: "${questionText}" and "${additionalContext}"`;

                    input.value = generatedResponse;

                    // Trigger input change events to notify Google Forms
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });

            // Wrap input field inside the new div
            input.parentNode.insertBefore(wrapper, input);
            // wrapper.appendChild(input);
            wrapper.appendChild(input);
            wrapper.appendChild(autofillWidget);
            wrapper.appendChild(generateWidget);
        }
    });

    // Long inputs

    document.querySelectorAll("textarea.KHxj8b").forEach((input) => {
        const matchingField = questionMappings.find((field) => field.questionContainer.contains(input));

        if (matchingField) {
            const questionText = matchingField.questionText;
            console.log(`Checking field: "${questionText}"`);

            if (input.parentElement.classList.contains("custom-input-container") || input.dataset.widgetAdded) {
                return;
            }

            input.dataset.widgetAdded = "true";

            // Determine if it's a small input field (e.g., date)
            const isSmallInput = input.tagName === "INPUT" && input.offsetWidth < 250;

            // Create wrapper
            const wrapper = document.createElement("div");
            wrapper.classList.add("custom-input-container");
            wrapper.style.position = "relative";
            wrapper.style.display = "flex";
            wrapper.style.alignItems = "center";
            wrapper.style.width = "100%";
            wrapper.style.marginBottom = "10px";

            // Make sure input stays full-width
            input.style.flex = "1";
            input.style.minWidth = "0";

            // Create button container
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("widget-button-container");
            buttonContainer.style.display = "flex";
            buttonContainer.style.gap = "4px";

            if (isSmallInput) {
                // Overlay buttons for small inputs
                buttonContainer.style.position = "absolute";
                buttonContainer.style.right = "4px";
                buttonContainer.style.top = "50%";
                buttonContainer.style.transform = "translateY(-50%)";
                buttonContainer.style.background = "rgba(255, 255, 255, 0.8)"; // Semi-transparent
                buttonContainer.style.padding = "2px";
                buttonContainer.style.borderRadius = "4px";
                buttonContainer.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";
            }

            // Autofill button
            const autofillWidget = document.createElement("button");
            autofillWidget.innerText = "⚡";
            autofillWidget.classList.add("input-widget");
            autofillWidget.title = "Click to autofill";
            styleButton(autofillWidget, isSmallInput);

            autofillWidget.addEventListener("click", () => {
                if (predefinedAnswers[questionText]) {
                    console.log(`Filling "${questionText}" with "${predefinedAnswers[questionText]}"`);
                    input.value = predefinedAnswers[questionText];
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                } else {
                    console.log(`No predefined value for "${questionText}"`);
                }
            });

            // Generate response button
            const generateWidget = document.createElement("button");
            generateWidget.innerText = "📝";
            generateWidget.classList.add("generate-widget");
            generateWidget.title = "Click to enter additional info and generate a response";
            styleButton(generateWidget, isSmallInput);

            generateWidget.addEventListener("click", () => {
                const additionalContext = prompt(`Enter additional details for: "${questionText}"`);
                if (additionalContext) {
                    console.log(`Generating new response for "${questionText}" with additional input: "${additionalContext}"`);
                    const generatedResponse = `Generated response based on: "${questionText}" and "${additionalContext}"`;
                    input.value = generatedResponse;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });

            // Append elements
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(buttonContainer);
            buttonContainer.appendChild(autofillWidget);
            buttonContainer.appendChild(generateWidget);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            const activeElement = document.activeElement;

            if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                const wrapper = activeElement.closest(".custom-input-container");

                if (wrapper) {
                    event.preventDefault();
                    const autofillButton = wrapper.querySelector(".input-widget");

                    if (autofillButton) {
                        autofillButton.focus();
                        setTimeout(() => autofillButton.click(), 100);
                        return;
                    }
                }
            }

            if (activeElement.classList.contains("input-widget")) {
                event.preventDefault();
                const autofillButtons = Array.from(document.querySelectorAll(".input-widget"));
                const currentIndex = autofillButtons.indexOf(activeElement);

                if (currentIndex !== -1 && currentIndex < autofillButtons.length - 1) {
                    const nextButton = autofillButtons[currentIndex + 1];
                    nextButton.focus();
                    setTimeout(() => nextButton.click(), 100);
                }
            }
        }
    });

    console.log("Widgets added successfully.");
}

// Helper function to style buttons differently based on input size
function styleButton(button, isSmallInput) {
    button.style.padding = "4px";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "4px";
    button.style.background = "white";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.minWidth = "24px";
    button.style.height = "24px";

    // if (isSmallInput) {
    //     button.style.opacity = "0.8";
    //     button.style.border = "none";
    //     button.style.boxShadow = "none";
    // }
}

// Run function after page loads
window.onload = () => {
    console.log("Window loaded. Running addWidgetsToTextFields...");
    addWidgetsToTextFields();
};



