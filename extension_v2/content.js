function autofillForm() {
  console.log("Autofill script running...");

  const predefinedAnswers = {
      "Your Name:": "John Doe",
      "Your Email:": "johndoe@example.com",
      "Age:": "25",
  };

  // Extract all question text elements
  const nameOfTextFields = Array.from(document.querySelectorAll("span.M7eMe"))
      .map(textElement => textElement.innerText.trim());

  console.log("Extracted form field names:", nameOfTextFields);

  // Find all input fields
  const textFields = document.querySelectorAll("input.whsOnd.zHQkBf");

  // Autofill based on index alignment
  textFields.forEach((input, index) => {
      if (index < nameOfTextFields.length) {
          const questionText = nameOfTextFields[index];
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
          console.warn("Mismatch: More input fields than question texts.");
      }
  });

  console.log("Autofill process complete.");
}

// Run autofill function when the page loads
window.onload = () => {
  console.log("Window loaded. Running autofillForm...");
  autofillForm();
};
