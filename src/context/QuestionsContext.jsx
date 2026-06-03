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
    correct: [],
    points: 1,
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

  // Toggle a choice as correct. Supports multiple correct answers per question.
  function setCorrect(id, index) {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        const current = Array.isArray(q.correct) ? q.correct : [];
        const correct = current.includes(index)
          ? current.filter(i => i !== index)
          : [...current, index].sort((a, b) => a - b);
        return { ...q, correct };
      })
    );
  }

  function deleteChoice(id, index) {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        const newChoices = q.choices.filter((_, i) => i !== index);
        // Drop the removed choice from the correct set and shift higher indices down.
        const current = Array.isArray(q.correct) ? q.correct : [];
        const correct = current
          .filter(i => i !== index)
          .map(i => (i > index ? i - 1 : i));
        return { ...q, choices: newChoices, correct };
      })
    );
  }

  // Load questions for editing
  function loadQuestions(qs) {
    setQuestions(qs.map(q => ({
      ...q,
      id: q.id ?? Date.now() + Math.random(),
      points: q.points ?? 1,
      // Normalize `correct` to an array: legacy exams stored a single index or null.
      correct: Array.isArray(q.correct)
        ? q.correct
        : q.correct == null
          ? []
          : [q.correct],
    })));
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