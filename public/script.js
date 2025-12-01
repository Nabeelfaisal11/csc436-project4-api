const loadBtn = document.getElementById("loadTasksBtn");
const tasksContainer = document.getElementById("tasksContainer");
const addTaskForm = document.getElementById("addTaskForm");
const taskTitleInput = document.getElementById("taskTitleInput");
const themeToggleBtn = document.getElementById("themeToggle");

loadBtn.addEventListener("click", loadTasks);
addTaskForm.addEventListener("submit", handleAddTask);
themeToggleBtn.addEventListener("click", toggleTheme);

// Load tasks when page first opens
loadTasks();
updateThemeButton();

/* ===== TASKS ===== */

function loadTasks() {
    fetch("/api/tasks")
        .then(res => res.json())
        .then(tasks => {
            tasksContainer.innerHTML = "";

            if (!tasks.length) {
                tasksContainer.innerHTML =
                    `<p style="color:#9ca3af; font-size:13px;">No tasks yet. Add one above!</p>`;
                return;
            }

            tasks.forEach(task => {
                const box = document.createElement("div");
                box.className = "task-box";

                const main = document.createElement("div");
                main.className = "task-main";

                const title = document.createElement("div");
                title.className = "task-title";
                title.textContent = task.title;

                const meta = document.createElement("div");
                meta.className = "task-meta";
                meta.textContent = `ID: ${task.id}`;

                main.appendChild(title);
                main.appendChild(meta);

                // Status pill
                const status = document.createElement("div");
                status.className =
                    "status-pill " +
                    (task.completed ? "status-done" : "status-pending");
                status.textContent = task.completed ? "Done" : "Pending";

                // Delete button
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "delete-btn";
                deleteBtn.textContent = "Delete";

                deleteBtn.addEventListener("click", () => {
                    const confirmDelete = confirm(
                        `Delete task "${task.title}" (ID ${task.id})?`
                    );
                    if (!confirmDelete) return;

                    fetch(`/api/tasks/${task.id}`, {
                        method: "DELETE"
                    })
                        .then(res => res.json())
                        .then(() => loadTasks())
                        .catch(err => {
                            console.error("Error deleting task:", err);
                            alert("Could not delete task, check console.");
                        });
                });

                const right = document.createElement("div");
                right.className = "task-right";
                right.appendChild(status);
                right.appendChild(deleteBtn);

                box.appendChild(main);
                box.appendChild(right);

                tasksContainer.appendChild(box);
            });
        })
        .catch(err => {
            console.error("Error loading tasks:", err);
            tasksContainer.innerHTML =
                `<p style="color:#fecaca; font-size:13px;">Failed to load tasks. Check the server.</p>`;
        });
}

function handleAddTask(event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    if (!title) return;

    fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            completed: false
        })
    })
        .then(res => res.json())
        .then(() => {
            taskTitleInput.value = "";
            loadTasks(); // refresh list
        })
        .catch(err => {
            console.error("Error adding task:", err);
            alert("Could not add task, check console.");
        });
}

/* ===== THEME TOGGLE ===== */

function toggleTheme() {
    document.body.classList.toggle("light");
    updateThemeButton();
}

function updateThemeButton() {
    const isLight = document.body.classList.contains("light");
    themeToggleBtn.textContent = isLight ? "🌙 Dark mode" : "☀️ Light mode";
}
