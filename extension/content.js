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
  chrome.runtime.sendMessage({
    action: "downloadJSON",
    data: JSON.stringify(data, null, 2)
  }, function(response) {
    if (callback) callback();
  });
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
