const STORAGE_KEY = "notes-app.notes";

// Lapisan data tunggal untuk aplikasi. Storage disuntik agar unit test
// dapat memakai pengganti localStorage tanpa bergantung pada browser.
export function createStore(storage = globalThis.localStorage) {
  function readNotes() {
    try {
      const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (note) =>
          note &&
          (typeof note.id === "string" || typeof note.id === "number") &&
          typeof note.title === "string" &&
          typeof note.body === "string",
      );
    } catch {
      // Data kosong, korup, atau storage yang tidak tersedia dibaca sebagai
      // daftar kosong agar aplikasi tetap dapat digunakan.
      return [];
    }
  }

  function writeNotes(notes) {
    storage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  function list() {
    return readNotes();
  }

  function save(note) {
    const notes = readNotes();
    const savedNote = {
      ...note,
      id: note?.id ?? globalThis.crypto.randomUUID(),
      title: typeof note?.title === "string" ? note.title : "",
      body: typeof note?.body === "string" ? note.body : "",
    };
    const existingIndex = notes.findIndex(
      (existingNote) => existingNote.id === savedNote.id,
    );

    if (existingIndex === -1) {
      notes.push(savedNote);
    } else {
      notes[existingIndex] = savedNote;
    }

    writeNotes(notes);
    return savedNote;
  }

  function remove(id) {
    // Menghapus id yang tidak ada tidak mengubah data dan tidak membuat error.
    writeNotes(readNotes().filter((note) => note.id !== id));
  }

  function search(query) {
    // Pencarian substring, case-insensitive; query kosong menampilkan semua.
    const normalizedQuery =
      typeof query === "string" ? query.trim().toLocaleLowerCase() : "";

    if (!normalizedQuery) return list();

    return readNotes().filter(
      (note) =>
        note.title.toLocaleLowerCase().includes(normalizedQuery) ||
        note.body.toLocaleLowerCase().includes(normalizedQuery),
    );
  }

  return { list, save, remove, search };
}
