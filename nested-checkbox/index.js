const data = {
  "Select All": {
    "Root 1": {
      "Child 1 of Root": {
        "Nested Child 1-1": {
          "Nested Child 1-1-1": {
            "Deeply Nested Child 1-1-1-1": {},
            "Deeply Nested Child 1-1-1-2": {},
          },
          "Nested Child 1-1-2": {
            "Deeply Nested Child 1-1-2-1": {},
            "Deeply Nested Child 1-1-2-2": {},
          },
          "Nested Child 1-1-3": {},
        },
        "Nested Child 1-2": {},
        "Nested Child 1-3": {},
      },
      "Child 2 of Root": {
        "Nested Child 2-1": {},
      },
      "Child 3 of Root": {},
      "Child 4 of Root": {},
    },
  },
};

class NestedCheckBoxes {
  constructor(data, root) {
    this.data = data;
    this.root = root;
  }

  createList(data) {
    const ul = document.createElement("ul");

    for (let item in data) {
      let li = document.createElement("li");
      let label = document.createElement("label");
      label.textContent = item;

      let checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.name = "options";
      checkBox.value = item;

      label.insertBefore(checkBox, label.firstChild);
      li.appendChild(label);

      if (Object.keys(data[item]).length) {
        li.appendChild(this.createList(data[item]));
      }

      ul.appendChild(li);
    }

    return ul;
  }

  handleCheckboxChange(checkbox) {
    let isChecked = checkbox.checked;

    // Select all children and update their checked state
    let childCheckboxes = checkbox
      .closest("li")
      ?.querySelectorAll("input[type='checkbox']");
    if (childCheckboxes) {
      childCheckboxes.forEach((child) => {
        child.checked = isChecked;
        child.indeterminate = false; // Reset indeterminate state
      });
    }

    // Update parents recursively
    this.updateParentCheckboxes(checkbox);
  }

  addCheckboxesListeners() {
    document
      .querySelectorAll(`#${this.root} input[type='checkbox']`)
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
          this.handleCheckboxChange(event.target);
        });
      });
  }

  updateParentCheckboxes(childCheckBox) {
    let parentli = childCheckBox.closest("ul")?.closest("li");
    if (!parentli) return;

    let parentCheckbox = parentli.querySelector("input[type='checkbox']");
    if (!parentCheckbox) return; // Safety check

    // Get only direct child checkboxes, not deeply nested ones
    let siblingCheckBoxes = Array.from(parentli.children[1]?.children || [])
      .map((li) => li.querySelector("input[type='checkbox']"))
      .filter(Boolean); // Remove null values

    let checkedCount = siblingCheckBoxes.filter((cb) => cb.checked).length;
    let hasIndeterminateChild = siblingCheckBoxes.some(
      (cb) => cb.indeterminate
    );

    // Parent should be checked only if all children are checked
    parentCheckbox.checked = checkedCount === siblingCheckBoxes.length;

    // Parent should be indeterminate if some children are checked OR any child is indeterminate
    parentCheckbox.indeterminate =
      hasIndeterminateChild ||
      (checkedCount > 0 && checkedCount < siblingCheckBoxes.length);

    // Recursively update the grandparent (no condition check needed)
    this.updateParentCheckboxes(parentCheckbox);
  }

  init() {
    const container = document.querySelector(`#${this.root}`);
    if (container) {
      container.appendChild(this.createList(this.data));
      this.addCheckboxesListeners();
    }
  }
}

const form = new NestedCheckBoxes(data, "root");
form.init();
