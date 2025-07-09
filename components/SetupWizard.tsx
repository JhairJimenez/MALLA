import React, { useState, useRef } from 'react';
import { INITIAL_COURSES } from '../constants';
import type { Course } from '../types';
import { TemplateIcon } from './icons/TemplateIcon';
import { BlankIcon } from './icons/BlankIcon';
import { ImportIcon } from './icons/ImportIcon';

interface SetupWizardProps {
  onSetupComplete: (careerTitle: string, courses: Course[]) => void;
  onImport: (data: { careerTitle: string; courses: Course[] }) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onSetupComplete, onImport }) => {
  const [step, setStep] = useState(1);
  const [careerName, setCareerName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (careerName.trim()) {
      setStep(2);
    }
  };

  const handleSelectOption = (option: 'template' | 'blank') => {
    const finalCourses = option === 'template' ? INITIAL_COURSES : [];
    onSetupComplete(careerName.trim(), finalCourses);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('El contenido del archivo no es texto.');
        }
        const data = JSON.parse(text);

        if (data && typeof data.careerTitle === 'string' && Array.isArray(data.courses)) {
          onImport(data);
        } else {
          alert('Archivo de importación inválido. Asegúrate de que tenga el formato correcto.');
        }
      } catch (error) {
        console.error('Error al procesar el archivo de importación:', error);
        alert('Hubo un error al procesar el archivo. Por favor, verifica que sea un archivo JSON válido.');
      }
    };
    reader.onerror = () => {
      alert('Hubo un error al leer el archivo.');
    };
    reader.readAsText(file);

    // Reset input value to allow re-uploading the same file
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto text-center">
        {step === 1 && (
          <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">¡Bienvenido/a!</h1>
            <p className="text-slate-500 mb-6">Empecemos por darle un nombre a tu plan de estudios.</p>
            <form onSubmit={handleNextStep}>
              <label htmlFor="careerName" className="block text-left text-sm font-medium text-slate-600 mb-1">
                Nombre de tu Carrera
              </label>
              <input
                id="careerName"
                type="text"
                value={careerName}
                onChange={(e) => setCareerName(e.target.value)}
                placeholder="Ej: Ingeniería de Software"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 text-white font-semibold px-4 py-3 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={!careerName.trim()}
              >
                Continuar
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Configura tu plan</h2>
            <p className="text-slate-500 mb-8">Elige cómo poblar la malla para <span className="font-semibold text-indigo-600">{careerName.trim()}</span>.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => handleSelectOption('template')}
                className="p-6 border-2 border-slate-200 rounded-lg text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <TemplateIcon className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
                <h3 className="font-bold text-lg text-slate-800">Usar Plantilla</h3>
                <p className="text-sm text-slate-500 mt-1">Empieza con la malla de Ingeniería de Sistemas y edítala a tu gusto.</p>
              </div>

              <div
                onClick={() => handleSelectOption('blank')}
                className="p-6 border-2 border-slate-200 rounded-lg text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <BlankIcon className="w-12 h-12 mx-auto text-teal-500 mb-4" />
                <h3 className="font-bold text-lg text-slate-800">Empezar de Cero</h3>
                <p className="text-sm text-slate-500 mt-1">Crea tu malla curricular desde una hoja en blanco.</p>
              </div>

              <div
                onClick={handleImportClick}
                className="md:col-span-2 mt-4 p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <ImportIcon className="w-12 h-12 text-green-500 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-lg text-slate-800">Importar desde Archivo</h3>
                  <p className="text-sm text-slate-500 mt-1">Carga un plan que hayas exportado previamente (.json). El nombre de la carrera del archivo reemplazará al actual.</p>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".json,application/json"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;