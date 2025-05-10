let isPolling = false;

function uncheckFollowCheckbox() {
  const checkbox = document.getElementById("follow-company-checkbox");

  if (checkbox && checkbox.checked) {
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));

    return true;
  }

  return false;
}

function waitForModalAndHandle(maxTries = 20, interval = 300) {
  if (isPolling) return;

  isPolling = true;

  let attempts = 0;
  const intervalId = setInterval(() => {
    const modal = document.querySelector('[data-test-modal-id="easy-apply-modal"]');

    if (modal) {
      clearInterval(intervalId);
      isPolling = false;

      if (uncheckFollowCheckbox()) return;

      const observer = new MutationObserver(() => {
        if (uncheckFollowCheckbox()) observer.disconnect();
      });

      observer.observe(modal, {
        childList: true,
        subtree: true,
      });
    } else if (++attempts >= maxTries) {
      clearInterval(intervalId);
      isPolling = false;
    }
  }, interval);
}

function findClosestButtonWithLabel(element, labelText) {
  while (element) {
    if (
      element.tagName === "BUTTON" &&
      element.textContent.includes(labelText)
    ) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

function setupApplyButtonListener() {
  document.body.addEventListener("click", (e) => {
    const button = findClosestButtonWithLabel(e.target, "Easy Apply");

    if (button) waitForModalAndHandle();
  });
}

setupApplyButtonListener();
