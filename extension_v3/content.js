function addWidgetsToTextFields() {
    console.log("Adding widgets to text fields...");

    const predefinedAnswers = {
        "Your Name:": "John Doe",
        "Your Email:": "johndoe@example.com",
        "Age:": "25",
        "Tell me about yourself:": "I'm a software developer.",
        "Birthday:": "12-10-2000",
    };

    const contextString = Object.entries(predefinedAnswers)
        .map(([key, value]) => `${key} ${value}`)
        .join("\n");

    const questionMappings = [];
    document.querySelectorAll("span.M7eMe").forEach((textElement) => {
        const questionText = textElement.innerText.trim();
        const questionContainer = textElement.closest(".geS5n");

        if (questionText && questionContainer) {
            questionMappings.push({ questionText, questionContainer });
        }
    });
    //Generates a string from the question mappings
    const questionString = questionMappings.map(({ questionText }) => questionText).join("\n");
    console.log("Context String:", questionString);
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
            autofillWidget.addEventListener("click", async () => {
                try {
                    const response = await fetch("http://127.0.0.1:8080/autofill", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            question: questionText,
                            form_questions: questionString,
                        }),
                    });

                    const data = await response.json();
                    if (data.answer) {
                        console.log(`Filling "${questionText}" with "${data.answer}"`);
                        input.value = data.answer;
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    } else {
                        console.error(`Error: ${data.error}`);
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            });

            // Create the generate response widget button
            const generateWidget = document.createElement("button");
            generateWidget.innerText = "📝";
            generateWidget.classList.add("generate-widget");
            generateWidget.title = "Click to enter additional info and generate a response";


            // Event listener to open a pop-up for user input
            generateWidget.addEventListener("click", async () => {
                const additionalContext = prompt(`Enter additional details for: "${questionText}"`);
                if (additionalContext) {
                    try {
                        const response = await fetch("http://127.0.0.1:8080/autofill", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                question: questionText,
                                form_questions: questionString,
                                extra_input: additionalContext,
                            }),
                        });

                        const data = await response.json();
                        if (data.answer) {
                            console.log(`Filling "${questionText}" with "${data.answer}"`);
                            input.value = data.answer;
                            input.dispatchEvent(new Event("input", { bubbles: true }));
                            input.dispatchEvent(new Event("change", { bubbles: true }));
                        } else {
                            console.error(`Error: ${data.error}`);
                        }
                    } catch (error) {
                        console.error("Fetch error:", error);
                    }
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

            // Autofill button
            const autofillWidget = document.createElement("button");
            autofillWidget.innerText = "⚡";
            autofillWidget.classList.add("input-widget");
            autofillWidget.title = "Click to autofill";
            styleButton(autofillWidget, isSmallInput);

            autofillWidget.addEventListener("click", async () => {
                try {
                    const response = await fetch("http://127.0.0.1:8080/autofill", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            question: questionText,
                            form_questions: questionString,
                            question_form: "long",
                        }),
                    });

                    const data = await response.json();
                    if (data.answer) {
                        console.log(`Filling "${questionText}" with "${data.answer}"`);
                        input.value = data.answer;
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    } else {
                        console.error(`Error: ${data.error}`);
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            });

            // Generate response button
            const generateWidget = document.createElement("button");
            generateWidget.innerText = "📝";
            generateWidget.classList.add("generate-widget");
            generateWidget.title = "Click to enter additional info and generate a response";
            styleButton(generateWidget, isSmallInput);

            generateWidget.addEventListener("click", async () => {
                const additionalContext = prompt(`Enter additional details for: "${questionText}"`);
                if (additionalContext) {
                    try {
                        const response = await fetch("http://127.0.0.1:8080/autofill", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                question: questionText,
                                form_questions: questionString,
                                question_form: "long",
                                extra_input: additionalContext,
                            }),
                        });

                        const data = await response.json();
                        if (data.answer) {
                            console.log(`Filling "${questionText}" with "${data.answer}"`);
                            input.value = data.answer;
                            input.dispatchEvent(new Event("input", { bubbles: true }));
                            input.dispatchEvent(new Event("change", { bubbles: true }));
                        } else {
                            console.error(`Error: ${data.error}`);
                        }
                    } catch (error) {
                        console.error("Fetch error:", error);
                    }
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
}

// Run function after page loads
window.onload = () => {
    console.log("Window loaded. Running addWidgetsToTextFields...");
    addWidgetsToTextFields();
};