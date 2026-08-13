/* =====================================
        SMARTTASK DASHBOARD
===================================== */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const addTaskBtn = document.getElementById("addTask");

const taskContainer = document.getElementById("taskContainer");

const searchTask = document.getElementById("searchTask");
const filterTask = document.getElementById("filterTask");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const productivity = document.getElementById("productivity");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const toast = document.getElementById("toast");

const clock = document.getElementById("clock");
const currentDate = document.getElementById("currentDate");

/* ==========================
      LIVE DATE & CLOCK
========================== */

function updateClock(){

    const now = new Date();

    clock.innerHTML =
        now.toLocaleTimeString();

    currentDate.innerHTML =
        now.toDateString();

}

updateClock();

setInterval(updateClock,1000);

/* ==========================
      TOAST MESSAGE
========================== */

function showToast(message){

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

/* ==========================
      SAVE LOCAL STORAGE
========================== */

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

/* ==========================
        ADD TASK
========================== */

addTaskBtn.addEventListener("click",()=>{

    const title = taskInput.value.trim();

    if(title===""){

        showToast("Please enter a task.");

        return;

    }

    const task={

        id:Date.now(),

        title:title,

        category:category.value,

        priority:priority.value,

        dueDate:dueDate.value,

        completed:false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value="";
    dueDate.value="";

    showToast("Task Added Successfully");

});
/* ==========================
      DASHBOARD STATS
========================== */

function updateDashboard(){

    const total = tasks.length;

    const completed = tasks.filter(task=>task.completed).length;

    const pending = total - completed;

    const percent = total===0
        ? 0
        : Math.round((completed/total)*100);

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    productivity.textContent = percent + "%";

    document.getElementById("overviewTotal").textContent = total;
    document.getElementById("overviewCompleted").textContent = completed;
    document.getElementById("overviewPending").textContent = pending;

    progressFill.style.width = percent + "%";
    progressText.textContent = percent + "% Completed";

    updateCategoryCount();
}

/* ==========================
      CATEGORY COUNT
========================== */

function updateCategoryCount(){

    const categories = {
        Study:0,
        Work:0,
        Personal:0,
        Health:0
    };

    tasks.forEach(task=>{

        if(categories.hasOwnProperty(task.category)){

            categories[task.category]++;

        }

    });

    document.getElementById("studyCount").textContent =
        categories.Study + " Tasks";

    document.getElementById("workCount").textContent =
        categories.Work + " Tasks";

    document.getElementById("personalCount").textContent =
        categories.Personal + " Tasks";

    document.getElementById("healthCount").textContent =
        categories.Health + " Tasks";

}

/* ==========================
      SEARCH & FILTER
========================== */

searchTask.addEventListener("keyup",renderTasks);

filterTask.addEventListener("change",renderTasks);

/* ==========================
      DARK MODE
========================== */

const themeToggle =
document.getElementById("themeToggle");

const savedTheme =
localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        showToast("Dark Mode Enabled");

    }else{

        localStorage.setItem("theme","light");

        showToast("Light Mode Enabled");

    }

});

/* ==========================
      CLEAR COMPLETED
========================== */

const clearCompleted =
document.getElementById("clearCompleted");

clearCompleted.addEventListener("click",()=>{

    tasks = tasks.filter(task=>!task.completed);

    saveTasks();

    renderTasks();

    showToast("Completed Tasks Cleared");

});

/* ==========================
      RESET DASHBOARD
========================== */

const resetApp =
document.getElementById("resetApp");

resetApp.addEventListener("click",()=>{

    if(confirm("Reset all tasks?")){

        tasks = [];

        saveTasks();

        renderTasks();

        showToast("Dashboard Reset");

    }

});

/* ==========================
      ENTER KEY
========================== */

taskInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        addTaskBtn.click();

    }

});

/* ==========================
      HERO BUTTON
========================== */

const heroButton =
document.getElementById("newTaskBtn");

heroButton.addEventListener("click",()=>{

    taskInput.focus();

    window.scrollTo({

        top:taskInput.offsetTop-120,

        behavior:"smooth"

    });

});

/* ==========================
      SIDEBAR ACTIVE LINK
========================== */

const navLinks =
document.querySelectorAll(".menu li");

navLinks.forEach(link=>{

    link.addEventListener("click",()=>{

        navLinks.forEach(item=>{

            item.classList.remove("active");

        });

        link.classList.add("active");

    });

});

/* ==========================
      INITIAL LOAD
========================== */

renderTasks();

showToast("Welcome to SmartTask Dashboard!");