import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { buildExamPayload, createExam, deleteExamApi, listExams, updateExam } from '../api';

const ExamListContext = createContext();

export function ExamListProvider({ children }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingExamId, setEditingExamId] = useState(null);

  // Load exams from the backend (the single source of truth — nothing is kept
  // in localStorage). No-op when not logged in.
  const refresh = useCallback(async () => {
    if (!localStorage.getItem('access_token')) {
      setExams([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e);
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Create (or update, when editing) an exam on the backend, then refresh.
  // Returns the saved ExamOut. Throws on failure so callers can surface it.
  async function saveExam(form, questions, checkboxType, gridLayout, students) {
    const payload = buildExamPayload(form, questions, checkboxType, gridLayout, students);
    let saved;
    if (editingExamId != null) {
      saved = await updateExam(editingExamId, payload);
      setEditingExamId(null);
    } else {
      saved = await createExam(payload);
    }
    await refresh();
    return saved;
  }

  async function deleteExam(id) {
    await deleteExamApi(id);
    await refresh();
  }

  function startEditExam(id) {
    setEditingExamId(id);
  }

  function cancelEdit() {
    setEditingExamId(null);
  }

  const editingExam = exams.find(ex => ex.id === editingExamId) || null;

  return (
    <ExamListContext.Provider
      value={{
        exams,
        loading,
        error,
        refresh,
        saveExam,
        deleteExam,
        startEditExam,
        cancelEdit,
        editingExam,
        editingExamId,
      }}
    >
      {children}
    </ExamListContext.Provider>
  );
}

export function useExamList() {
  return useContext(ExamListContext);
}
