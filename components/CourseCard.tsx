import React, { useRef } from 'react';
import type { Course } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { LockIcon } from './icons/LockIcon';
import { NoteIcon } from './icons/NoteIcon';
import { COLOR_PALETTE } from '../constants';

interface CourseCardProps {
  course: Course;
  isLocked: boolean;
  onToggleComplete: (courseId: string) => void;
  onEdit: (course: Course) => void;
  onOpenNotes: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isLocked, onToggleComplete, onEdit, onOpenNotes }) => {
  const longPressTimer = useRef<number | undefined>(undefined);

  const handleMouseDown = () => {
    if (isLocked) return;
    longPressTimer.current = window.setTimeout(() => {
      onOpenNotes(course);
    }, 700); // 700ms for long press
  };

  const handleMouseUp = () => {
    window.clearTimeout(longPressTimer.current);
  };
  
  const handleMouseLeave = () => {
    window.clearTimeout(longPressTimer.current);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLocked) return;
    // Prevents click from firing if the target was the edit button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onToggleComplete(course.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing
    onEdit(course);
  };

  const theme = (course.color && COLOR_PALETTE[course.color]) || COLOR_PALETTE.default;

  const cardBaseStyle = isLocked
    ? 'bg-slate-200 text-slate-400 cursor-not-allowed filter grayscale-[50%]'
    : course.completed
      ? 'bg-green-200 text-green-800 opacity-95 hover:bg-green-300 cursor-pointer'
      : `${theme.base} ${theme.hover} hover:scale-105 cursor-pointer`;

  const cardClasses = `
    relative p-4 rounded-lg shadow-md select-none transition-all duration-300 ease-in-out
    ${cardBaseStyle}
  `;

  const codeColor = isLocked
    ? 'text-slate-500'
    : course.completed
    ? 'text-green-700'
    : theme.text;
    
  const creditColor = isLocked
    ? 'text-slate-500'
    : course.completed
    ? 'text-green-700'
    : theme.creditText;

  const titleColor = isLocked
    ? 'text-slate-600'
    : course.completed
    ? 'text-green-900'
    : 'text-slate-900';


  return (
    <div 
      className={cardClasses} 
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown} // Basic mobile support
      onTouchEnd={handleMouseUp}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
            <h3 className={`font-bold text-md leading-tight ${titleColor}`}>{course.name}</h3>
            <p className={`text-sm ${codeColor}`}>{course.code}</p>
        </div>
        <div className={`font-black text-lg ${creditColor}`}>
          {course.credits}
        </div>
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 opacity-60" title="Bloqueado: Requiere cursos previos">
          <LockIcon className="w-10 h-10" />
        </div>
      )}
      
      {course.completed && !isLocked && (
        <div className="absolute top-2 right-2 text-green-600 font-bold text-xs">
          APROBADO
        </div>
      )}
      
      <button 
        onClick={handleEditClick}
        className={`absolute bottom-2 right-2 p-1 rounded-full transition-all duration-200 ${
          isLocked 
            ? 'text-slate-500 hover:bg-slate-300'
            : course.completed 
              ? 'text-green-800 hover:bg-green-400/50' 
              : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
        }`}
        aria-label="Editar curso"
      >
        <PencilIcon className="w-4 h-4" />
      </button>

      {course.notes && course.notes.length > 0 && !isLocked && (
         <div className="absolute bottom-2 left-2 text-slate-400" title="Este curso tiene notas">
           <NoteIcon className="w-4 h-4" />
         </div>
      )}
    </div>
  );
};

export default CourseCard;