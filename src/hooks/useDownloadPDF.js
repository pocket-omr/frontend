import { useState, useCallback } from 'react';

// 🔧 Change this to your FastAPI base URL when backend is ready
const API_BASE_URL = 'http://localhost:8000';

/**
 * POST /generate-pdf  →  raw PDF binary (application/pdf)
 *
 * Request body:
 * {
 *   type: 'question_sheet' | 'grid_sheet' | 'correction_sheet',
 *   form, questions, checkboxType, gridLayout
 * }
 */
export function useDownloadPDF({ form, questions, checkboxType, gridLayout }) {
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [completedSteps, setCompleted]  = useState([]);   // tracks which sheets downloaded OK
  const [allDone, setAllDone]           = useState(false);

  const SHEET_STEPS = [
    { key: 'question_sheet',   label: 'Question Sheet' },
    { key: 'grid_sheet',       label: 'Grid Sheet'     },
    { key: 'correction_sheet', label: 'Correction Sheet' },
  ];

  const downloadSingle = useCallback(async (type) => {
    const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ type, form, questions, checkboxType, gridLayout }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Server error ${response.status}`);
    }
    const blob     = await response.blob();
    const url      = URL.createObjectURL(blob);
    const a        = document.createElement('a');
    a.href         = url;
    const safeName = (form.title || 'exam').trim().replace(/\s+/g, '_');
    a.download     = `${safeName}_${type}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [form, questions, checkboxType, gridLayout]);

  /** Downloads all 3 sheets sequentially, tracking progress per step */
  const downloadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCompleted([]);
    setAllDone(false);
    try {
      for (const step of SHEET_STEPS) {
        await downloadSingle(step.key);
        setCompleted(prev => [...prev, step.key]);
      }
      setAllDone(true);
    } catch (err) {
      console.error('[useDownloadPDF]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [downloadSingle]);

  const reset = useCallback(() => {
    setCompleted([]);
    setAllDone(false);
    setError(null);
  }, []);

  return {
    downloadAll,
    downloadSingle,
    loading,
    error,
    completedSteps,
    allDone,
    reset,
    SHEET_STEPS,
  };
}