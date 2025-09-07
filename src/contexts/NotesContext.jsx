import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadNotesFromStorage, saveNotesToStorage } from '../utils/storage.js';

const NotesContext = createContext(null);

const initialState = {
  notes: [],
  searchTerm: '',
  selectedNote: null,
  isLoading: true, 
  error: null,
};

function notesReducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload, error: null };

    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes], error: null };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
        selectedNote: state.selectedNote?.id === action.payload.id 
          ? action.payload 
          : state.selectedNote,
        error: null,
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        selectedNote:
          state.selectedNote?.id === action.payload ? null : state.selectedNote,
        error: null,
      };

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };

    case 'SET_SELECTED_NOTE':
      return { ...state, selectedNote: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'TOGGLE_PIN':
      const updatedNotes = state.notes.map((note) =>
        note.id === action.payload
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
          : note
      );
      return {
        ...state,
        notes: updatedNotes,
        selectedNote: state.selectedNote?.id === action.payload
          ? { ...state.selectedNote, isPinned: !state.selectedNote.isPinned, updatedAt: new Date() }
          : state.selectedNote,
        error: null,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

 useEffect(() => {
    const loadNotes = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const notes = loadNotesFromStorage();
        console.log('Loaded notes:', notes);
        dispatch({ type: 'SET_NOTES', payload: notes });
      } catch (error) {
        console.error('❌ Error loading notes:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load notes from storage' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    if (state.isLoading) return;
    
    try {
      const success = saveNotesToStorage(state.notes);
      if (!success) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save notes to storage' });
      }
    } catch (error) {
      console.error('❌ Error saving notes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save notes to storage' });
    }
  }, [state.notes, state.isLoading]);

  const actions = {
    addNote: (note) => dispatch({ type: 'ADD_NOTE', payload: note }),
    updateNote: (note) => dispatch({ type: 'UPDATE_NOTE', payload: note }),
    deleteNote: (noteId) => dispatch({ type: 'DELETE_NOTE', payload: noteId }),
    togglePin: (noteId) => dispatch({ type: 'TOGGLE_PIN', payload: noteId }),
    setSearchTerm: (term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
    setSelectedNote: (note) => dispatch({ type: 'SET_SELECTED_NOTE', payload: note }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };

  return (
    <NotesContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}