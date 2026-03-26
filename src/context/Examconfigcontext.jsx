import React, { createContext, useContext, useState } from 'react';

const ExamConfigContext = createContext(null);

export function ExamConfigProvider({ children }) {
  const [checkboxType, setCheckboxType] = useState('Fill');
  const [gridLayout, setGridLayout]     = useState('Linear');
  const [form, setForm] = useState({
    title:            'Second exam of POO',
    module:           'POO',
    university:       'ESI',
    department:       '2CP',
    date:             '2025-05-25',
    duration:         '2h:30min',
    numQuestions:     '20',
    choices:          '4',
    questionsPerPage: '20',
    instructions:     '"Fill the corresponding box completely for your answer."',
  });

  const instructionDefaults = {
    Fill:   '"Fill the corresponding box completely for your answer."',
    Bubbel: '"Make bubble in the corresponding box for your answer."',
    Cross:  '"Draw a cross (✗) in the corresponding box for your answer."',
    Tick:   '"Draw a tick (✓) in the corresponding box for your answer."',
  };

  const handleCheckboxType = (type) => {
    setCheckboxType(type);
    setForm(f => ({ ...f, instructions: instructionDefaults[type] }));
  };
  
  return (
    <ExamConfigContext.Provider value={{
      form, setForm,
      checkboxType, handleCheckboxType,
      gridLayout, setGridLayout,
    }}>
      {children}
    </ExamConfigContext.Provider>
  );
}

export function useExamConfig() {
  return useContext(ExamConfigContext);
}