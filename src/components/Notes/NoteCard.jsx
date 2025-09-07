import React from 'react';
import { extractTextFromHtml } from '../../utils/storage.js';
import { FaThumbtack } from "react-icons/fa";
import { FiLock, FiTrash2, FiTag, FiCalendar, FiBookOpen, FiCheckCircle, FiFileText } from "react-icons/fi";

export default function NoteCard({ note, onClick, onPin, onDelete }) {
  const textContent = extractTextFromHtml(note.content);
  const preview = textContent.slice(0, 120) + (textContent.length > 120 ? '...' : '');

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl border ${
        note.isPinned ? 'border-yellow-300 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      } p-3 sm:p-4 md:p-6 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}
      onClick={onClick}
    >
      {/* Pinned Indicator */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
          <FaThumbtack className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        </div>
      )}
      
      {/* Title + Actions */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <h3 className={`font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 flex-1 mr-2 ${
          !note.title ? 'text-gray-500 italic' : ''
        }`}>
          {note.title || 'Untitled Note'}
        </h3>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Pin button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className={`p-1 sm:p-1.5 rounded-md transition-colors ${
              note.isPinned 
                ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200' 
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <FaThumbtack className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          
          {/* Delete button with confirmation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this note?")) {
                onDelete();
              }
            }}
            className="p-1 sm:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete note"
          >
            <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
        {preview || 'No content'}
      </p>

      {/* Date and Lock Status */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <FiCalendar className="w-3 h-3" />
          <span className="text-xs">{formatDate(note.updatedAt)}</span>
        </div>
        
        {note.isPasswordProtected && (
          <div className="flex items-center space-x-1 text-xs text-orange-600">
            <FiLock className="w-3 h-3" />
            <span className="text-xs">Protected</span>
          </div>
        )}
      </div>

      {/* AI Features Badges */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
        {/* Tags Badge */}
        {note.tags.length > 0 && (
          <div className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-600 text-xs rounded-md">
            <FiTag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-xs">{note.tags.length} tag{note.tags.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* AI Summary Badge */}
        {note.summary && (
          <div className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-50 text-green-600 text-xs rounded-md" title="AI Summary Available">
            <FiBookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-xs">Summary</span>
          </div>
        )}

        {/* Glossary Badge */}
        {note.glossary && note.glossary.length > 0 && (
          <div className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-50 text-purple-600 text-xs rounded-md" title="Glossary terms available">
            <FiFileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-xs">Glossary</span>
          </div>
        )}

        {/* Grammar Badge */}
        {note.grammarResults && (
          <div className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-50 text-emerald-600 text-xs rounded-md" title="Grammar check completed">
            <FiCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-xs">Grammar</span>
          </div>
        )}
      </div>

      {/* Tags list */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}