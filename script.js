document.addEventListener("DOMContentLoaded", () => {
    // Simular tiempo de carga de 2 segundos
    setTimeout(() => {
        document.getElementById("splash-screen").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        requestNotificationPermission();
    }, 2000);

    loadTasks();
});

// Pedir permiso de notificaciones al inicio
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Permiso de notificación concedido.");
            } else {
                alert("Por favor, habilita las notificaciones para recibir recordatorios.");
            }
        });
    }
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskTime = document.getElementById("taskTime");

    if (taskInput.value.trim() === "" || taskTime.value === "") {
        alert("Por favor, ingresa una tarea y una hora válida.");
        return;
    }

    const task = {
        text: taskInput.value,
        time: new Date(taskTime.value).getTime()
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    scheduleNotification(task);

    taskInput.value = "";
    taskTime.value = "";
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${task.text} <small>(${new Date(task.time).toLocaleString()})</small> 
            <button class="delete-btn" onclick="deleteTask(${index})">❌</button>`;
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function scheduleNotification(task) {
    const now = new Date().getTime();
    const delay = task.time - now;

    if (delay > 0) {
        setTimeout(() => {
            if (Notification.permission === "granted") {
                new Notification("📢 Recordatorio de Tarea", {
                    body: task.text,
                    icon: "https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
                });
            } else {
                console.log("Las notificaciones están deshabilitadas.");
            }
        }, delay);
    }
}

function loadTasks() {
    renderTasks();
}
