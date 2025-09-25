import ShowMessage from "../utils/customMessage.js";

const logo = document.getElementById("logo");
const darkTheme = document.getElementById("theme-dark");
const lightTheme = document.getElementById("theme-light");
const ContentContainer = document.getElementById("taskContents");

const addBtn = document.getElementById("addTask");
const addTaskSidebar = document.getElementById("addTaskSidebar");
const addTaskContainer = document.getElementsByClassName("addTaskContainer")[0];

const viewBtn = document.getElementById("viewTask");
const viewTaskSidebar = document.getElementById("viewTaskSidebar");
const viewTaskContainer = document.getElementsByClassName("viewTaskContainer")[0];

const trashBtn = document.getElementById("trashBtn");
const TrashSidebar = document.getElementById("trashSidebar");
const TrashContainer = document.getElementsByClassName("trashContainer")[0];

// Sidebar Logic
// View Differnt buttons contents
function ShowContents(button) {
    if (button === "addTask") {
        addTaskContainer.style.display = "block";
        viewTaskContainer.style.display = "none";
        TrashContainer.style.display = "none";
    } else if (button === "viewTask") {
        addTaskContainer.style.display = "none";
        viewTaskContainer.style.display = "block";
        TrashContainer.style.display = "none";
    } else if (button === "trashBtn") {
        addTaskContainer.style.display = "none";
        viewTaskContainer.style.display = "none";
        TrashContainer.style.display = "block";
    };
};

addTaskSidebar.addEventListener("click", () => ShowContents("addTask"));
viewTaskSidebar.addEventListener("click", () => ShowContents("viewTask"));
TrashSidebar.addEventListener("click", () => ShowContents("trashBtn"));

// Navbar Logics
// Logo click
logo.style.cursor = "pointer";
logo.addEventListener("click", () => {
    window.location.href = "addTask.html";
});

// Add pointer cursor to theme icons
[darkTheme, lightTheme].forEach(el => {
    el.style.cursor = "pointer";
});

// Activate Dark Theme
darkTheme.addEventListener("click", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    darkTheme.style.display = "none";

    lightTheme.style.display = "inline";
});

// Activate Light Theme
lightTheme.addEventListener("click", () => {
    document.documentElement.removeAttribute("data-theme");
    lightTheme.style.display = "none";

    darkTheme.style.display = "inline"; 
});

// AddTaskBtn Logic
// Fetching user inputed task
addBtn.addEventListener("click", () => {
    try {
        const tasks = ContentContainer.value;

        if (!tasks.trim()) {
            ShowMessage('error', "Please Enter a task to add");
            setTimeout(() => ShowMessage("info", "Example: Buy Grocieries."), 500);
            return;
        } else {
            ShowMessage('success', "Tasks Added Successfully!");
            setTimeout(() => ShowMessage('info', "You can view all the added tasks in in `view Tasks` section"), 500);
            console.log(tasks);

            // Saving user task to Local Storage
            let saveTaskToLS = JSON.parse(localStorage.getItem("tasks")) || [];
    
            const currentDate = new Date();
            const formattedDate = 
                            currentDate.getFullYear() + "-" +
                            String(currentDate.getMonth() + 1).padStart(2, "0") + "-" +
                            String(currentDate.getDate()).padStart(2, "0");

            saveTaskToLS.push({
                taskName: tasks,
                taskAddedDate: formattedDate,
                tag: "New",
                done: false
            })

            localStorage.setItem("tasks", JSON.stringify(saveTaskToLS));

            // Clearing user input box
            ContentContainer.value = "";
        };

    } catch (error) {
        console.log(`Oops! Something went wrong: ${error}`);
    }
})


// ViewTask Contents Logic
function loadTasks() {
    const viewTaskWrapper = document.querySelector(".wrapper");
    viewTaskWrapper.innerHTML = "";

    let loadSavedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (loadSavedTasks.length === 0){
        viewTaskWrapper.innerHTML = "<p>No tasks found. Add Some!</p>"
        return;
    }

    loadSavedTasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.id = "taskList";

        // Task info
        const taskInfo = document.createElement("div");
        taskInfo.classList.add("taskInfo");
        taskInfo.innerHTML = `<h1 class="taskname">${task.taskName}</h1>
        <small class="taskDate">Added on: ${task.taskAddedDate}</small>`;
        
        // Action buttons
        const actionBtns = document.createElement("div");
        actionBtns.classList.add("actionBtns");
        actionBtns.innerHTML = `
            <button class="TaskTag">${task.tag}</button>
            <button class="updateBtn">Update</button>
            <button class="deleteBtn">Delete</button>
        `;

        // Delete button logic
        const deleteTask = actionBtns.querySelector(".deleteBtn");

        deleteTask.addEventListener("click", () => {
            if (confirm(`Are you sure you want to delete task: ${task.taskName}?`)) {
                ShowMessage("warning", `Removing the task: ${task.taskName}`);
                
                // Move task to Trash
                let trashTasks = JSON.parse(localStorage.getItem("trash")) || [];
                task.tag = "Deleted Task";
                trashTasks.push(task);
                localStorage.setItem("trash", JSON.stringify(trashTasks));

                // Remove from localStorage
                loadSavedTasks.splice(index, 1);
                localStorage.setItem("tasks", JSON.stringify(loadSavedTasks));

                // Re-render updated tasks
                loadTasks();

                ShowMessage("success", `Task "${task.taskName}" moved to Trash!`);
            }

        })

        // Update Button Logic
        const updateBtn = actionBtns.querySelector(".updateBtn");

        updateBtn.addEventListener("click", () => {
            const newTaskName = prompt("Enter the new task name:", task.taskName);

            if (newTaskName && newTaskName.trim() !== "") {
                // Update task details
                loadSavedTasks[index].taskName = newTaskName.trim();
                loadSavedTasks[index].tag = "Updated Task";

                // Save to localStorage
                localStorage.setItem("tasks", JSON.stringify(loadSavedTasks));

                // Re-render updated tasks
                loadTasks();

                ShowMessage("success", `Task updated successfully to "${newTaskName}"`);
            } else {
                ShowMessage("error", "Task update cancelled or empty name provided.");
            }
        })

        // Put together
        taskCard.appendChild(taskInfo);
        taskCard.appendChild(actionBtns);

        viewTaskWrapper.appendChild(taskCard);
    });
}

// Load tasks whenever "View Tasks" is clicked
viewTaskSidebar.addEventListener("click", () => {
    ShowContents("viewTask");
    loadTasks();
});


// Trash Contents Logic
function loadTrash() {
    const trashWrapper = document.querySelector(".trashContainer .wrapper");
    trashWrapper.innerHTML = "";

    let trashTasks = JSON.parse(localStorage.getItem("trash")) || [];
    if (trashTasks.length === 0) {
        trashWrapper.innerHTML = "<p>Trash is empty.</p>";
        return;
    }

    trashTasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.id = "taskList";

        // Task info
        const taskInfo = document.createElement("div");
        taskInfo.classList.add("taskInfo");
        taskInfo.innerHTML = `<h1 class="taskname">${task.taskName}</h1>
        <small class="taskDate">Deleted on: ${task.taskAddedDate}</small>`;

        // Action buttons
        const actionBtns = document.createElement("div");
        actionBtns.classList.add("actionBtns");
        actionBtns.innerHTML = `
            <button class="TaskTag">${task.tag}</button>
            <button class="restoreBtn">Restore</button>
            <button class="removeBtn">Remove</button>
        `;

        // Restore logic
        const restoreBtn = actionBtns.querySelector(".restoreBtn");
        restoreBtn.style.backgroundColor = "lightblue";

        restoreBtn.addEventListener("click", () => {
            let activeTasks = JSON.parse(localStorage.getItem("tasks")) || [];
            task.tag = "Restored Task"; 
            activeTasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(activeTasks));

            // remove from trash
            trashTasks.splice(index, 1);
            localStorage.setItem("trash", JSON.stringify(trashTasks));

            loadTrash();
            ShowMessage("success", `Task "${task.taskName}" restored successfully!`);
        });

        // Remove (Permanent delete)
        const removeBtn = actionBtns.querySelector(".removeBtn");
        removeBtn.style.backgroundColor = "#e02d2dff";

        removeBtn.addEventListener("click", () => {
            if (confirm(`Permanently delete task: ${task.taskName}?`)) {
                trashTasks.splice(index, 1);
                localStorage.setItem("trash", JSON.stringify(trashTasks));

                loadTrash();
                ShowMessage("error", `Task "${task.taskName}" permanently deleted!`);
            }
        });

        taskCard.appendChild(taskInfo);
        taskCard.appendChild(actionBtns);
        trashWrapper.appendChild(taskCard);
    });
}

TrashSidebar.addEventListener("click", () => {
    ShowContents("trashBtn");
    loadTrash();
});

// By default, show Add Task page
document.addEventListener("DOMContentLoaded", () => {
    ShowContents("addTask");
});

// Clearing Memory Button Logic
const ClearEverythig = document.getElementById("clear");

ClearEverythig.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the memory - this will leads to clear everything saved in this app!"));
    localStorage.clear();

    ShowMessage("warning", "All tasks cleared from memory!");
});

