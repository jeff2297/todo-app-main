"use strict";

//variable(s)

//Initial template todo list
const items = JSON.parse(localStorage.getItem("todo_list")) || [
  { text: "Complete online JavaScript course", checked: true },
  { text: "Jog around the park 3x", checked: false },
  { text: "10 minutes meditation", checked: false },
  { text: "Read for 1 hour", checked: false },
  { text: "Pick up groceries", checked: false },
  { text: "Complete Todo App on Frontend Mentor", checked: false },
];

//functions

const submitTask = function () {
  if (inputField.value) {
    items.push({ text: inputField.value, checked: 0 });
    inputField.value = "";
    inputField.placeholder = "Create a new todo...";
    document.querySelectorAll(".filter-selection").forEach((filter) => {
      filter.classList.remove("active-filter");
      document
        .querySelector(".filter-selection")
        .classList.add("active-filter");
    });
    populateList();
  } else {
    inputField.placeholder = "Please add a todo...";
  }
  //If todo input field is empty, does nothing, if not, adds a new item to array, repopulates list with new todo
};

const checkItem = function (event) {
  if (event.target.classList.contains("gray-cover")) {
    event.target.classList.toggle("checked");
    const paragraph = event.target.nextElementSibling;
    paragraph.classList.toggle("checked-text");
    const targetObject = items.find(
      (element) => element.text == paragraph.innerHTML
    );
    targetObject.checked = !targetObject.checked;
    countActiveTasks();
  }
  if (event.target.tagName.toLowerCase() === "p") {
    event.target.previousElementSibling.classList.toggle("checked");
    const paragraph = event.target;
    paragraph.classList.toggle("checked-text");
    const targetObject = items.find(
      (element) => element.text == paragraph.innerHTML
    );
    targetObject.checked = !targetObject.checked;
    countActiveTasks();
  }
  //Changes checked object css, and toggles the target object's boolean checked property, also updates 'items left' count
};

const removeItem = function (event) {
  if (event.target.classList.contains("remove-icon")) {
    items.splice(
      items.indexOf(
        items.find(
          (element) =>
            element.text == event.target.previousElementSibling.innerHTML
        )
      ),
      1
    );
    populateList();
  }
  //If cross icon is pressed, finds index of targeted task object and deletes it, repopulates the list to update
};

const clearCompleted = function (event) {
  if (event.target.classList.contains("clear")) {
    //Loops from end to start to avoid deleting an element, the next element taking its place, and then that element getting skipped over
    for (let i = items.length - 1; i > -1; i--) {
      if (items[i].checked) items.splice(i, 1);
    }
    populateList();
  }
  //Loops over the list, if object is marked as checked, deletes it, repopulates
};

const applyFilter = function (e) {
  if (e.target.classList.contains("filter-selection")) {
    populateList(e.target.dataset.filter);
    document.querySelectorAll(".filter-selection").forEach((filter) => {
      filter.classList.remove("active-filter");
      e.target.classList.add("active-filter");
    });
  }
  //Each filter selection has data-filter variable added. This function repopulates the list passing in the filter
  //Also removes "active" css stlying from all filter buttons, and adds it back to the one selected
};

const insertTaskHtml = function (task) {
  const element = `<div class="task">
    
    <input
      type="image"
      src="images/icon-check.svg"
      width="11"
      height="9"
      alt="Submit button"
      class="submit-circle "
    />
    <div class="gray-cover${task.checked == true ? " checked" : ""}"></div>
    <p class="task-text${task.checked == true ? " checked-text" : ""}">${
    task.text
  }</p>
    <input
      type="image"
      src="images/icon-cross.svg"
      width="20"
      height="20"
      alt="Submit button"
      class="remove-icon"
    />
  </div>`;
  taskContainer.insertAdjacentHTML("beforeend", element);
  //Generates HTML for each list entry and renders it on the list
};

const populateList = function (filter) {
  switch (filter) {
    default:
      taskContainer.innerHTML = "";
      items.forEach((task) => insertTaskHtml(task));
      break;
    case "active":
      taskContainer.innerHTML = "";
      items.forEach((task) => {
        if (!task.checked) insertTaskHtml(task);
      });
      break;
    case "completed":
      taskContainer.innerHTML = "";
      items.forEach((task) => {
        if (task.checked) insertTaskHtml(task);
      });
      break;
  }
  countActiveTasks();
  //With no filter passed in, does regular populating, with filter, switches to filtered population
  for (let i = 0; i < exampleTasks.length; i++) {
    exampleTasks[i].addEventListener("mouseover", function (e) {
      e.preventDefault();
      displayCross(e);
    });
    exampleTasks[i].addEventListener("mouseout", function (e) {
      e.preventDefault();
      hideCross(e);
    });
  }
  //After regenerating task list, (re)attaches event listeners to new tasks, to show/hide cross
};

const countActiveTasks = function () {
  const remaining = items.filter((task) => !task.checked).length;
  document.querySelector(".remaining-items").innerHTML = `${remaining} item${
    remaining == 1 ? "" : "s"
  } left`;
  //Simply prints out the length of an array filtered to contain only tasks not checked (checked=0)
};

const displayCross = function (event) {
  if (event.currentTarget.classList.contains("task")) {
    event.currentTarget.lastElementChild.classList.add("remove-visible");
  }
};

const hideCross = function (event) {
  if (event.target.classList.contains("task")) {
    event.target.lastElementChild.classList.remove("remove-visible");
  }
};

const changeTheme = function () {
  document.querySelector(".filter-container").classList.toggle("light-theme");
  document.body.classList.toggle("light-theme");
  inputForm.classList.toggle("light-theme");
  document.querySelector(".action-bar").classList.toggle("light-theme");
  taskContainer.classList.toggle("light-theme");
  if (themeBtn.src.includes("sun")) {
    themeBtn.src = "images/icon-moon.svg";
  } else {
    themeBtn.src = "images/icon-sun.svg";
  }
  //Toggles light-theme css class on all relevant elements, and switches the button image
};

window.onbeforeunload = function () {
  localStorage.setItem("todo_list", JSON.stringify(items));
};

//element selectors

const themeBtn = document.querySelector(".theme-icon");

const inputForm = document.querySelector(".input-form");

const taskContainer = document.querySelector(".list-container");

const inputField = document.querySelector(".input");

const filterBar = document.querySelector(".filter");

const exampleTasks = document.getElementsByClassName("task");

//event listeners

inputForm.addEventListener("submit", function (e) {
  e.preventDefault();
  submitTask();
});

taskContainer.addEventListener("click", function (e) {
  e.preventDefault();
  checkItem(e);
  removeItem(e);
});

// taskContainer.addEventListener("mouseover", function (e) {
//   e.preventDefault();
//   displayCross(e);
// });

// taskContainer.addEventListener("mouseout", function (e) {
//   e.preventDefault();
//   hideCross(e);
// });

themeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  changeTheme();
});

filterBar.addEventListener("click", function (e) {
  e.preventDefault();
  applyFilter(e);
  clearCompleted(e);
});

//init

populateList();