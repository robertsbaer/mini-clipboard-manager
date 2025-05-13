document.addEventListener("copy", (event) => {
  const selection = document.getSelection().toString();
  if (selection) {
    console.log("Copy event fired, selection:", selection);
    chrome.runtime.sendMessage(
      {
        action: "saveItem",
        item: { content: selection, type: "text" },
      },
      (response) => {
        console.log("Save response:", response);
      }
    );
  }
});
