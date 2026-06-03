import React, { createContext, useContext, useState } from 'react';

const ExamConfigContext = createContext();

const defaultForm = {
  title: '',
  module: '',
  university: '',
  department: '',
  date: '',
  duration: '',
  numQuestions: '',
  choices: '4',
  questionsPerPage: '20',
  instructions: '',
};

export function ExamConfigProvider({ children }) {
  const [form, setForm] = useState({ ...defaultForm });
  const [checkboxType, setCheckboxType] = useState('Fill');
  const [gridLayout, setGridLayout] = useState('Linear');
  const [students, setStudents] = useState([]);

  function handleCheckboxType(type) {
    setCheckboxType(type);
  }

  // Load exam data for editing
  function loadExamConfig(examForm, examCheckboxType, examGridLayout, examStudents) {
    setForm({ ...defaultForm, ...examForm });
    setCheckboxType(examCheckboxType || 'Fill');
    setGridLayout(examGridLayout || 'Linear');
    setStudents(examStudents || []);
  }

  // Reset to blank
  function resetForm() {
    setForm({ ...defaultForm });
    setCheckboxType('Fill');
    setGridLayout('Linear');
    setStudents([]);
  }

  return (
    <ExamConfigContext.Provider value={{
      form, setForm,
      checkboxType, handleCheckboxType,
      gridLayout, setGridLayout,
      students, setStudents,
      loadExamConfig, resetForm,
    }}>
      {children}
    </ExamConfigContext.Provider>
  );
}

export function useExamConfig() {
  return useContext(ExamConfigContext);
}