import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { RestartIcon } from './icons/RestartIcon';
import { ExportIcon } from './icons/ExportIcon';

interface HeaderProps {
  onAddCourse: () => void;
  careerTitle: string;
  onTitleChange: (newTitle: string) => void;
  completedCredits: number;
  totalCredits: number;
  completedCourses: number;
  totalCourses: number;
  onReset: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddCourse, 
  careerTitle, 
  onTitleChange,
  completedCredits,
  totalCredits,
  completedCourses,
  totalCourses,
  onReset,
  onExport,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(careerTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (careerTitle !== currentTitle && !isEditingTitle) {
      setCurrentTitle(careerTitle);
    }
  }, [careerTitle, isEditingTitle, currentTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    const trimmedTitle = currentTitle.trim();
    if (trimmedTitle) {
      onTitleChange(trimmedTitle);
    } else {
      setCurrentTitle(careerTitle); // Revert if empty
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setCurrentTitle(careerTitle);
      setIsEditingTitle(false);
    }
  };

  const progressPercentage = totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0;

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
             <span className="hidden md:inline whitespace-nowrap">Malla -</span>
            {isEditingTitle ? (
              <input
                ref={inputRef}
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="font-bold bg-transparent border-b-2 border-indigo-500 outline-none p-0"
                style={{ width: `${Math.max(currentTitle.length, 5)}ch`}}
              />
            ) : (
              <div
                className="group flex items-center gap-2 cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                <span className="p-0 border-b-2 border-transparent group-hover:border-slate-300 transition-colors duration-200">{careerTitle}</span>
                <PencilIcon className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={onAddCourse}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Agregar Curso</span>
            </button>
            <button
              onClick={onExport}
              className="ml-2 sm:ml-4 p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              title="Exportar plan a archivo"
            >
              <ExportIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onReset}
              className="ml-2 p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              title="Reiniciar aplicación"
            >
              <RestartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-semibold text-slate-700">Progreso de Carrera</span>
            <span className="font-bold text-indigo-600">{completedCredits} / {totalCredits} Créditos</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}>
            </div>
          </div>
          <div className="text-right mt-1 text-xs text-slate-500">
            {completedCourses} de {totalCourses} cursos completados
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;