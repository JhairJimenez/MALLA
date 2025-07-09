import React, { useState, useEffect, useRef } from 'react';
import type { Course, Note } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface NotesModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
  onSave: (courseId: string, notes: Note[]) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, course, onClose, onSave }) => {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (course) {
      setLocalNotes(course.notes || []);
    }
    if (isOpen) {
      setNewNoteContent('');
      // Focus the input when the modal opens and there's a course
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [course, isOpen]);

  const handleAddNote = () => {
    const content = newNoteContent.trim();
    if (content && course) {
      const newNote: Note = {
        id: Date.now().toString(),
        content,
      };
      setLocalNotes([...localNotes, newNote]);
      setNewNoteContent('');
      inputRef.current?.focus();
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setLocalNotes(localNotes.filter(note => note.id !== noteId));
  };

  const handleSave = () => {
    if (course) {
      onSave(course.id, localNotes);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddNote();
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl transform transition-all animate-fade-in flex flex-col" style={{maxHeight: '90vh'}} onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">Notas del Curso</h2>
          <p className="text-md text-indigo-600 font-semibold">{course.name} <span className="text-slate-500 font-normal">({course.code})</span></p>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3 mb-4">
            {localNotes.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                    <p>No hay notas todavía.</p>
                    <p className="text-sm">Usa el campo de abajo para agregar tu primera nota.</p>
                </div>
            ) : (
                localNotes.map(note => (
                    <div key={note.id} className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded-lg flex items-start justify-between gap-2 shadow-sm animate-fade-in">
                        <p className="text-yellow-900 break-words whitespace-pre-wrap flex-1">{note.content}</p>
                        <button onClick={() => handleDeleteNote(note.id)} className="text-yellow-600 hover:text-red-500 p-1 rounded-full transition-colors flex-shrink-0">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))
            )}
        </div>

        <div className="mt-auto flex-shrink-0">
            <div className="flex gap-2">
                <textarea
                    ref={inputRef}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe una nota y presiona Enter..."
                    className="flex-grow block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows={2}
                />
                <button onClick={handleAddNote} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors self-start">
                    Agregar
                </button>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">
                    Cancelar
                </button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                    Guardar Cambios
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;