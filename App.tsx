import React, { useState, useCallback, useMemo } from 'react';
import type { Course, Note } from './types';
import Header from './components/Header';
import CurriculumGrid from './components/CurriculumGrid';
import CourseModal from './components/CourseModal';
import NotesModal from './components/NotesModal';
import SetupWizard from './components/SetupWizard';

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [careerTitle, setCareerTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [notesModalState, setNotesModalState] = useState<{isOpen: boolean; course: Course | null}>({ isOpen: false, course: null });

  const progress = useMemo(() => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(c => c.completed).length;
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const completedCredits = courses
      .filter(c => c.completed)
      .reduce((sum, course) => sum + course.credits, 0);
    return { totalCourses, completedCourses, totalCredits, completedCredits };
  }, [courses]);

  const handleToggleComplete = useCallback((courseId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId ? { ...course, completed: !course.completed } : course
      )
    );
  }, []);

  const handleOpenEditModal = useCallback((course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingCourse(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCourse(null);
  }, []);

  const handleSaveCourse = useCallback((courseData: Omit<Course, 'completed' | 'notes'> & { notes?: Note[] }) => {
    setCourses(prevCourses => {
      const existingCourse = prevCourses.find(c => c.id === courseData.id);
      if (existingCourse) {
        return prevCourses.map(c =>
          c.id === courseData.id ? { ...existingCourse, ...courseData } : c
        );
      } else {
        const newCourse: Course = { ...courseData, completed: false };
        return [...prevCourses, newCourse];
      }
    });
    handleCloseModal();
  }, [handleCloseModal]);

  const handleOpenNotesModal = useCallback((course: Course) => {
    setNotesModalState({ isOpen: true, course });
  }, []);

  const handleCloseNotesModal = useCallback(() => {
    setNotesModalState({ isOpen: false, course: null });
  }, []);

  const handleSaveNotes = useCallback((courseId: string, notes: Note[]) => {
    setCourses(prevCourses =>
        prevCourses.map(c =>
            c.id === courseId ? { ...c, notes: notes.length > 0 ? notes : undefined } : c
        )
    );
    handleCloseNotesModal();
  }, [handleCloseNotesModal]);

  const handleSetupComplete = useCallback((newCareerTitle: string, initialCourses: Course[]) => {
    setCareerTitle(newCareerTitle);
    setCourses(initialCourses);
    setIsSetupComplete(true);
  }, []);
  
  const handleResetApp = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar? Perderás todo tu progreso actual.')) {
        setIsSetupComplete(false);
        setCourses([]);
        setCareerTitle('');
    }
  }, []);

  const handleExport = useCallback(() => {
    if (!careerTitle && courses.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const dataToExport = {
      careerTitle,
      courses,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedTitle = careerTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    link.download = `malla-curricular-${sanitizedTitle || 'export'}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [careerTitle, courses]);

  const handleImport = useCallback((importedData: { careerTitle: string; courses: Course[] }) => {
    setCareerTitle(importedData.careerTitle);
    setCourses(importedData.courses);
    setIsSetupComplete(true);
  }, []);

  if (!isSetupComplete) {
    return <SetupWizard onSetupComplete={handleSetupComplete} onImport={handleImport} />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50 transition-colors duration-300">
      <Header 
        onAddCourse={handleOpenAddModal} 
        careerTitle={careerTitle}
        onTitleChange={setCareerTitle}
        completedCredits={progress.completedCredits}
        totalCredits={progress.totalCredits}
        completedCourses={progress.completedCourses}
        totalCourses={progress.totalCourses}
        onReset={handleResetApp}
        onExport={handleExport}
      />
      <main className="p-4 md:p-8">
        <CurriculumGrid
          courses={courses}
          onToggleComplete={handleToggleComplete}
          onEditCourse={handleOpenEditModal}
          onOpenNotes={handleOpenNotesModal}
        />
      </main>
      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        initialData={editingCourse}
        courses={courses}
      />
       <NotesModal
        isOpen={notesModalState.isOpen}
        course={notesModalState.course}
        onClose={handleCloseNotesModal}
        onSave={handleSaveNotes}
      />
    </div>
  );
}

export default App;