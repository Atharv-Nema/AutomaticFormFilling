function autofillForm() {
    console.log("Autofill script running...");

    const predefinedAnswers = {
        "Your Name:": "John Doe",
        "Your Email:": "johndoe@example.com",
        "Age:": "25",
    };

    // Step 1: Extract all question texts and store them with their containers
    const questionMappings = [];
    document.querySelectorAll("span.M7eMe").forEach((textElement) => {
        const questionText = textElement.innerText.trim();
        const questionContainer = textElement.closest('.geS5n'); // The container that holds both the question and input

        if (questionText && questionContainer) {
            questionMappings.push({ questionText, questionContainer });
        }
    });

    console.log("Extracted form field mappings:", questionMappings);

    // Step 2: Find all input fields and match them to questions
    document.querySelectorAll("input.whsOnd.zHQkBf").forEach((input) => {
        const matchingField = questionMappings.find(field => field.questionContainer.contains(input));

        if (matchingField) {
            const questionText = matchingField.questionText;
            console.log(`Checking field: "${questionText}"`);

            if (predefinedAnswers[questionText]) {
                console.log(`Filling "${questionText}" with "${predefinedAnswers[questionText]}"`);
                input.value = predefinedAnswers[questionText];

                // Dispatch events so Google Forms registers the change
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                console.warn(`No predefined value for: "${questionText}"`);
            }
        } else {
            console.warn("Could not find a matching question for input:", input);
        }
    });

    console.log("Autofill process complete.");
}

// Run autofill function when the page loads
window.onload = () => {
    console.log("Window loaded. Running autofillForm...");
    autofillForm();
};
