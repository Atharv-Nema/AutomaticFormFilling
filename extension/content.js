function extractFormData() {
  let formData = {
    url: window.location.href,
    title: document.title,
    responses: []
  };
  let questions = document.querySelectorAll(".Qr7Oae");
  let inputs = Array.from(document.querySelectorAll("input:not([type='hidden']), textarea"))
                  .filter(el => el.offsetParent !== null);
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
    formData.responses.push({
      question: questionText,
      answer: responseValue
    });
  });
  return formData;
}

function downloadJSON(data, callback) {
  chrome.runtime.sendMessage({
    action: "downloadJSON",
    data: JSON.stringify(data, null, 2)
  }, (response) => {
    try {
      if (callback) callback();
    } catch (e) {
      // If the context is invalidated, ignore the error.
    }
  });
}

function attachSubmitListener() {
  const buttonCandidates = document.querySelectorAll('div[role="button"]');
  let submitButton = [...buttonCandidates].find(btn =>
    btn.innerText.trim().toLowerCase().includes("submit")
  );
  if (submitButton) {
    if (submitButton.dataset.listenerAttached === "true") return;
    submitButton.dataset.listenerAttached = "true";
    submitButton.addEventListener("click", function handleClick(event) {
      event.preventDefault();
      let extractedData = extractFormData();
      downloadJSON(extractedData, () => {
        try {
          submitButton.removeEventListener("click", handleClick, true);
          delete submitButton.dataset.listenerAttached;
          submitButton.click();
        } catch (e) {
          // The context might be invalidated, which we can safely ignore.
        }
      });
    }, true);
  } else {
    setTimeout(attachSubmitListener, 500);
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      attachSubmitListener();
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener("DOMContentLoaded", attachSubmitListener);
