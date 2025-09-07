import CryptoJS from 'crypto-js';

const NOTES_KEY = 'shareable-notes';
const ENCRYPTED_PREFIX = 'encrypted:';

export function loadNotesFromStorage() {
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    if (!stored) {
      console.log('No notes found in localStorage, returning empty array');
      return [];
    }

    const parsed = JSON.parse(stored);
    console.log(`Loaded ${parsed.length} notes from localStorage`);
    
    return parsed.map((note) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading notes from storage:', error);
    localStorage.removeItem(NOTES_KEY);
    return [];
  }
}

export function saveNotesToStorage(notes) {
  try {
    const serialized = JSON.stringify(notes);
    localStorage.setItem(NOTES_KEY, serialized);
    console.log(`Saved ${notes.length} notes to localStorage`);
    return true;
  } catch (error) {
    console.error('Error saving notes to storage:', error);
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider implementing cleanup.');
    }
    return false;
  }
}

export function encryptContent(content, password) {
  const encrypted = CryptoJS.AES.encrypt(content, password).toString();
  return ENCRYPTED_PREFIX + encrypted;
}

export function decryptContent(encryptedContent, password) {
  if (!encryptedContent.startsWith(ENCRYPTED_PREFIX)) {
    return encryptedContent;
  }

  try {
    const encrypted = encryptedContent.replace(ENCRYPTED_PREFIX, '');
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Failed to decrypt - invalid password');
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed - incorrect password');
  }
}

export function isEncrypted(content) {
  return content && content.startsWith(ENCRYPTED_PREFIX);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function createNewNote() {
  const now = new Date();
  return {
    id: generateId(),
    title: '',
    content: '',
    createdAt: now,
    updatedAt: now,
    isPinned: false,
    isPasswordProtected: false,
    tags: [],
  };
}

export function sanitizeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function extractTextFromHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export function clearNotesFromStorage() {
  localStorage.removeItem(NOTES_KEY);
  console.log('Cleared all notes from localStorage');
}

export function exportNotes() {
  const notes = loadNotesFromStorage();
  return JSON.stringify(notes, null, 2);
}

export function importNotes(jsonString) {
  try {
    const notes = JSON.parse(jsonString);
    saveNotesToStorage(notes);
    return notes;
  } catch (error) {
    console.error('Error importing notes:', error);
    throw new Error('Invalid JSON format');
  }
}