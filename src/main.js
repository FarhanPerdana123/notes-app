import './style.css';
import { createStore } from './storage.js';

const store = createStore();

const app = document.querySelector('#app');

// State sederhana untuk catatan yang sedang diedit/dipilih.
const state = {
  query: '',
  selectedId: null,
};

const elements = {
  app,
  list: document.querySelector('#note-list'),
  empty: document.querySelector('#empty-state'),
  search: document.querySelector('#search'),
  form: document.querySelector('#note-form'),
  title: document.querySelector('#title'),
  body: document.querySelector('#body'),
  add: document.querySelector('#add'),
  delete: document.querySelector('#delete'),
};

function render() {
  const notes = store.search(state.query);

  if (elements.list) {
    elements.list.innerHTML = '';
    notes.forEach((note) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'note-item';
      item.setAttribute('aria-pressed', String(note.id === state.selectedId));
      item.innerHTML = `
        <span class="note-title"></span>
        <span class="note-body"></span>
      `;
      item.querySelector('.note-title').textContent = note.title || '(Tanpa judul)';
      item.querySelector('.note-body').textContent = note.body || '';
      item.addEventListener('click', () => {
        state.selectedId = note.id;
        elements.title.value = note.title;
        elements.body.value = note.body;
        render();
      });
      elements.list.appendChild(item);
    });
  }

  if (elements.empty) {
    elements.empty.hidden = notes.length !== 0;
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2000);
}

function submitNote(event) {
  event.preventDefault();
  const title = elements.title.value.trim();
  const body = elements.body.value.trim();

  if (!title && !body) {
    showToast('Judul atau isi belum diisi');
    return;
  }

  const existing = state.selectedId
    ? store.list().find((note) => note.id === state.selectedId)
    : null;
  store.save({ id: existing?.id, title, body });
  state.selectedId = null;
  elements.title.value = '';
  elements.body.value = '';
  elements.title.focus();
  render();
}

function removeSelected() {
  if (!state.selectedId) return;
  store.remove(state.selectedId);
  state.selectedId = null;
  elements.title.value = '';
  elements.body.value = '';
  elements.title.focus();
  render();
}

function startNewNote() {
  state.selectedId = null;
  elements.title.value = '';
  elements.body.value = '';
  elements.title.focus();
}

function searchNotes() {
  state.query = elements.search.value;
  render();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW gagal didaftarkan (mis. saat mode preview/CI); aplikasi tetap jalan.
    });
  });
}

// Cadangkan aset halaman saat ini ke Cache Storage agar tetap tersedia saat
// reload offline. Berjalan di klien karena first load belum dikontrol SW,
// sehingga aset ber-hash tidak sempat ter-cache oleh SW.
async function cacheCurrentPageAssets() {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open('notes-app-v1');
    const urls = ['/', '/index.html', '/manifest.webmanifest'];
    performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .forEach((url) => urls.push(url));
    await Promise.all(
      [...new Set(urls)].map((url) => cache.add(url).catch(() => {})),
    );
  } catch {
    // Kegagalan precache tidak menghentikan aplikasi.
  }
}

function init() {
  elements.add.addEventListener('click', startNewNote);
  elements.delete.addEventListener('click', removeSelected);
  elements.search.addEventListener('input', searchNotes);
  elements.form.addEventListener('submit', submitNote);
  registerServiceWorker();
  cacheCurrentPageAssets();
  render();
}

init();
