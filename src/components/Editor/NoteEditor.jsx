import React, { useState, useEffect } from 'react';
import { FaThumbtack } from "react-icons/fa";
import { 
  FiLock, 
  FiUnlock, 
  FiTrash2, 
  FiArrowLeft, 
  FiSave 
} from "react-icons/fi";

import { 
  generateId, 
  createNewNote, 
  encryptContent, 
  decryptContent, 
  isEncrypted 
} from '../../utils/storage.js';

import { useNotes } from '../../contexts/NotesContext.jsx';
import RichTextEditor from './RichTextEditor.jsx';
import AIPanel from './AIPanel.jsx';
import PasswordModal from '../Models/PasswordModal.jsx';
import toast from 'react-hot-toast';

export default function NoteEditor({ note, onBack }) {
  const { actions } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [summary, setSummary] = useState('');
  const [glossary, setGlossary] = useState('');
  const [grammarResults, setGrammarResults] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setTags(note.tags || []);
      setSummary(note.summary || '');
      setGlossary(note.glossary || '');
      setGrammarResults(note.grammarResults || '');
      setIsPasswordProtected(note.isPasswordProtected || false);

      if (note.isPasswordProtected && isEncrypted(note.content)) {
        setContent('');
        setIsUnlocked(false);
      } else {
        setContent(note.content || '');
        setIsUnlocked(true);
      }
    } else {
      const newNote = createNewNote();
      setTitle(newNote.title);
      setContent(newNote.content);
      setTags(newNote.tags);
      setSummary('');
      setGlossary('');
      setGrammarResults('');
      setIsPasswordProtected(false);
      setIsUnlocked(true);
    }
    setHasUnsavedChanges(false);
  }, [note]);

  useEffect(() => {
    if (note) {
      const hasChanges = 
        title !== (note.title || '') ||
        content !== (note.content || '') ||
        JSON.stringify(tags) !== JSON.stringify(note.tags || []) ||
        summary !== (note.summary || '') ||
        glossary !== (note.glossary || '') ||
        grammarResults !== (note.grammarResults || '') ||
        isPasswordProtected !== (note.isPasswordProtected || false);
      
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(title.trim() !== '' || content.trim() !== '');
    }
  }, [title, content, tags, summary, glossary, grammarResults, isPasswordProtected, note]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    if (!isUnlocked && isPasswordProtected) {
      toast.error('Note is locked. Unlock to save changes.');
      return;
    }

    try {
      let finalContent = content;
      if (isPasswordProtected && password) {
        finalContent = encryptContent(content, password);
      }

      const now = new Date();
      const noteToSave = {
        id: note?.id || generateId(),
        title: title.trim(),
        content: finalContent,
        createdAt: note?.createdAt || now,
        updatedAt: now,
        isPinned: note?.isPinned || false,
        isPasswordProtected,
        tags: tags.filter(Boolean), 
        summary: summary || undefined,
        glossary: glossary || undefined,
        grammarResults: grammarResults || undefined,
      };

      if (note) {
        actions.updateNote(noteToSave);
      } else {
        actions.addNote(noteToSave);
        actions.setSelectedNote(noteToSave);
      }

      setHasUnsavedChanges(false);
      toast.success('Note saved!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handlePasswordSubmit = (inputPassword) => {
    if (!note) return;

    try {
      const decryptedContent = decryptContent(note.content, inputPassword);
      if (decryptedContent) {
        setContent(decryptedContent);
        setPassword(inputPassword);
        setIsUnlocked(true);
        setShowPasswordModal(false);
        toast.success('Note unlocked!');
      }
    } catch (error) {
      console.error('Decryption error:', error);
      toast.error('Incorrect password');
    }
  };

  const togglePasswordProtection = () => {
    if (!isPasswordProtected) {
      setShowPasswordModal(true);
    } else {
      setIsPasswordProtected(false);
      setPassword('');
      toast.success('Password protection removed');
    }
  };

  const handlePasswordCreate = (newPassword) => {
    setPassword(newPassword);
    setIsPasswordProtected(true);
    setShowPasswordModal(false);
    toast.success('Password protection enabled');
  };

  const handleDelete = () => {
    if (note && window.confirm('Are you sure you want to delete this note?')) {
      actions.deleteNote(note.id);
      toast.success('Note deleted');
      onBack();
    }
  };

  const handleTogglePin = () => {
    if (note) {
      actions.togglePin(note.id);
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to save your note before leaving?'
      );
      
      if (confirmLeave) {
        if (!title.trim()) {
          toast.error('Please enter a title before saving');
          return;
        }
        
        if (!content.trim()) {
          toast.error('Please add some content before saving');
          return;
        }

        if (!isUnlocked && isPasswordProtected) {
          toast.error('Note is locked. Unlock to save changes.');
          return;
        }

        handleSave();
        
        setTimeout(() => {
          onBack();
        }, 100);
      }
    } else {
      onBack();
    }
  };

  if (!isUnlocked && isPasswordProtected) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiLock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Note is Password Protected</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Enter the password to view and edit this note</p>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
          >
            Unlock Note
          </button>
        </div>

        <PasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
          mode="verify"
          title="Enter Password"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <button
          onClick={handleBack}
          className="flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 transition-colors font-medium text-sm sm:text-base"
        >
          <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Back to Notes</span>
        </button>

        <div className="flex items-center justify-center space-x-2">
          {note && (
            <>
              <button
                onClick={handleTogglePin}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  note.isPinned
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <FaThumbtack className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={handleDelete}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete note"
              >
                <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </>
          )}

          <button
            onClick={togglePasswordProtection}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              isPasswordProtected
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={isPasswordProtected ? 'Remove password protection' : 'Add password protection'}
          >
            {isPasswordProtected ? <FiLock className="w-3 h-3 sm:w-4 sm:h-4" /> : <FiUnlock className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <FiSave className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Editor */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6 order-2 xl:order-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-xl sm:text-2xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
          />

          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your note..."
          />

          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
            <input
              type="text"
              value={tags.join(', ')}
              onChange={(e) =>
                setTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))
              }
              placeholder="Add tags separated by commas..."
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {summary && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <label className="block text-sm font-medium text-purple-900 mb-2">AI Summary</label>
              <p className="text-sm sm:text-base text-purple-600">{summary}</p>
            </div>
          )}

          {glossary && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
              <label className="block text-sm font-medium text-orange-800 mb-2">Glossary</label>
              <div className="text-sm sm:text-base text-orange-700 space-y-1">
                {glossary.split('\n').map((line, index) => {
                  const cleanedLine = line.replace(/\*\*/g, "").trim();
                  return (
                    <div key={index}>
                      {cleanedLine && <div>{cleanedLine}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {grammarResults && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <label className="block text-sm font-medium text-green-800 mb-2">Grammar Check</label>
              <div className="text-sm sm:text-base text-green-700 space-y-2">
                {grammarResults.split('\n').map((line, index) => {
                  if (!line.trim()) return null;
                  
                  const formattedLine = line.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  
                  return (
                    <div key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-1 order-1 xl:order-2">
          <AIPanel
            content={content}
            onSummaryGenerated={setSummary}
            onTagsGenerated={(newTags) => setTags(prev => [...new Set([...prev, ...newTags])])}
            onGlossaryGenerated={setGlossary}
            onGrammarChecked={setGrammarResults}
          />
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={isPasswordProtected ? handlePasswordSubmit : handlePasswordCreate}
        mode={isPasswordProtected ? 'verify' : 'create'}
        title={isPasswordProtected ? 'Enter Password' : 'Set Password'}
      />
    </div>
  );
}