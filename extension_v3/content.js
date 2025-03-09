// async function addWidgetsToTextFields() {
//     console.log("Adding widgets to text fields...");

//     const predefinedAnswers = {
//         "Your Name:": "John Doe",
//         "Your Email:": "johndoe@example.com",
//         "Age:": "25",
//         "Tell me about yourself:": "I'm a software developer.",
//         "Birthday:": "12-10-2000",
//     };

//     const contextString = Object.entries(predefinedAnswers)
//         .map(([key, value]) => `${key} ${value}`)
//         .join("\n");

//     const questionMappings = [];
//     document.querySelectorAll("span.M7eMe").forEach((textElement) => {
//         const questionText = textElement.innerText.trim();
//         const questionContainer = textElement.closest(".geS5n");

//         if (questionText && questionContainer) {
//             questionMappings.push({ questionText, questionContainer });
//         }
//     });

//     // **Short Inputs**
//     document.querySelectorAll("input.whsOnd.zHQkBf").forEach((input) => {
//         const matchingField = questionMappings.find((field) => field.questionContainer.contains(input));

//         if (matchingField) {
//             const questionText = matchingField.questionText;
//             console.log(`Checking field: "${questionText}"`);

//             if (input.parentElement.classList.contains("custom-input-container")) {
//                 return;
//             }

//             const wrapper = document.createElement("div");
//             wrapper.classList.add("custom-input-container");

//             const autofillWidget = document.createElement("button");
//             autofillWidget.innerText = "⚡";
//             autofillWidget.classList.add("input-widget");
//             autofillWidget.title = "Click to autofill";

//             autofillWidget.addEventListener("click", async () => {
//                 try {
//                     const response = await fetch("http://127.0.0.1:8080/ask", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                             question: questionText,
//                             context: contextString,
//                         }),
//                     });

//                     const data = await response.json();
//                     if (data.answer) {
//                         console.log(`Filling "${questionText}" with "${data.answer}"`);
//                         input.value = data.answer;
//                         input.dispatchEvent(new Event("input", { bubbles: true }));
//                         input.dispatchEvent(new Event("change", { bubbles: true }));
//                     } else {
//                         console.error(`Error: ${data.error}`);
//                     }
//                 } catch (error) {
//                     console.error("Fetch error:", error);
//                 }
//             });

//             const generateWidget = document.createElement("button");
//             generateWidget.innerText = "📝";
//             generateWidget.classList.add("generate-widget");
//             generateWidget.title = "Click to enter additional info and generate a response";

//             generateWidget.addEventListener("click", async () => {
//                 const additionalContext = prompt(`Enter additional details for: "${questionText}"`);
//                 if (additionalContext) {
//                     try {
//                         const response = await fetch("http://127.0.0.1:5000/ask", {
//                             method: "POST",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({
//                                 question: questionText,
//                                 context: contextString,
//                                 additional_context: additionalContext,
//                             }),
//                         });

//                         const data = await response.json();
//                         if (data.answer) {
//                             console.log(`Filling "${questionText}" with "${data.answer}"`);
//                             input.value = data.answer;
//                             input.dispatchEvent(new Event("input", { bubbles: true }));
//                             input.dispatchEvent(new Event("change", { bubbles: true }));
//                         } else {
//                             console.error(`Error: ${data.error}`);
//                         }
//                     } catch (error) {
//                         console.error("Fetch error:", error);
//                     }
//                 }
//             });

//             input.parentNode.insertBefore(wrapper, input);
//             wrapper.appendChild(input);
//             wrapper.appendChild(autofillWidget);
//             wrapper.appendChild(generateWidget);
//         }
//     });

//     // **Long Inputs (Textareas)**
//     document.querySelectorAll("textarea.KHxj8b").forEach((input) => {
//         const matchingField = questionMappings.find((field) => field.questionContainer.contains(input));

//         if (matchingField) {
//             const questionText = matchingField.questionText;
//             console.log(`Checking field: "${questionText}"`);

//             if (input.parentElement.classList.contains("custom-input-container") || input.dataset.widgetAdded) {
//                 return;
//             }

//             input.dataset.widgetAdded = "true";

//             const wrapper = document.createElement("div");
//             wrapper.classList.add("custom-input-container");
//             wrapper.style.display = "flex";
//             wrapper.style.alignItems = "center";
//             wrapper.style.width = "100%";
//             wrapper.style.marginBottom = "10px";

//             input.style.flex = "1";

//             const buttonContainer = document.createElement("div");
//             buttonContainer.classList.add("widget-button-container");
//             buttonContainer.style.display = "flex";
//             buttonContainer.style.gap = "4px";

//             const autofillWidget = document.createElement("button");
//             autofillWidget.innerText = "⚡";
//             autofillWidget.classList.add("input-widget");
//             autofillWidget.title = "Click to autofill";
//             styleButton(autofillWidget);

//             autofillWidget.addEventListener("click", async () => {
//                 if (predefinedAnswers[questionText]) {
//                     console.log(`Filling "${questionText}" with "${predefinedAnswers[questionText]}"`);
//                     input.value = predefinedAnswers[questionText];
//                     input.dispatchEvent(new Event("input", { bubbles: true }));
//                     input.dispatchEvent(new Event("change", { bubbles: true }));
//                 } else {
//                     console.log(`No predefined value for "${questionText}"`);
//                 }
//             });

//             const generateWidget = document.createElement("button");
//             generateWidget.innerText = "📝";
//             generateWidget.classList.add("generate-widget");
//             generateWidget.title = "Click to enter additional info and generate a response";
//             styleButton(generateWidget);

//             wrapper.appendChild(input);
//             wrapper.appendChild(buttonContainer);
//             buttonContainer.appendChild(autofillWidget);
//             buttonContainer.appendChild(generateWidget);
//             input.parentNode.insertBefore(wrapper, input);
//         }
//     });
// }

// // Helper function to style buttons
// function styleButton(button) {
//     button.style.padding = "6px";
//     button.style.border = "1px solid #ccc";
//     button.style.borderRadius = "4px";
//     button.style.background = "white";
//     button.style.cursor = "pointer";
//     button.style.minWidth = "28px";
//     button.style.height = "28px";
// }

// // Run function after page loads
// window.onload = () => {
//     console.log("Window loaded. Running addWidgetsToTextFields...");
//     addWidgetsToTextFields();
// };

// async function addWidgetsToTextFields() {
//     console.log("Adding widgets to text fields...");

//     const predefinedAnswers = {
//         "Your Name:": "John Doe",
//         "Your Email:": "johndoe@example.com",
//         "Age:": "25",
//         "Tell me about yourself:": "I'm a software developer.",
//         "Birthday:": "12-10-2000",
//     };

//     const contextString = Object.entries(predefinedAnswers)
//         .map(([key, value]) => `${key} ${value}`)
//         .join("\n");

//     const questionMappings = [];
//     document.querySelectorAll("span.M7eMe").forEach((textElement) => {
//         const questionText = textElement.innerText.trim();
//         const questionContainer = textElement.closest(".geS5n");

//         if (questionText && questionContainer) {
//             questionMappings.push({ questionText, questionContainer });
//         }
//     });

//     // **Short Inputs**
//     document.querySelectorAll("input.whsOnd.zHQkBf").forEach((input) => {
//         const matchingField = questionMappings.find((field) => field.questionContainer.contains(input));

//         if (matchingField) {
//             const questionText = matchingField.questionText;
//             console.log(`Checking field: "${questionText}"`);

//             if (input.parentElement.classList.contains("custom-input-container")) {
//                 return;
//             }

//             const wrapper = document.createElement("div");
//             wrapper.classList.add("custom-input-container");

//             const autofillWidget = document.createElement("button");
//             autofillWidget.innerText = "⚡";
//             autofillWidget.classList.add("input-widget");
//             autofillWidget.title = "Click to autofill";

//             autofillWidget.addEventListener("click", async () => {
//                 try {
//                     const response = await fetch("http://127.0.0.1:5000/ask", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                             question: questionText,
//                             context: contextString,
//                         }),
//                     });

//                     const data = await response.json();
//                     if (data.answer) {
//                         console.log(`Filling "${questionText}" with "${data.answer}"`);
//                         input.value = data.answer;
//                         input.dispatchEvent(new Event("input", { bubbles: true }));
//                         input.dispatchEvent(new Event("change", { bubbles: true }));
//                     } else {
//                         console.error(`Error: ${data.error}`);
//                     }
//                 } catch (error) {
//                     console.error("Fetch error:", error);
//                 }
//             });

//             const generateWidget = document.createElement("button");
//             generateWidget.innerText = "📝";
//             generateWidget.classList.add("generate-widget");
//             generateWidget.title = "Click to enter additional info and generate a response";

//             generateWidget.addEventListener("click", async () => {
//                 const additionalContext = prompt(`Enter additional details for: "${questionText}"`);
//                 if (additionalContext) {
//                     try {
//                         const response = await fetch("http://127.0.0.1:5000/ask", {
//                             method: "POST",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({
//                                 question: questionText,
//                                 context: contextString,
//                                 additional_context: additionalContext,
//                             }),
//                         });

//                         const data = await response.json();
//                         if (data.answer) {
//                             console.log(`Filling "${questionText}" with "${data.answer}"`);
//                             input.value = data.answer;
//                             input.dispatchEvent(new Event("input", { bubbles: true }));
//                             input.dispatchEvent(new Event("change", { bubbles: true }));
//                         } else {
//                             console.error(`Error: ${data.error}`);
//                         }
//                     } catch (error) {
//                         console.error("Fetch error:", error);
//                     }
//                 }
//             });

//             input.parentNode.insertBefore(wrapper, input);
//             wrapper.appendChild(input);
//             wrapper.appendChild(autofillWidget);
//             wrapper.appendChild(generateWidget);
//         }
//     });

//     // **Long Inputs (Textareas)**
//     document.querySelectorAll("textarea.KHxj8b").forEach((input) => {
//         const matchingField = questionMappings.find((field) => field.questionContainer.contains(input));

//         if (matchingField) {
//             const questionText = matchingField.questionText;
//             console.log(`Checking field: "${questionText}"`);

//             if (input.parentElement.classList.contains("custom-input-container") || input.dataset.widgetAdded) {
//                 return;
//             }

//             input.dataset.widgetAdded = "true";

//             const wrapper = document.createElement("div");
//             wrapper.classList.add("custom-input-container");
//             wrapper.style.display = "flex";
//             wrapper.style.alignItems = "center";
//             wrapper.style.width = "100%";
//             wrapper.style.marginBottom = "10px";

//             input.style.flex = "1";

//             const buttonContainer = document.createElement("div");
//             buttonContainer.classList.add("widget-button-container");
//             buttonContainer.style.display = "flex";
//             buttonContainer.style.gap = "4px";

//             const autofillWidget = document.createElement("button");
//             autofillWidget.innerText = "⚡";
//             autofillWidget.classList.add("input-widget");
//             autofillWidget.title = "Click to autofill";
//             styleButton(autofillWidget);

//             autofillWidget.addEventListener("click", async () => {
//                 try {
//                     const response = await fetch("http://127.0.0.1:5000/ask", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                             question: questionText,
//                             context: contextString,
//                         }),
//                     });

//                     const data = await response.json();
//                     if (data.answer) {
//                         console.log(`Filling "${questionText}" with "${data.answer}"`);
//                         input.value = data.answer;
//                         input.dispatchEvent(new Event("input", { bubbles: true }));
//                         input.dispatchEvent(new Event("change", { bubbles: true }));
//                     } else {
//                         console.error(`Error: ${data.error}`);
//                     }
//                 } catch (error) {
//                     console.error("Fetch error:", error);
//                 }
//             });

//             const generateWidget = document.createElement("button");
//             generateWidget.innerText = "📝";
//             generateWidget.classList.add("generate-widget");
//             generateWidget.title = "Click to enter additional info and generate a response";
//             styleButton(generateWidget);

//             wrapper.appendChild(input);
//             wrapper.appendChild(buttonContainer);
//             buttonContainer.appendChild(autofillWidget);
//             buttonContainer.appendChild(generateWidget);
//             input.parentNode.insertBefore(wrapper, input);
//         }
//     });
// }

// // Helper function to style buttons
// function styleButton(button) {
//     button.style.padding = "6px";
//     button.style.border = "1px solid #ccc";
//     button.style.borderRadius = "4px";
//     button.style.background = "white";
//     button.style.cursor = "pointer";
//     button.style.minWidth = "28px";
//     button.style.height = "28px";
// }

// // Run function after page loads
// window.onload = () => {
//     console.log("Window loaded. Running addWidgetsToTextFields...");
//     addWidgetsToTextFields();
// };
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
                    const response = await fetch("http://127.0.0.1:8080/ask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            question: questionText,
                            context: contextString,
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
                        const response = await fetch("http://127.0.0.1:8080/ask", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                question: questionText,
                                context: contextString,
                                additional_context: additionalContext,
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
                    const response = await fetch("http://127.0.0.1:8080/ask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            question: questionText,
                            context: contextString,
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
                        const response = await fetch("http://127.0.0.1:8080/ask", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                question: questionText,
                                context: contextString,
                                additional_context: additionalContext,
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