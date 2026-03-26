import React, { createContext, useContext, useState } from 'react';
import { useExamConfig } from './Examconfigcontext';

const QuestionsContext = createContext(null);

let nextId = 1;

export function QuestionsProvider({ children }) {
  const { form, setForm } = useExamConfig();
  const [questions, setQuestions] = useState([]);

  const makeQuestion = () => ({
    id:      nextId++,
    text:    '',
    choices: Array.from({ length: Math.max(1, parseInt(form.choices) || 4) }, () => ({ text: '' })),
    correct: null,
  });

  const syncChoicesCount = (updatedQuestions) => {
    if (updatedQuestions.length === 0) return;
    const maxChoices = Math.max(...updatedQuestions.map(q => q.choices.length));
    setForm(f => ({ ...f, choices: String(maxChoices) }));
  };

  const addQuestion = () =>
    setQuestions(qs => [...qs, makeQuestion()]);

  const deleteQuestion = (id) =>
    setQuestions(qs => qs.filter(q => q.id !== id));

  const changeQuestion = (id, field, value) =>
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, [field]: value } : q));

  const addChoice = (id) =>
    setQuestions(qs => {
      const updated = qs.map(q =>
        q.id === id ? { ...q, choices: [...q.choices, { text: '' }] } : q
      );
      syncChoicesCount(updated);
      return updated;
    });

  const deleteChoice = (id, choiceIndex) =>
    setQuestions(qs => {
      const updated = qs.map(q => {
        if (q.id !== id) return q;
        if (q.choices.length <= 2) return q;
        const newChoices = q.choices.filter((_, i) => i !== choiceIndex);
        let newCorrect = q.correct;
        if (q.correct === choiceIndex)    newCorrect = null;
        else if (q.correct > choiceIndex) newCorrect = q.correct - 1;
        return { ...q, choices: newChoices, correct: newCorrect };
      });
      syncChoicesCount(updated);
      return updated;
    });

  const changeChoice = (id, choiceIndex, value) =>
    setQuestions(qs =>
      qs.map(q =>
        q.id === id
          ? { ...q, choices: q.choices.map((c, i) => i === choiceIndex ? { ...c, text: value } : c) }
          : q
      )
    );

  const setCorrect = (id, choiceIndex) =>
    setQuestions(qs =>
      qs.map(q => q.id === id ? { ...q, correct: choiceIndex } : q)
    );

  return (
    <QuestionsContext.Provider value={{
      questions,
      addQuestion,
      deleteQuestion,
      changeQuestion,
      addChoice,
      deleteChoice,
      changeChoice,
      setCorrect,
    }}>
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions() {
  return useContext(QuestionsContext);
}