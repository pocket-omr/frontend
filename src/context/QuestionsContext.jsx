import React, { createContext, useContext, useState } from 'react';

const QuestionsContext = createContext(null);

const DEFAULT_QUESTIONS = [
  { id: 1, text: '', choices: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correct: null },
  { id: 2, text: '', choices: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correct: null },
];

let nextId = DEFAULT_QUESTIONS.length + 1;

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { id: nextId++, text: '', choices: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correct: null }
    ]);
  };

  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const changeQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const addChoice = (id) => {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, choices: [...q.choices, { text: '' }] } : q
    ));
  };

  const changeChoice = (id, ci, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      const choices = [...q.choices];
      choices[ci] = { text: value };
      return { ...q, choices };
    }));
  };

  const setCorrect = (id, ci) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, correct: ci } : q));
  };

  return (
    <QuestionsContext.Provider value={{ questions, addQuestion, deleteQuestion, changeQuestion, addChoice, changeChoice, setCorrect }}>
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  return useContext(QuestionsContext);
}
