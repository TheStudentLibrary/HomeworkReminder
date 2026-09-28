if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function checkReminderTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  if (hours === 15 && minutes === 59) {
    new Notification("Homework Reminder", {
      body: "Time to check your homework and tests!"
    });
  }
}

setInterval(checkReminderTime, 60000);

const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

addBtn.addEventListener("click", function() {
  if (taskInput.value.trim() === "" || subjectInput.value.trim() === "" || dateInput.value === "") {
    alert("Please fill in all fields before adding a task.");
    return;
  }

  const newTask = {
    text: taskInput.value,
    subject: subjectInput.value,
    date: dateInput.value,
    completed: false
  };

  tasks.push(newTask);

  tasks.sort(function(a, b) {
    return a.date.localeCompare(b.date);
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  subjectInput.value = "";
  dateInput.value = "";
});

taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addBtn.click();
  }
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const newItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed || false;
    checkbox.addEventListener("change", function() {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text + " (" + task.subject + ") - Due: " + task.date;
    if (task.completed) {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.opacity = "0.5";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function() {
      tasks.splice(i, 1);
      saveTasks();
      renderTasks();
    });

    newItem.appendChild(checkbox);
    newItem.appendChild(textSpan);
    newItem.appendChild(deleteBtn);
    taskList.appendChild(newItem);
  }
}