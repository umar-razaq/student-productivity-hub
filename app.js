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
  error.classList.add("d-none");
  error.textContent = "";
  loading.classList.remove("d-none");

  try {
    const res = await fetch(TASK_API);
    if (!res.ok) throw new Error();

    allTasks = await res.json();
    renderTasks(allTasks);
  } catch {
    error.classList.remove("d-none");
    error.textContent = "Failed to fetch tasks.";
  } finally {
    loading.classList.add("d-none");
  }
}

async function fetchHabits() {
  loading.classList.remove("d-none");
  error.classList.add("d-none");

  try {
    const res = await fetch(HABIT_API);
    if (!res.ok) throw new Error();

    allHabits = await res.json();
    renderHabits(allHabits);
  } catch {
    error.classList.remove("d-none");
    error.textContent = "Failed to load habits.";
  } finally {
    loading.classList.add("d-none");
  }
}

function renderTasks(tasks) {
  taskContainer.innerHTML = "";

  if (!tasks.length) {
    taskContainer.innerHTML = `<div class="col-12 text-center text-muted py-4">No tasks found</div>`;
    return;
  }

  tasks.forEach((task) => {
    taskContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="col-md-6 mb-4">
  <div class="card shadow-sm h-100 border-0 border-start border-4 border-primary">

    <div class="card-body d-flex flex-column">

      <!-- Title -->
      <h5 class="mb-2 fw-semibold text-primary">
        ${task.title}
      </h5>

      <!-- Badges row -->
      <div class="mb-2 d-flex flex-wrap gap-2">
        <span class="badge bg-secondary">${task.category}</span>
        <span class="badge bg-warning text-dark">${task.priority}</span>
        <span class="badge bg-success">${task.status}</span>
      </div>

      <!-- Deadline -->
      <p class="mb-1 small text-muted">
        <strong class="text-dark">Deadline:</strong> ${task.deadline}
      </p>

      <!-- Description -->
      <p class="text-muted mb-0 flex-grow-1">
        ${task.description}
      </p>

    </div>

  </div>
</div>
    `,
    );
  });
}

function renderHabits(habits) {
  habitContainer.innerHTML = "";

  if (!habits.length) {
    habitContainer.innerHTML = `<div class="col-12 text-center text-muted py-4">No habits found</div>`;
    return;
  }

  habits.forEach((habit) => {
    habitContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="col-md-6 mb-4">
    <div class="card shadow-sm h-100 habit-card border-start border-4 border-success">

    <div class="card-body">

      <h5 class="habit-title text-success mb-2">
        ${habit.habitName}
      </h5>

      <span class="badge bg-dark mb-2">
        ${habit.habitTime}
      </span>

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

  document
    .querySelectorAll(".text-danger")
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

    if (!res.ok) throw new Error();

    taskForm.reset();
    fetchTasks();
  } catch {
    error.classList.remove("d-none");
    error.textContent = "Failed to add task.";
  }
});

habitForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const habitName = document.getElementById("habitName").value.trim();
  const habitTime = document.getElementById("habitTime").value;

  document.getElementById("habitNameError").textContent = "";
  document.getElementById("habitTimeError").textContent = "";

  let ok = true;

  if (!habitName) {
    document.getElementById("habitNameError").textContent = "Required";
    ok = false;
  }
  if (!habitTime) {
    document.getElementById("habitTimeError").textContent = "Required";
    ok = false;
  }

  if (!ok) return;

  try {
    const res = await fetch(HABIT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitName, habitTime }),
    });

    if (!res.ok) throw new Error();

    habitForm.reset();
    fetchHabits();
  } catch {
    error.classList.remove("d-none");
    error.textContent = "Failed to add habit.";
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
    if (!res.ok) throw new Error();

    const data = await res.json();

    document.getElementById("quoteBox").innerHTML =
      `"${data.quote}" <br><small class="text-muted">— ${data.author}</small>`;
  } catch {
    error.classList.remove("d-none");
    error.textContent = "Failed to load quote.";

    document.getElementById("quoteBox").innerHTML =
      "Stay consistent. Keep building.";
  }
}

loadQuote();
