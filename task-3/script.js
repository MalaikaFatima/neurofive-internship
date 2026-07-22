// ---- state ----
// single source of truth: an array of task objects.
// the DOM is never trusted for data — it's rebuilt from this array every time.
let tasks = [];
let currentFilter = 'all';

// ---- element references (querySelector) ----
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const counter = document.querySelector('#counter');
const emptyState = document.querySelector('#empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');

// ---- add task ----
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const text = input.value.trim();
  if (text === '') return;

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  input.value = '';
  render();
});

// ---- filter buttons ----
filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach(function (b) {
      b.classList.remove('is-active');
    });
    btn.classList.add('is-active');

    render();
  });
});

// ---- build one task's DOM node (no innerHTML string building) ----
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task' + (task.completed ? ' is-completed' : '');
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task__checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', function () {
    toggleComplete(task.id);
  });

  const span = document.createElement('span');
  span.className = 'task__text';
  span.textContent = task.text; // textContent, not innerHTML — safe from injection

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task__delete';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.addEventListener('click', function () {
    deleteTask(task.id);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// ---- actions ----
function toggleComplete(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) task.completed = !task.completed;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  render();
}

// ---- apply current filter ----
function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(function (t) { return !t.completed; });
  }
  if (currentFilter === 'completed') {
    return tasks.filter(function (t) { return t.completed; });
  }
  return tasks;
}

// ---- render: clears the list and rebuilds it from the tasks array ----
function render() {
  list.innerHTML = ''; // clearing is fine — the rebuild below uses real DOM methods, not string HTML

  const visibleTasks = getFilteredTasks();

  visibleTasks.forEach(function (task) {
    list.appendChild(createTaskElement(task));
  });

  emptyState.classList.toggle('is-hidden', tasks.length > 0);

  const remaining = tasks.filter(function (t) { return !t.completed; }).length;
  counter.textContent = remaining + ' task' + (remaining === 1 ? '' : 's') + ' remaining';
}

// ---- initial render ----
render();
