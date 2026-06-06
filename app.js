const TASK_API = "http://localhost:3000/tasks";
const HABIT_API = "http://localhost:3000/habits";

const taskContainer = document.getElementById("taskContainer");
const habitContainer = document.getElementById("habitContainer");

const taskForm = document.getElementById("taskForm");
const habitForm = document.getElementById("habitForm");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");
const filterCategory = document.getElementById("filterCategory");

let allTasks = [];
let allHabits = [];

async function fetchTasks() {
  loading.classList.remove("d-none");
  error.classList.add("d-none");

  try {
    const res = await fetch(TASK_API);
    if (!res.ok) throw new Error("Failed to fetch tasks");

    allTasks = await res.json();
    renderTasks(allTasks);
  } catch (err) {
    alert("Failed to add habit.");
    error.classList.remove("d-none");
  } finally {
    loading.classList.add("d-none");
  }
}

async function fetchHabits() {
  try {
    const res = await fetch(HABIT_API);
    if (!res.ok) throw new Error("Failed to fetch habits");

    allHabits = await res.json();
    renderHabits(allHabits);
  } catch (err) {
    alert("Failed to add habit.");
  }
}

function renderTasks(tasks) {
  taskContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskContainer.innerHTML = `
      <div class="col-12">
        <div class="text-center py-5 text-muted">
          <h5>No tasks found</h5>
        </div>
      </div>
    `;
    return;
  }

  tasks.forEach((task) => {
    taskContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">

            <h5>${task.title}</h5>

            <p><strong>Category:</strong> ${task.category}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            <p><strong>Deadline:</strong> ${task.deadline}</p>

            <p>${task.description}</p>

          </div>
        </div>
      </div>
    `,
    );
  });
}

function renderHabits(habits) {
  habitContainer.innerHTML = "";

  if (habits.length === 0) {
    habitContainer.innerHTML = `
      <div class="col-12">
        <div class="text-center py-5 text-muted">
          <h5>No habits found</h5>
        </div>
      </div>
    `;
    return;
  }

  habits.forEach((habit) => {
    habitContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col-md-6 mb-3">
        <div class="card border-success shadow-sm">
          <div class="card-body">

            <h5 class="text-success">${habit.habitName}</h5>
            <p><strong>Time:</strong> ${habit.habitTime}</p>

          </div>
        </div>
      </div>
    `,
    );
  });
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titleVal = document.getElementById("title").value.trim();
  const categoryVal = document.getElementById("category").value;
  const priorityVal = document.getElementById("priority").value;
  const statusVal = document.getElementById("status").value;
  const deadlineVal = document.getElementById("deadline").value;
  const descriptionVal = document.getElementById("description").value.trim();

  document.querySelectorAll(".text-danger")
    .forEach((el) => (el.textContent = ""));

  let ok = true;

  if (!titleVal) {
    document.getElementById("titleError").textContent = "Required";
    ok = false;
  }

  if (!categoryVal) {
    document.getElementById("categoryError").textContent = "Required";
    ok = false;
  }

  if (!priorityVal) {
    document.getElementById("priorityError").textContent = "Required";
    ok = false;
  }

  if (!statusVal) {
    document.getElementById("statusError").textContent = "Required";
    ok = false;
  }

  if (!deadlineVal) {
    document.getElementById("deadlineError").textContent = "Required";
    ok = false;
  }

  if (!ok) return;

  try {
    const res = await fetch(TASK_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titleVal,
        category: categoryVal,
        priority: priorityVal,
        status: statusVal,
        deadline: deadlineVal,
        description: descriptionVal,
      }),
    });

    if (!res.ok) throw new Error("Task creation failed");

    taskForm.reset();
    fetchTasks();
  } catch (err) {
    alert("Failed to add habit.");
    error.classList.remove("d-none");
  }
});

habitForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const habitName = document.getElementById("habitName").value.trim();
  const habitTime = document.getElementById("habitTime").value;

  if (!habitName || !habitTime) return;

  try {
    const res = await fetch(HABIT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitName, habitTime }),
    });

    if (!res.ok) throw new Error("Habit creation failed");

    habitForm.reset();
    fetchHabits();
  } catch (err) {
    alert("Failed to add habit.");
  }
});

function applyFilters() {
  let filtered = [...allTasks];

  if (filterStatus.value)
    filtered = filtered.filter((t) => t.status === filterStatus.value);

  if (filterPriority.value)
    filtered = filtered.filter((t) => t.priority === filterPriority.value);

  if (filterCategory.value)
    filtered = filtered.filter((t) => t.category === filterCategory.value);

  renderTasks(filtered);
}

filterStatus.addEventListener("change", applyFilters);
filterPriority.addEventListener("change", applyFilters);
filterCategory.addEventListener("change", applyFilters);

fetchTasks();
fetchHabits();

async function loadQuote() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("Quote API failed");

    const data = await res.json();

    document.getElementById("quoteBox").innerHTML = `
      "${data.quote}" <br>
      <small class="text-muted">— ${data.author}</small>
    `;
  } catch (err) {
    alert("Failed to add habit.");
    document.getElementById("quoteBox").innerHTML =
      "Stay consistent. Keep building.";
  }
}

loadQuote();
