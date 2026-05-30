const TASK_API = "http://localhost:3000/tasks";
const HABIT_API = "http://localhost:3000/habits";

const adminTaskContainer = document.getElementById("adminTaskContainer");
const adminHabitContainer = document.getElementById("adminHabitContainer");

async function fetchAdminTasks() {
  try {
    const res = await fetch(TASK_API);
    if (!res.ok) throw new Error("Failed to fetch tasks");

    const tasks = await res.json();
    renderAdminTasks(tasks);
    showStatistics(tasks);
  } catch (err) {
    console.log("Task fetch error:", err);
  }
}

async function fetchAdminHabits() {
  try {
    const res = await fetch(HABIT_API);
    if (!res.ok) throw new Error("Failed to fetch habits");

    const habits = await res.json();
    renderAdminHabits(habits);
  } catch (err) {
    console.log("Habit fetch error:", err);
  }
}

function renderAdminTasks(tasks) {
  adminTaskContainer.innerHTML = "";

  tasks.forEach((task) => {
    const col = document.createElement("div");
    col.className = "col-md-6 mb-4";

    col.innerHTML = `
      <div class="card bg-secondary text-white h-100">
        <div class="card-body">

          <h5>${task.title}</h5>

          <p><strong>Status:</strong> ${task.status}</p>
          <p><strong>Priority:</strong> ${task.priority}</p>

          <button class="btn btn-warning me-2 edit-btn">Edit</button>
          <button class="btn btn-danger delete-btn">Delete</button>

        </div>
      </div>
    `;

    col
      .querySelector(".edit-btn")
      .addEventListener("click", () => editTask(task.id));

    col
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteTask(task.id));

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

          <h5 class="text-warning">${habit.habitName}</h5>
          <p><strong>Time:</strong> ${habit.habitTime}</p>

          <button class="btn btn-warning me-2 edit-btn">Edit</button>
          <button class="btn btn-danger delete-btn">Delete</button>

        </div>
      </div>
    `;

    col
      .querySelector(".edit-btn")
      .addEventListener("click", () => editHabit(habit.id));

    col
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteHabit(habit.id));

    adminHabitContainer.appendChild(col);
  });
}

async function deleteTask(id) {
  try {
    const res = await fetch(`${TASK_API}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete task failed");

    fetchAdminTasks();
  } catch (err) {
    console.log("Delete task error:", err);
  }
}

async function editTask(id) {
  const newStatus = prompt("Enter status: Pending / Completed");
  if (!newStatus) return;

  try {
    const res = await fetch(`${TASK_API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) throw new Error("Update task failed");

    fetchAdminTasks();
  } catch (err) {
    console.log("Edit task error:", err);
  }
}

async function deleteHabit(id) {
  try {
    const res = await fetch(`${HABIT_API}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete habit failed");

    fetchAdminHabits();
  } catch (err) {
    console.log("Delete habit error:", err);
  }
}

async function editHabit(id) {
  const newTime = prompt("Morning / Afternoon / Night");
  if (!newTime) return;

  try {
    const res = await fetch(`${HABIT_API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitTime: newTime }),
    });

    if (!res.ok) throw new Error("Update habit failed");

    fetchAdminHabits();
  } catch (err) {
    console.log("Edit habit error:", err);
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

window.editTask = editTask;
window.deleteTask = deleteTask;
window.editHabit = editHabit;
window.deleteHabit = deleteHabit;
