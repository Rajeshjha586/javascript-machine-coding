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

  addCheckboxesListeners() {
    document
      .querySelectorAll(`#${this.root} input[type='checkbox']`)
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
          let childCheckBoxes = event.target
            .closest("li")
            .querySelectorAll("input[type='checkbox']");
          childCheckBoxes.forEach((childCheckBox) => {
            if (childCheckBox) {
              childCheckBox.checked = event.target.checked;
            }
          });
          this.updateParentCheckboxes(event.target);
        });
      });
  }

  updateParentCheckboxes(childCheckBox) {
    let parentli = childCheckBox.closest("ul")?.closest("li");
    if (!parentli) return;

    let parentCheckbox = parentli.querySelector("input[type='checkbox']");

    // Get only direct child checkboxes, not deeply nested ones
    let siblingCheckBoxes = Array.from(parentli.children[1]?.children || [])
      .map((li) => li.querySelector("input[type='checkbox']"))
      .filter(Boolean); // Ensure no null values

    let checkedCount = siblingCheckBoxes.filter((cb) => cb.checked).length;
    let hasIndeterminateChild = siblingCheckBoxes.some(
      (cb) => cb.indeterminate
    );

    // Parent should be checked only if all children are checked
    parentCheckbox.checked = checkedCount === siblingCheckBoxes.length;
    // Parent should be indeterminate if at least one child is indeterminate OR some children are checked
    parentCheckbox.indeterminate =
      hasIndeterminateChild ||
      (checkedCount > 0 && checkedCount < siblingCheckBoxes.length);

    // Recursively update the grandparent
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
