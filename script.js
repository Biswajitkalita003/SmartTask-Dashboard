const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const emptyState = document.getElementById("emptyState");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");

const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


// ================= ADD TASK =================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


// ================= DELETE TASK =================

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// ================= TOGGLE TASK =================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


// ================= SAVE =================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}


// ================= FILTER =================

function getFilteredTasks() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    return tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });
}


// ================= RENDER =================

function renderTasks() {

    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = "";

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            `task ${task.completed ? "completed" : ""}`;

        taskElement.innerHTML = `
            <button
                class="check-btn"
                aria-label="Complete task">
            </button>

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button
                class="delete-btn"
                aria-label="Delete task">
                🗑
            </button>
        `;


        const checkButton =
            taskElement.querySelector(".check-btn");

        const deleteButton =
            taskElement.querySelector(".delete-btn");


        checkButton.addEventListener(
            "click",
            () => toggleTask(task.id)
        );

        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        taskList.appendChild(taskElement);
    });


    updateStats();

    emptyState.style.display =
        filteredTasks.length === 0
            ? "block"
            : "none";
}


// ================= STATISTICS =================

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
}


// ================= CLEAR COMPLETED =================

clearBtn.addEventListener("click", () => {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();
});


// ================= FILTER BUTTONS =================

filters.forEach(button => {

    button.addEventListener("click", () => {

        filters.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();
    });
});


// ================= SEARCH =================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ================= ADD BUTTON =================

addBtn.addEventListener(
    "click",
    addTask
);


// ================= ENTER KEY =================

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            addTask();
        }
    }
);


// ================= DARK MODE =================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    themeBtn.textContent =
        darkMode ? "☀️" : "🌙";

    localStorage.setItem(
        "taskflowDarkMode",
        darkMode
    );
});


// ================= LOAD THEME =================

const savedTheme =
    localStorage.getItem("taskflowDarkMode");

if (savedTheme === "true") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
}


// ================= SECURITY =================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================= INITIAL LOAD =================

renderTasks();