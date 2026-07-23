// ---- state ----
// notes are stored as an array of objects in localStorage under one key,
// so the whole app persists as a single JSON blob:
// { id, title, content, updatedAt }
const STORAGE_KEY = 'notes-app:notes';

let notes = loadNotes();
let searchTerm = '';

// ---- element references ----
const form = document.querySelector('#note-form');
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector('#content');
const titleError = document.querySelector('#title-error');
const contentError = document.querySelector('#content-error');
const editIdInput = document.querySelector('#edit-id');
const submitBtn = document.querySelector('#submit-btn');
const cancelBtn = document.querySelector('#cancel-edit');
const grid = document.querySelector('#notes-grid');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search');

// ---- localStorage helpers ----
function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read notes from storage:', err);
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ---- validation ----
function validate() {
  let isValid = true;
  titleError.textContent = '';
  contentError.textContent = '';

  if (titleInput.value.trim() === '') {
    titleError.textContent = 'Title can\'t be empty.';
    isValid = false;
  }

  if (contentInput.value.trim() === '') {
    contentError.textContent = 'Write something before saving.';
    isValid = false;
  }

  return isValid;
}

// ---- form submit: create or update ----
form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validate()) return;

  const editId = editIdInput.value;

  if (editId) {
    // update existing note
    const note = notes.find(function (n) { return n.id === editId; });
    if (note) {
      note.title = titleInput.value.trim();
      note.content = contentInput.value.trim();
      note.updatedAt = Date.now();
    }
  } else {
    // create new note
    notes.unshift({
      id: crypto.randomUUID(),
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      updatedAt: Date.now()
    });
  }

  saveNotes();
  resetForm();
  render();
});

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  editIdInput.value = '';
  titleError.textContent = '';
  contentError.textContent = '';
  submitBtn.textContent = 'Add note';
  cancelBtn.classList.add('is-hidden');
}

// ---- search ----
searchInput.addEventListener('input', function () {
  searchTerm = searchInput.value.trim().toLowerCase();
  render();
});

// ---- edit / delete (event delegation on the grid) ----
grid.addEventListener('click', function (e) {
  const editBtn = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  if (editBtn) {
    const id = editBtn.dataset.id;
    const note = notes.find(function (n) { return n.id === id; });
    if (!note) return;

    titleInput.value = note.title;
    contentInput.value = note.content;
    editIdInput.value = note.id;
    submitBtn.textContent = 'Save changes';
    cancelBtn.classList.remove('is-hidden');
    titleInput.focus();
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    notes = notes.filter(function (n) { return n.id !== id; });
    saveNotes();
    render();
  }
});

// ---- format the "last edited" timestamp ----
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return 'Edited ' + date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

// ---- build one note card ----
function createNoteCard(note) {
  const card = document.createElement('div');
  card.className = 'note-card';

  const title = document.createElement('p');
  title.className = 'note-card__title';
  title.textContent = note.title;

  const content = document.createElement('p');
  content.className = 'note-card__content';
  content.textContent = note.content;

  const meta = document.createElement('p');
  meta.className = 'note-card__meta';
  meta.textContent = formatTime(note.updatedAt);

  const actions = document.createElement('div');
  actions.className = 'note-card__actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.dataset.id = note.id;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.dataset.id = note.id;

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(title);
  card.appendChild(content);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

// ---- render ----
function render() {
  grid.innerHTML = '';

  const visibleNotes = notes.filter(function (n) {
    if (!searchTerm) return true;
    return n.title.toLowerCase().includes(searchTerm) ||
           n.content.toLowerCase().includes(searchTerm);
  });

  visibleNotes.forEach(function (note) {
    grid.appendChild(createNoteCard(note));
  });

  emptyState.classList.toggle('is-hidden', notes.length > 0);
}

render();
