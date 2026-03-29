import React, { createContext, useContext, useState } from 'react';

const ExamListContext = createContext();

const STORAGE_KEY = 'examList';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(exams) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  } catch {
    console.error('Failed to save exams to localStorage');
  }
}

export function ExamListProvider({ children }) {
  const [exams, setExams] = useState(() => loadFromStorage()); // ← load on first render
  const [editingExamId, setEditingExamId] = useState(null);

  function updateExams(updater) {
    setExams(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(next); // ← save every time exams change
      return next;
    });
  }

  function saveExam(form, questions, checkboxType, gridLayout) {
    if (editingExamId !== null) {
      updateExams(prev =>
        prev.map(ex =>
          ex.id === editingExamId
            ? {
                ...ex,
                form: { ...form },
                questions: [...questions],
                checkboxType: checkboxType || ex.checkboxType,
                gridLayout: gridLayout || ex.gridLayout,
                updatedAt: new Date().toISOString(),
              }
            : ex
        )
      );
      setEditingExamId(null);
    } else {
      const newExam = {
        id: Date.now(),
        form: { ...form },
        questions: [...questions],
        checkboxType: checkboxType || 'Fill',
        gridLayout: gridLayout || 'Linear',
        createdAt: new Date().toISOString(),
      };
      updateExams(prev => [...prev, newExam]);
    }
  }

  function deleteExam(id) {
    updateExams(prev => prev.filter(ex => ex.id !== id));
  }

  function startEditExam(id) {
    setEditingExamId(id);
  }

  function cancelEdit() {
    setEditingExamId(null);
  }

  const editingExam = exams.find(ex => ex.id === editingExamId) || null;

  return (
    <ExamListContext.Provider value={{ exams, saveExam, deleteExam, startEditExam, cancelEdit, editingExam, editingExamId }}>
      {children}
    </ExamListContext.Provider>
  );
}

export function useExamList() {
  return useContext(ExamListContext);
}