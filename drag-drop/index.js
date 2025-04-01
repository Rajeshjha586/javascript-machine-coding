document.addEventListener("DOMContentLoaded", () => {
  const leftBox = document.getElementById("left");
  const rightBox = document.getElementById("right");
  let selected = null;

  // Event delegation for drag start
  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("list")) {
      selected = e.target;
      setTimeout(() => e.target.classList.add("dragging"), 0);
    }
  });

  // Remove visual feedback on drag end
  document.addEventListener("dragend", () => {
    if (selected) {
      selected.classList.remove("dragging");
      selected = null;
    }
  });

  // Common dragover event for both boxes
  [leftBox, rightBox].forEach((box) => {
    box.addEventListener("dragover", (e) => e.preventDefault());

    box.addEventListener("drop", (e) => {
      if (selected) {
        box.appendChild(selected);
      }
    });
  });
});
