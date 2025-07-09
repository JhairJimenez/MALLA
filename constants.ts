import type { Course } from './types';

export const COLOR_PALETTE: { [key: string]: { base: string; hover: string; text: string; creditText: string; ring: string; name: string } } = {
  default:   { name: 'Default', base: 'bg-white',         hover: 'hover:shadow-lg', text: 'text-slate-400',  creditText: 'text-indigo-600', ring: 'ring-slate-400' },
  sky:       { name: 'Sky',     base: 'bg-sky-100',       hover: 'hover:bg-sky-200',       text: 'text-sky-500',    creditText: 'text-sky-700',    ring: 'ring-sky-500'      },
  rose:      { name: 'Rose',    base: 'bg-rose-100',      hover: 'hover:bg-rose-200',      text: 'text-rose-500',   creditText: 'text-rose-700',   ring: 'ring-rose-500'     },
  emerald:   { name: 'Emerald', base: 'bg-emerald-100',   hover: 'hover:bg-emerald-200',   text: 'text-emerald-500',creditText: 'text-emerald-700',ring: 'ring-emerald-500'  },
  amber:     { name: 'Amber',   base: 'bg-amber-100',     hover: 'hover:bg-amber-200',     text: 'text-amber-500',  creditText: 'text-amber-700',  ring: 'ring-amber-500'    },
  violet:    { name: 'Violet',  base: 'bg-violet-100',    hover: 'hover:bg-violet-200',    text: 'text-violet-500', creditText: 'text-violet-700', ring: 'ring-violet-500'   },
};

export const INITIAL_COURSES: Course[] = [
  // Semestre 1
  { id: 'CI-101', name: 'Cálculo I', code: 'CI-101', credits: 4, semester: 1, completed: false },
  { id: 'CI-102', name: 'Álgebra Lineal', code: 'CI-102', credits: 4, semester: 1, completed: false },
  { id: 'CI-103', name: 'Introducción a la Programación', code: 'CI-103', credits: 5, semester: 1, completed: false },
  { id: 'FG-101', name: 'Comunicación y Lenguaje', code: 'FG-101', credits: 3, semester: 1, completed: false },
  { id: 'FG-102', name: 'Metodología de Estudio', code: 'FG-102', credits: 2, semester: 1, completed: false },

  // Semestre 2
  { id: 'CI-201', name: 'Cálculo II', code: 'CI-201', credits: 4, semester: 2, completed: false, prerequisites: ['CI-101'] },
  { id: 'CI-202', name: 'Física I', code: 'CI-202', credits: 4, semester: 2, completed: false, prerequisites: ['CI-101'] },
  { id: 'CI-203', name: 'Estructuras de Datos', code: 'CI-203', credits: 5, semester: 2, completed: false, prerequisites: ['CI-103'] },
  { id: 'CI-204', name: 'Química General', code: 'CI-204', credits: 3, semester: 2, completed: false },
  { id: 'FG-201', name: 'Realidad Nacional', code: 'FG-201', credits: 3, semester: 2, completed: false },

  // Semestre 3
  { id: 'CI-301', name: 'Cálculo III', code: 'CI-301', credits: 4, semester: 3, completed: false, prerequisites: ['CI-201'] },
  { id: 'CI-302', name: 'Física II', code: 'CI-302', credits: 4, semester: 3, completed: false, prerequisites: ['CI-202'] },
  { id: 'CI-303', name: 'Algoritmos y Complejidad', code: 'CI-303', credits: 5, semester: 3, completed: false, prerequisites: ['CI-203'] },
  { id: 'CI-304', name: 'Circuitos Eléctricos', code: 'CI-304', credits: 4, semester: 3, completed: false, prerequisites: ['CI-202'] },
  { id: 'FG-301', name: 'Ética Profesional', code: 'FG-301', credits: 3, semester: 3, completed: false },

  // Semestre 4
  { id: 'CI-401', name: 'Ecuaciones Diferenciales', code: 'CI-401', credits: 4, semester: 4, completed: false, prerequisites: ['CI-301'] },
  { id: 'CI-402', name: 'Programación Orientada a Objetos', code: 'CI-402', credits: 5, semester: 4, completed: false, prerequisites: ['CI-203'] },
  { id: 'CI-403', name: 'Sistemas Digitales', code: 'CI-403', credits: 4, semester: 4, completed: false, prerequisites: ['CI-304'] },
  { id: 'CI-404', name: 'Probabilidad y Estadística', code: 'CI-404', credits: 4, semester: 4, completed: false, prerequisites: ['CI-201'] },
  { id: 'FG-401', name: 'Emprendimiento', code: 'FG-401', credits: 3, semester: 4, completed: false },

  // Semestre 5
  { id: 'CI-501', name: 'Bases de Datos', code: 'CI-501', credits: 5, semester: 5, completed: false, prerequisites: ['CI-402'] },
  { id: 'CI-502', name: 'Redes de Computadoras', code: 'CI-502', credits: 4, semester: 5, completed: false, prerequisites: ['CI-402'] },
  { id: 'CI-503', name: 'Análisis Numérico', code: 'CI-503', credits: 4, semester: 5, completed: false, prerequisites: ['CI-401'] },
  { id: 'CI-504', name: 'Arquitectura de Computadores', code: 'CI-504', credits: 4, semester: 5, completed: false, prerequisites: ['CI-403'] },
  { id: 'FG-501', name: 'Economía para Ingenieros', code: 'FG-501', credits: 3, semester: 5, completed: false },

  // Semestre 6
  { id: 'CI-601', name: 'Sistemas Operativos', code: 'CI-601', credits: 5, semester: 6, completed: false, prerequisites: ['CI-504'] },
  { id: 'CI-602', name: 'Ingeniería de Software I', code: 'CI-602', credits: 4, semester: 6, completed: false, prerequisites: ['CI-501'] },
  { id: 'CI-603', name: 'Electrónica Analógica y Digital', code: 'CI-603', credits: 4, semester: 6, completed: false, prerequisites: ['CI-403'] },
  { id: 'CI-604', name: 'Investigación de Operaciones', code: 'CI-604', credits: 3, semester: 6, completed: false, prerequisites: ['CI-404'] },
  
  // Semestre 7
  { id: 'CI-701', name: 'Ingeniería de Software II', code: 'CI-701', credits: 4, semester: 7, completed: false, prerequisites: ['CI-602'] },
  { id: 'CI-702', name: 'Inteligencia Artificial', code: 'CI-702', credits: 4, semester: 7, completed: false, prerequisites: ['CI-303', 'CI-404'] },
  { id: 'CI-703', name: 'Compiladores', code: 'CI-703', credits: 4, semester: 7, completed: false, prerequisites: ['CI-601'] },
  { id: 'CI-704', name: 'Sistemas de Control', code: 'CI-704', credits: 4, semester: 7, completed: false, prerequisites: ['CI-603'] },
  
  // Semestre 8
  { id: 'CI-801', name: 'Seguridad Informática', code: 'CI-801', credits: 4, semester: 8, completed: false, prerequisites: ['CI-502'] },
  { id: 'CI-802', name: 'Sistemas Distribuidos', code: 'CI-802', credits: 4, semester: 8, completed: false, prerequisites: ['CI-601'] },
  { id: 'CI-803', name: 'Formulación y Evaluación de Proyectos', code: 'CI-803', credits: 3, semester: 8, completed: false, prerequisites: ['FG-501'] },
  { id: 'CI-804', name: 'Electiva Profesional I', code: 'CI-804', credits: 3, semester: 8, completed: false },
  
  // Semestre 9
  { id: 'CI-901', name: 'Proyecto de Grado I', code: 'CI-901', credits: 6, semester: 9, completed: false, prerequisites: ['CI-701', 'CI-803'] },
  { id: 'CI-902', name: 'Gestión de Proyectos de Software', code: 'CI-902', credits: 3, semester: 9, completed: false, prerequisites: ['CI-701'] },
  { id: 'CI-903', name: 'Electiva Profesional II', code: 'CI-903', credits: 3, semester: 9, completed: false },
  { id: 'FG-901', name: 'Legislación Informática', code: 'FG-901', credits: 2, semester: 9, completed: false, prerequisites: ['FG-301'] },
  
  // Semestre 10
  { id: 'CI-1001', name: 'Proyecto de Grado II', code: 'CI-1001', credits: 8, semester: 10, completed: false, prerequisites: ['CI-901'] },
  { id: 'CI-1002', name: 'Prácticas Profesionales', code: 'CI-1002', credits: 8, semester: 10, completed: false, prerequisites: ['CI-901'] },
];