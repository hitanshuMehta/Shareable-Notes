import React, { useRef, useEffect, useState } from 'react';
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight } from 'react-icons/fi';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }) {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      const sanitizedContent = DOMPurify.sanitize(content);
      editorRef.current.innerHTML = sanitizedContent;
    }
  }, [content]);

  const execCommand = (command, value) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const sanitizedText = DOMPurify.sanitize(text);
    document.execCommand('insertText', false, sanitizedText);
    handleInput();
  };

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
    return document.queryCommandState(command);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 border-b border-gray-200 bg-gray-50 space-y-2 sm:space-y-0">
        <div className="flex items-center flex-wrap gap-1 sm:space-x-1">
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
      />

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