import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiRotateCcw, FiRotateCw } from 'react-icons/fi';

// Mock DOMPurify for this example
const DOMPurify = {
  sanitize: (content) => content
};

// Mock toast for this example
const toast = {
  success: (message) => console.log('Success:', message),
  error: (message) => console.log('Error:', message)
};

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }) {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  
  // Undo/Redo state
  const [history, setHistory] = useState([content || '']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  // Debounced history saving
  const saveTimeoutRef = useRef(null);
  const lastSavedContentRef = useRef(content || '');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content && !isUndoRedo) {
      const sanitizedContent = DOMPurify.sanitize(content);
      editorRef.current.innerHTML = sanitizedContent;
    }
  }, [content, isUndoRedo]);

  // Save to history with debouncing
  const saveToHistory = useCallback((newContent) => {
    if (isUndoRedo || newContent === lastSavedContentRef.current) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce saving to history
    saveTimeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        
        // Limit history size to prevent memory issues
        const maxHistorySize = 50;
        if (newHistory.length > maxHistorySize) {
          return newHistory.slice(-maxHistorySize);
        }
        return newHistory;
      });
      
      setHistoryIndex(prev => Math.min(prev + 1, 49)); // Adjust for max history size
      lastSavedContentRef.current = newContent;
    }, 500); // Save after 500ms of inactivity
  }, [historyIndex, isUndoRedo]);

  const execCommand = (command, value) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      saveToHistory(newContent);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      saveToHistory(newContent);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const sanitizedText = DOMPurify.sanitize(text);
    document.execCommand('insertText', false, sanitizedText);
    handleInput();
  };

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevContent = history[newIndex];
      
      setIsUndoRedo(true);
      setHistoryIndex(newIndex);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = prevContent;
      }
      onChange(prevContent);
      
      // Reset the flag after a brief delay
      setTimeout(() => setIsUndoRedo(false), 10);
      
      toast.success('Undone');
    } else {
      toast.error('Nothing to undo');
    }
  }, [history, historyIndex, onChange]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextContent = history[newIndex];
      
      setIsUndoRedo(true);
      setHistoryIndex(newIndex);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
      }
      onChange(nextContent);
      
      // Reset the flag after a brief delay
      setTimeout(() => setIsUndoRedo(false), 10);
      
      toast.success('Redone');
    } else {
      toast.error('Nothing to redo');
    }
  }, [history, historyIndex, onChange]);

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo(); // Ctrl+Shift+Z or Cmd+Shift+Z for redo
          } else {
            undo(); // Ctrl+Z or Cmd+Z for undo
          }
          break;
        case 'y':
          e.preventDefault();
          redo(); // Ctrl+Y or Cmd+Y for redo (Windows style)
          break;
        default:
          break;
      }
    }
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${size}px`;
    }
    toast.success(`Font size changed to ${size}px`);
  };

  const isCommandActive = (command) => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  // Check if undo/redo is available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 border-b border-gray-200 bg-gray-50 space-y-2 sm:space-y-0">
        <div className="flex items-center flex-wrap gap-1 sm:space-x-1">
          {/* Undo/Redo buttons */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
              !canUndo
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <FiRotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
              !canRedo
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          >
            <FiRotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <div className="w-px h-4 sm:h-6 bg-gray-300 mx-1 sm:mx-2" />

          <button
            onClick={() => execCommand('bold')}
            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
              isCommandActive('bold')
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Bold (Ctrl+B)"
          >
            <FiBold className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => execCommand('italic')}
            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
              isCommandActive('italic')
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Italic (Ctrl+I)"
          >
            <FiItalic className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => execCommand('underline')}
            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
              isCommandActive('underline')
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Underline (Ctrl+U)"
          >
            <FiUnderline className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <div className="w-px h-4 sm:h-6 bg-gray-300 mx-1 sm:mx-2" />

          <button
            onClick={() => execCommand('justifyLeft')}
            className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Align Left"
          >
            <FiAlignLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => execCommand('justifyCenter')}
            className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Align Center"
          >
            <FiAlignCenter className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => execCommand('justifyRight')}
            className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Align Right"
          >
            <FiAlignRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-600">Size:</span>
          <select
            value={fontSize}
            onChange={(e) => changeFontSize(Number(e.target.value))}
            className="text-xs sm:text-sm border border-gray-300 rounded px-1 sm:px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
            <option value={24}>24px</option>
          </select>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="min-h-64 sm:min-h-80 md:min-h-96 p-3 sm:p-4 md:p-6 focus:outline-none text-gray-900 leading-relaxed"
        style={{ fontSize: `${fontSize}px` }}
        data-placeholder={placeholder}
        dir="ltr"
        suppressContentEditableWarning={true}
      />

      {/* History indicator */}
      <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <span>History: {historyIndex + 1}/{history.length}</span>
        <span>
          Shortcuts: Ctrl+Z (Undo), Ctrl+Y or Ctrl+Shift+Z (Redo)
        </span>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}