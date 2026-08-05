const STORAGE_KEY = "bitacora_tasks";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const emptyStateText = document.getElementById("empty-state-text");
const errorMsg = document.getElementById("error-msg");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filter-btn");
const statsLabel = document.getElementById("stats-label");
const statsPercent = document.getElementById("stats-percent");
const progressFill = document.getElementById("progress-fill");
const resultsCount = document.getElementById("results-count");
const logoutBtn = document.getElementById("logout-btn");

let editingId = null;
let currentFilter = "all";
let currentSearch = "";


function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


function createTask(title, description) {
  const tasks = getTasks();
  tasks.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  });
  saveTasks(tasks);
}


function updateTask(id, changes) {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;
  tasks[index] = { ...tasks[index], ...changes };
  saveTasks(tasks);
}


function deleteTask(id) {
  saveTasks(getTasks().filter((t) => t.id !== id));
}


function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

function clearError() {
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";
}

function validate(title) {
  if (!title || title.trim() === "") {
    showError('El campo "titulo" es obligatorio.');
    return false;
  }
  clearError();
  return true;
}


function getVisibleTasks() {
  const tasks = getTasks();
  return tasks.filter((task) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "pending" && !task.completed) ||
      (currentFilter === "done" && task.completed);

    const query = currentSearch.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      task.title.toLowerCase().includes(query) ||
      (task.description || "").toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });
}


function renderStats() {
  const tasks = getTasks();
  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  statsLabel.textContent = `${done} de ${total} tareas completadas`;
  statsPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const options = { hour: "2-digit", minute: "2-digit" };
  const time = date.toLocaleTimeString([], options);
  return isToday
    ? `Hoy, ${time}`
    : `${date.toLocaleDateString()}, ${time}`;
}


function render() {
  const visible = getVisibleTasks();
  taskList.innerHTML = "";

  if (currentSearch.trim() !== "") {
    resultsCount.textContent = `${visible.length} resultado(s)`;
  } else {
    resultsCount.textContent = "";
  }

  const allTasks = getTasks();
  if (allTasks.length === 0) {
    emptyStateText.textContent = "La bitácora está en blanco. Anota tu primera tarea arriba.";
    emptyState.classList.remove("hidden");
  } else if (visible.length === 0) {
    emptyStateText.textContent = "Nada coincide con tu búsqueda o filtro.";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = "entry-item" + (task.completed ? " entry-item--done" : "");

    li.innerHTML = `
      <input type="checkbox" class="entry-item__check" data-testid="task-checkbox" ${task.completed ? "checked" : ""} />
      <div class="entry-item__body">
        <div class="entry-item__title"></div>
        <div class="entry-item__description"></div>
        <div class="entry-item__date">Creada: ${formatDate(task.createdAt)}</div>
      </div>
      <div class="entry-item__actions">
        <button class="edit-btn" type="button" data-testid="task-edit">Editar</button>
        <button class="delete-btn" type="button" data-testid="task-delete">Eliminar</button>
      </div>
    `;

    li.querySelector(".entry-item__title").textContent = task.title;
    li.querySelector(".entry-item__description").textContent = task.description || "";

    li.querySelector(".entry-item__check").addEventListener("change", (e) => {
      updateTask(task.id, { completed: e.target.checked });
      render();
      renderStats();
    });

    li.querySelector(".edit-btn").addEventListener("click", () => startEdit(task));

    li.querySelector(".delete-btn").addEventListener("click", () => {
      const confirmed = confirm(`¿Eliminar la tarea "${task.title}"?`);
      if (!confirmed) return;
      deleteTask(task.id);
      render();
      renderStats();
    });

    taskList.appendChild(li);
  });

  renderStats();
}


function startEdit(task) {
  editingId = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || "";
  submitBtn.textContent = "Guardar cambios";
  cancelEditBtn.classList.remove("hidden");
  titleInput.focus();
}

function stopEdit() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Anotar tarea";
  cancelEditBtn.classList.add("hidden");
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const description = descriptionInput.value;

  if (!validate(title)) return;

  if (editingId !== null) {
    updateTask(editingId, { title: title.trim(), description: description.trim() });
  } else {
    createTask(title, description);
  }

  stopEdit();
  render();
});

cancelEditBtn.addEventListener("click", stopEdit);

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  render();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logout();
  });
}


render();