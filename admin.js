const TASK_API = "http://localhost:3000/tasks";
const HABIT_API = "http://localhost:3000/habits";

const adminTaskContainer = document.getElementById("adminTaskContainer");
const adminHabitContainer = document.getElementById("adminHabitContainer");
const adminError = document.getElementById("adminError");
const editBox = document.getElementById("editBox");

let editMode = null;

function showError(msg) {
  adminError.classList.remove("d-none");
  adminError.textContent = msg;

  setTimeout(() => {
    adminError.classList.add("d-none");
    adminError.textContent = "";
  }, 3000);
}

function openEditBox() {
  editBox.classList.remove("d-none");
}

function closeEditBox() {
  editBox.classList.add("d-none");
  editMode = null;
}

async function fetchAdminTasks() {
  try {
    const res = await fetch(TASK_API);
    if (!res.ok) throw new Error();

    const tasks = await res.json();
    renderAdminTasks(tasks);
    showStatistics(tasks);
  } catch {
    showError("Failed to fetch tasks.");
  }
}

async function fetchAdminHabits() {
  try {
    const res = await fetch(HABIT_API);
    if (!res.ok) throw new Error();

    const habits = await res.json();
    renderAdminHabits(habits);
  } catch {
    showError("Failed to fetch habits.");
  }
}

function renderAdminTasks(tasks) {
  adminTaskContainer.innerHTML = "";

  tasks.forEach((task) => {
    const col = document.createElement("div");
    col.className = "col-md-6 mb-4";

    col.innerHTML = `
      <div class="card bg-dark text-white shadow-sm h-100 border-start border-4 border-primary task-card">
        <div class="card-body">

          <h5 class="mb-2 text-white">${task.title}</h5>

          <span class="badge bg-secondary mb-2">${task.category}</span>
          <span class="badge bg-warning text-dark">${task.priority}</span>
          <span class="badge bg-success">${task.status}</span>

          <p class="mt-3 mb-1"><strong>Deadline:</strong> ${task.deadline}</p>

          <p >${task.description}</p>

          <button class="btn btn-warning btn-sm me-2">Edit</button>
          <button class="btn btn-danger btn-sm">Delete</button>

        </div>
      </div>
    `;

    col.querySelector(".btn-warning").onclick = () => openTaskEdit(task);
    col.querySelector(".btn-danger").onclick = () => deleteTask(task.id);

    adminTaskContainer.appendChild(col);
  });
}

function renderAdminHabits(habits) {
  adminHabitContainer.innerHTML = "";

  habits.forEach((habit) => {
    const col = document.createElement("div");
    col.className = "col-md-6 mb-4";

    col.innerHTML = `
      <div class="card bg-dark border-warning text-white h-100">
        <div class="card-body">
          <h5>${habit.habitName}</h5>
          <p><strong>Time:</strong> ${habit.habitTime}</p>

          <button class="btn btn-warning me-2">Edit</button>
          <button class="btn btn-danger">Delete</button>
        </div>
      </div>
    `;

    col.querySelector(".btn-warning").onclick = () => openHabitEdit(habit);
    col.querySelector(".btn-danger").onclick = () => deleteHabit(habit.id);

    adminHabitContainer.appendChild(col);
  });
}

function openTaskEdit(task) {
  editMode = { type: "task", id: task.id };

  openEditBox();

  document.getElementById("taskEditFields").classList.remove("d-none");
  document.getElementById("habitEditFields").classList.add("d-none");

  document.getElementById("editTitle").value = task.title;
  document.getElementById("editStatus").value = task.status;
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editCategory").value = task.category;
  document.getElementById("editDeadline").value = task.deadline;

  document.getElementById("editDescription").value = task.description
    ? task.description
    : "";

  document.getElementById("editBox").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function openHabitEdit(habit) {
  editMode = { type: "habit", id: habit.id };

  openEditBox();

  document.getElementById("taskEditFields").classList.add("d-none");
  document.getElementById("habitEditFields").classList.remove("d-none");

  document.getElementById("editHabitName").value = habit.habitName;
  document.getElementById("editHabitTime").value = habit.habitTime;

  document.getElementById("editBox").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

document.getElementById("saveEditBtn").addEventListener("click", async () => {
  if (!editMode) return;

  try {
    if (editMode.type === "task") {
      const res = await fetch(`${TASK_API}/${editMode.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: document.getElementById("editTitle").value,
          status: document.getElementById("editStatus").value,
          priority: document.getElementById("editPriority").value,
          category: document.getElementById("editCategory").value,
          deadline: document.getElementById("editDeadline").value,
          description: document.getElementById("editDescription").value,
        }),
      });

      if (!res.ok) throw new Error();
    }

    if (editMode.type === "habit") {
      const res = await fetch(`${HABIT_API}/${editMode.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitName: document.getElementById("editHabitName").value,
          habitTime: document.getElementById("editHabitTime").value,
        }),
      });

      if (!res.ok) throw new Error();
    }

    closeEditBox();
    fetchAdminTasks();
    fetchAdminHabits();
  } catch {
    showError("Failed to update data.");
  }
});

document.getElementById("cancelEditBtn").onclick = closeEditBox;

async function deleteTask(id) {
  try {
    await fetch(`${TASK_API}/${id}`, { method: "DELETE" });
    fetchAdminTasks();
  } catch {
    showError("Failed to delete task.");
  }
}

async function deleteHabit(id) {
  try {
    await fetch(`${HABIT_API}/${id}`, { method: "DELETE" });
    fetchAdminHabits();
  } catch {
    showError("Failed to delete habit.");
  }
}

function showStatistics(tasks) {
  document.getElementById("totalTasks").textContent = tasks.length;

  document.getElementById("completedTasks").textContent = tasks.filter(
    (t) => t.status === "Completed",
  ).length;

  document.getElementById("pendingTasks").textContent = tasks.filter(
    (t) => t.status === "Pending",
  ).length;
}

fetchAdminTasks();
fetchAdminHabits();
