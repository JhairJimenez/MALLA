import React, { useState, useEffect } from 'react';
import type { Course, Note } from '../types';
import { COLOR_PALETTE } from '../constants';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Omit<Course, 'completed' | 'notes'> & { notes?: Note[] }) => void;
  initialData: Course | null;
  courses: Course[];
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, initialData, courses }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(0);
  const [semester, setSemester] = useState(1);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [color, setColor] = useState('default');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCode(initialData.code);
      setCredits(initialData.credits);
      setSemester(initialData.semester);
      setPrerequisites(initialData.prerequisites || []);
      setColor(initialData.color || 'default');
      setIsEditing(true);
    } else {
      setName('');
      setCode('');
      setCredits(3);
      setSemester(1);
      setPrerequisites([]);
      setColor('default');
      setIsEditing(false);
    }
  }, [initialData]);

  const handlePrerequisitesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setPrerequisites(selectedOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || credits <= 0 || semester <= 0) {
        alert('Por favor complete todos los campos correctamente.');
        return;
    };
    
    // Prevent creating a new course with a code that already exists.
    if (!isEditing && courses.some(c => c.code === code)) {
        alert(`Ya existe un curso con el código "${code}". Por favor, elija un código único.`);
        return;
    }
    
    const finalColor = color === 'default' ? undefined : color;
    onSave({ id: initialData?.id || code, name, code, credits, semester, prerequisites, color: finalColor, notes: initialData?.notes });
  };

  if (!isOpen) return null;

  const availablePrerequisites = courses.filter(c => c.id !== (initialData?.id || code));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{isEditing ? 'Editar Curso' : 'Agregar Nuevo Curso'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600">Nombre del Curso</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-600">Código</label>
              <input type="text" id="code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} disabled={isEditing} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed" required />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="credits" className="block text-sm font-medium text-slate-600">Créditos</label>
                    <input type="number" id="credits" value={credits} onChange={e => setCredits(Number(e.target.value))} min="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900" required />
                </div>
                <div className="flex-1">
                    <label htmlFor="semester" className="block text-sm font-medium text-slate-600">Semestre</label>
                    <input type="number" id="semester" value={semester} onChange={e => setSemester(Number(e.target.value))} min="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900" required />
                </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-600">Etiqueta de Color</label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {Object.entries(COLOR_PALETTE).map(([key, palette]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setColor(key)}
                    className={`w-8 h-8 rounded-full transition-transform duration-150 ease-in-out ${palette.base} border-2 ${color === key ? `ring-2 ring-offset-2 ${palette.ring}` : 'border-transparent'}`}
                    aria-label={`Select color ${palette.name}`}
                    title={palette.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="prerequisites" className="block text-sm font-medium text-slate-600">Prerrequisitos</label>
              <select
                id="prerequisites"
                multiple
                value={prerequisites}
                onChange={handlePrerequisitesChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32 text-slate-900"
              >
                {availablePrerequisites.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
               <p className="mt-1 text-xs text-slate-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar varios.</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;