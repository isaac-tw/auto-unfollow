let isPolling = false;

function getInteropShadowRoot() {
  const interopOutlet = document.querySelector("#interop-outlet");
  return interopOutlet?.shadowRoot || null;
}

function findFollowCompanyCheckbox() {
  const shadowRoot = getInteropShadowRoot();

  return (
    shadowRoot?.querySelector("#artdeco-modal-outlet #follow-company-checkbox") ||
    shadowRoot?.querySelector("#follow-company-checkbox") ||
    document.querySelector("#follow-company-checkbox")
  );
}

function uncheckFollowCheckbox() {
  const checkbox = findFollowCompanyCheckbox();

  if (checkbox && checkbox.checked) {
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));

    return true;
  }

  return false;
}

function waitForModalAndHandle(maxTries = 30, interval = 500) {
  if (isPolling) return;
  if (uncheckFollowCheckbox()) return;

  isPolling = true;
  let attempts = 0;
  const intervalId = setInterval(() => {
    if (uncheckFollowCheckbox() || ++attempts >= maxTries) {
      clearInterval(intervalId);
      isPolling = false;
    }
  }, interval);
}

function isApplyTrigger(element) {
  if (!element || !element.tagName) return false;

  const tagName = element.tagName;
  if (tagName !== "BUTTON" && tagName !== "A") return false;

  const text = (element.textContent || "").toLowerCase();
  const ariaLabel = (element.getAttribute("aria-label") || "").toLowerCase();
  const href = (element.getAttribute("href") || "").toLowerCase();

  const hasEasyApplyLabel =
    text.includes("easy apply") || ariaLabel.includes("easy apply");
  const isLinkedInApplyLink =
    tagName === "A" &&
    (href.includes("opensduiapplyflow=true") ||
      ariaLabel.includes("apply to this job"));

  return hasEasyApplyLabel || isLinkedInApplyLink;
}

function findClosestApplyTrigger(element) {
  while (element) {
    if (isApplyTrigger(element)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

function setupApplyButtonListener() {
  document.addEventListener("click", (e) => {
    const button = findClosestApplyTrigger(e.target);

    if (button) waitForModalAndHandle();
  }, true);
}

setupApplyButtonListener();
