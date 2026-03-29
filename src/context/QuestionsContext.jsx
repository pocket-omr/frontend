import React, { createContext, useContext, useState } from 'react';

const QuestionsContext = createContext();

function makeQuestion(overrides = {}) {
  return {
    id: Date.now() + Math.random(),
    text: '',
    choices: [
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ],
    correct: null,
    ...overrides,
  };
}

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState([]);

  function addQuestion() {
    setQuestions(prev => [...prev, makeQuestion()]);
  }

  function deleteQuestion(id) {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }

  function changeQuestion(id, field, value) {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, [field]: value } : q)
    );
  }

  function addChoice(id) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, choices: [...q.choices, { text: '' }] } : q
      )
    );
  }

  function changeChoice(id, index, value) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id
          ? { ...q, choices: q.choices.map((c, i) => i === index ? { ...c, text: value } : c) }
          : q
      )
    );
  }

  function setCorrect(id, index) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, correct: q.correct === index ? null : index } : q
      )
    );
  }

  function deleteChoice(id, index) {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        const newChoices = q.choices.filter((_, i) => i !== index);
        return {
          ...q,
          choices: newChoices,
          correct: q.correct === index ? null : q.correct > index ? q.correct - 1 : q.correct,
        };
      })
    );
  }

  // Load questions for editing
  function loadQuestions(qs) {
    setQuestions(qs.map(q => ({ ...q, id: q.id ?? Date.now() + Math.random() })));
  }

  // Reset to empty
  function resetQuestions() {
    setQuestions([]);
  }

  return (
    <QuestionsContext.Provider value={{
      questions, addQuestion, deleteQuestion, changeQuestion,
      addChoice, changeChoice, setCorrect, deleteChoice,
      loadQuestions, resetQuestions,
    }}>
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  return useContext(QuestionsContext);
}