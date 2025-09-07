import React from "react";
import NoteCard from "./NoteCard.jsx";
import { FiSearch } from "react-icons/fi";
import { FaThumbtack, FaFile } from "react-icons/fa";

export default function NotesList({
  notes,
  searchTerm,
  onNoteClick,
  onPinNote,
  onDeleteNote,
  isLoading,
}) {
  const filteredNotes = notes.filter((note) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-10 text-gray-500">
        <FiSearch className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> 
        <span className="text-sm sm:text-base">Loading notes...</span>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 sm:py-10 px-4 text-gray-600">
        <FaFile className="mx-auto mb-3 sm:mb-2 text-2xl sm:text-3xl text-gray-400" />
        <p className="font-semibold text-base sm:text-lg mb-2">No notes yet</p>
        <p className="text-sm sm:text-base max-w-md mx-auto">
          Create your first note to get started with AI-powered note taking
        </p>
      </div>
    );
  }

  if (filteredNotes.length === 0 && searchTerm) {
    return (
      <div className="text-center py-8 sm:py-10 px-4 text-gray-600">
        <FiSearch className="mx-auto mb-3 sm:mb-2 text-2xl sm:text-3xl text-gray-400" />
        <p className="font-semibold text-base sm:text-lg mb-2">No results found</p>
        <p className="text-sm sm:text-base max-w-md mx-auto">
          No notes match your search for "{searchTerm}". Try different keywords.
        </p>
      </div>
    );
  }

  const pinnedNotes = sortedNotes.filter((note) => note.isPinned);
  const regularNotes = sortedNotes.filter((note) => !note.isPinned);

  return (
    <div className="space-y-4 sm:space-y-6">
      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center px-1">
            <FaThumbtack className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-orange-500" /> 
            <span>Pinned Notes</span>
          </h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => onNoteClick(note)}
                onPin={() => onPinNote(note.id)}
                onDelete={() => onDeleteNote(note.id)}
                showActions
              />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 px-1">All Notes</h2>
          )}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regularNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => onNoteClick(note)}
                onPin={() => onPinNote(note.id)}
                onDelete={() => onDeleteNote(note.id)}
                showActions
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}