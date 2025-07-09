import React, { useMemo, useCallback } from 'react';
import type { Course } from '../types';
import CourseCard from './CourseCard';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface CurriculumGridProps {
  courses: Course[];
  onToggleComplete: (courseId: string) => void;
  onEditCourse: (course: Course) => void;
  onOpenNotes: (course: Course) => void;
}

const MOTIVATIONAL_MESSAGES: { [key: number]: string } = {
  1: "¡Excelente comienzo! Has superado el primer desafío.",
  2: "¡Vas con todo! La base es sólida, ¡sigue así!",
  3: "¡Imparable! Estás cada vez más cerca de la meta.",
  4: "¡Recta final! Has demostrado tu valía, ¡no te detengas ahora!",
  5: "¡Lo lograste! El conocimiento es tuyo. ¡Felicitaciones!",
  6: "¡Un experto en formación! Cada paso te hace más fuerte.",
  7: "¡Casi un ingeniero! El mundo espera tu talento.",
  8: "¡La cumbre está a la vista! ¡Qué gran recorrido!",
  9: "¡Maestría en progreso! Tu dedicación es inspiradora.",
  10: "¡LEYENDA! Has completado el viaje. ¡Felicidades, Ingeniero/a!"
};


const CurriculumGrid: React.FC<CurriculumGridProps> = ({ courses, onToggleComplete, onEditCourse, onOpenNotes }) => {
  const completedCourseIds = useMemo(() => 
    new Set(courses.filter(c => c.completed).map(c => c.id)),
  [courses]);

  const arePrerequisitesMet = useCallback((course: Course): boolean => {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return true;
    }
    return course.prerequisites.every(prereqId => completedCourseIds.has(prereqId));
  }, [completedCourseIds]);
  
  const semesters = useMemo(() => {
    const groupedBySemester = courses.reduce((acc, course) => {
      (acc[course.semester] = acc[course.semester] || []).push(course);
      return acc;
    }, {} as Record<number, Course[]>);

    Object.values(groupedBySemester).forEach(semesterCourses => {
        semesterCourses.sort((a, b) => a.code.localeCompare(b.code));
    });

    return Object.entries(groupedBySemester).sort(([a], [b]) => Number(a) - Number(b));
  }, [courses]);

  const years = useMemo(() => {
    const yearChunks = [];
    for (let i = 0; i < semesters.length; i += 2) {
      yearChunks.push({
        year: Math.floor(i / 2) + 1,
        semesters: semesters.slice(i, i + 2),
      });
    }
    return yearChunks;
  }, [semesters]);
  
  const getCreditBadgeClass = (credits: number) => {
    if (credits >= 21) return 'bg-red-200 text-red-800';
    if (credits >= 17) return 'bg-amber-200 text-amber-800';
    return 'bg-green-200 text-green-800';
  };

  if (semesters.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-slate-500">No hay cursos en la malla.</h2>
        <p className="text-slate-400 mt-2">¡Comienza agregando uno!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
        <div className="flex space-x-8 min-w-max">
          {years.map(({ year, semesters: yearSemesters }) => (
            <div key={`year-${year}`} className="bg-white rounded-xl shadow-lg p-4 flex flex-col transition-colors duration-300">
              <h1 className="text-2xl font-bold text-center text-indigo-700 mb-4 pb-2 border-b-2 border-indigo-200">
                Año {year}
              </h1>
              <div className="flex space-x-6">
                {yearSemesters.map(([semester, semesterCourses]) => {
                  const isSemesterComplete = semesterCourses.length > 0 && semesterCourses.every(c => c.completed);
                  const semesterNumber = Number(semester);
                  const totalSemesterCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
                  
                  return (
                    <div key={semester} className="flex-shrink-0 w-72 bg-slate-100 rounded-xl p-4 flex flex-col transition-colors duration-300">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-slate-300">
                        <h2 className="text-xl font-bold text-slate-700">
                          Semestre {semester}
                        </h2>
                        {totalSemesterCredits > 0 && (
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getCreditBadgeClass(totalSemesterCredits)}`}>
                                {totalSemesterCredits} CR
                            </span>
                        )}
                      </div>
                      
                      {isSemesterComplete && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-3 rounded-md mb-4 shadow animate-fade-in">
                          <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-6 h-6 flex-shrink-0 text-green-500" />
                            <p className="text-sm font-semibold">
                              {MOTIVATIONAL_MESSAGES[semesterNumber] || "¡Felicidades por completar el semestre!"}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {semesterCourses.map(course => {
                          const isLocked = !arePrerequisitesMet(course);
                          return (
                            <CourseCard
                              key={course.id}
                              course={course}
                              isLocked={isLocked}
                              onToggleComplete={onToggleComplete}
                              onEdit={onEditCourse}
                              onOpenNotes={onOpenNotes}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default CurriculumGrid;