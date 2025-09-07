import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { NotesProvider, useNotes } from './contexts/NotesContext.jsx';
import { generateId } from './utils/storage.js';
import Header from './components/Layout/Header.jsx';
import NotesList from './components/Notes/NotesList.jsx';
import NoteEditor from './components/Editor/NoteEditor.jsx';

function AppContent() {
  const { state, dispatch } = useNotes();
  const [currentView, setCurrentView] = useState('list'); 

  const handleNewNote = () => {
    dispatch({ type: 'SET_SELECTED_NOTE', payload: null });
    setCurrentView('editor');
  };

  const handleNoteClick = (note) => {
    dispatch({ type: 'SET_SELECTED_NOTE', payload: note });
    setCurrentView('editor');
  };

  const handleSaveNote = (note) => {
    if (state.selectedNote) {
      dispatch({ type: 'UPDATE_NOTE', payload: note });
    } else {
      dispatch({
        type: 'ADD_NOTE',
        payload: { ...note, id: note.id || generateId() },
      });
    }
    setCurrentView('list');
  };

  const handleDeleteNote = (noteId) => {
    dispatch({ type: 'DELETE_NOTE', payload: noteId });
    if (currentView === 'editor') {
      setCurrentView('list');
    }
  };

  const handlePinNote = (noteId) => {
    dispatch({ type: 'TOGGLE_PIN', payload: noteId });
  };

  const handleSearch = (term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const handleBackToList = () => {
    setCurrentView('list');
    dispatch({ type: 'SET_SELECTED_NOTE', payload: null });
  };

  const handleAITest = () => {
    setCurrentView('ai-test');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <NotesList
            notes={state.notes}
            searchTerm={state.searchTerm}
            onNoteClick={handleNoteClick}
            onPinNote={handlePinNote}
            onDeleteNote={handleDeleteNote}
            isLoading={state.isLoading}
          />
        );
      case 'editor':
        return (
          <NoteEditor
            note={state.selectedNote}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onBack={handleBackToList}
            onPin={handlePinNote}
          />
        );
      case 'ai-test':
        return (
          <div className="w-full">
            {/* Back button for AI test view */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={handleBackToList}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                ← Back to Notes
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header 
        onNewNote={handleNewNote} 
        onSearch={handleSearch}
        onHomeClick={handleBackToList}  
        onAITest={handleAITest}
        currentView={currentView}
      />
      
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="w-full">
          {renderCurrentView()}
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: window.innerWidth < 640 ? '14px' : '16px',
            padding: window.innerWidth < 640 ? '8px 12px' : '16px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;