document.addEventListener("DOMContentLoaded", () => {
  loadItems();

  // Test Save button for debugging – simulates saving an item.
  document.getElementById("testSave").addEventListener("click", () => {
    chrome.runtime.sendMessage(
      { action: "saveItem", item: { content: "Test content", type: "text" } },
      (response) => {
        console.log("Response:", response);
        loadItems(); // Refresh list after saving.
      }
    );
  });
});

// Load saved items from storage and render them.
async function loadItems() {
  const { items } = await chrome.storage.local.get({ items: [] });
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";
  if (!items || !items.length) {
    container.textContent = "No items saved.";
    return;
  }
  items.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    let contentElem;
    if (item.type === "image") {
      contentElem = document.createElement("img");
      contentElem.src = item.content;
      contentElem.alt = "Saved image";
      contentElem.className = "item-img";
    } else if (item.type === "url") {
      contentElem = document.createElement("a");
      contentElem.href = item.content;
      contentElem.textContent = item.content;
      contentElem.target = "_blank";
    } else {
      contentElem = document.createElement("p");
      contentElem.textContent = item.content;
    }
    itemDiv.appendChild(contentElem);

    // Date
    const dateElem = document.createElement("span");
    dateElem.className = "item-date";
    dateElem.textContent = item.date;
    itemDiv.appendChild(dateElem);

    // Button container.
    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    // Copy button.
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", () => {
      copyToClipboard(item.content);
    });
    btnContainer.appendChild(copyBtn);

    // Delete button.
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteItem(index);
    });
    btnContainer.appendChild(deleteBtn);

    itemDiv.appendChild(btnContainer);
    container.appendChild(itemDiv);
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}

async function deleteItem(index) {
  const { items } = await chrome.storage.local.get({ items: [] });
  items.splice(index, 1);
  await chrome.storage.local.set({ items });
  loadItems();
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("instructionHeader");
  const content = document.getElementById("instructionContent");
  header.addEventListener("click", () => {
    // Toggle the display of the instructions
    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });
});

document.getElementById("copyAllBtn").addEventListener("click", async () => {
  const { items } = await chrome.storage.local.get({ items: [] });
  if (!items || !items.length) {
    alert("No items to copy.");
    return;
  }
  // Join all item content with newlines.
  const allText = items.map((item) => item.content).join("\n");
  copyToClipboard(allText);
});
