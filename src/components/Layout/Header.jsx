import React from 'react';
import { FiSearch, FiPlus, FiZap } from 'react-icons/fi';
import { useNotes } from '../../contexts/NotesContext.jsx';

export default function Header({ onNewNote, onSearch, onHomeClick }) {
  const { state } = useNotes();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* ✅ Always keep things in a row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-14 md:h-16">
          
          {/* Logo + Title */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            onClick={onHomeClick}
            title="Go to Notes List"
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <FiZap className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                Shareable Notes
              </h1>
              <p className="text-xs text-gray-500 hidden xs:block">AI-Powered Note Taking</p>
            </div>
          </div>

          {/* Search + Button */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3 md:space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-shrink">
              <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={state.searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-24 xs:w-32 sm:w-48 md:w-56 lg:w-64 pl-7 sm:pl-10 pr-3 py-1.5 sm:py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Button */}
            <button
              onClick={onNewNote}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex-shrink-0"
            >
              <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">New Note</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
