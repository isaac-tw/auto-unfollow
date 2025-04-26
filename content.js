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

function waitForModalAndObserve(maxTries = 20, interval = 300) {
  if (isPolling) return;

  isPolling = true;

  let attempts = 0;
  const intervalId = setInterval(() => {
    const modal = document.querySelector('[data-test-modal-id="easy-apply-modal"]');

    if (modal) {
      clearInterval(intervalId);
      isPolling = false;

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

function setupApplyButtonListener() {
  document.addEventListener("click", (e) => {
    const applyButton = document.getElementById("jobs-apply-button-id");

    if (applyButton && applyButton.contains(e.target)) {
      waitForModalAndObserve();
    }
  });
}

setupApplyButtonListener();
