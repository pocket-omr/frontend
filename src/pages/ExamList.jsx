import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamList } from '../context/ExamListContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useQuestions } from '../context/QuestionsContext';
import {
  ClipboardList, Trash2, Pencil, BookOpen, Calendar, Hash, Clock, Download, CheckCircle2, XCircle
} from 'lucide-react';
import { useDownloadPDF } from '../hooks/useDownloadPDF';

const styles = `
  .el-title { font-size: 1.8rem; }

  .el-card { background: #fff; border-radius: 20px; border: 2px solid #ceedf8; padding: 20px 24px; box-shadow: 0 2px 8px rgba(5,59,118,0.06); display: flex; align-items: center; gap: 20px; transition: box-shadow 0.2s, border-color 0.2s; }
  .el-card:hover { box-shadow: 0 6px 20px rgba(11,150,217,0.13); border-color: #0B96D9; }
  .el-icon-box { width: 52px; height: 52px; border-radius: 14px; background: #e8f6ff; color: #0B96D9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .el-badge { display: inline-flex; align-items: center; gap: 4px; background: #f4faff; color: #6B8DB2; border-radius: 8px; padding: 3px 8px; font-size: 0.75rem; font-weight: 600; }

  .el-btn-edit { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 2px solid #0B96D9; color: #0B96D9; background: #fff; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .el-btn-edit:hover { background: #0B96D9; color: #fff; }
  .el-btn-download { display: flex; align-items: center; justify-content: center; padding: 8px 10px; border-radius: 10px; border: 2px solid #0B96D9; color: #0B96D9; background: #fff; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .el-btn-download:hover { background: #0B96D9; color: #fff; }
  .el-btn-delete { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 2px solid #ffd0d0; color: #e05252; background: #fff; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .el-btn-delete:hover { background: #e05252; color: #fff; border-color: #e05252; }

  .el-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .el-dialog { background: #fff; border-radius: 20px; padding: 32px; max-width: 380px; width: 100%; box-shadow: 0 16px 48px rgba(5,59,118,0.18); text-align: center; }

  /* Download modal */
  .dl-overlay { position: fixed; inset: 0; background: rgba(5,59,118,0.45); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 16px; animation: dlFadeIn 0.2s ease; }
  @keyframes dlFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .dl-modal { background: #fff; border-radius: 24px; padding: 32px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(5,59,118,0.22); animation: dlSlideUp 0.22s ease; }
  @keyframes dlSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .dl-step-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f7ff; }
  .dl-step-row:last-child { border-bottom: none; }
  .dl-step-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dl-spinner { animation: spin 0.8s linear infinite; }

  @media (max-width: 767px) {
    .el-title { font-size: 1.3rem !important; }
    .el-card { flex-direction: column; align-items: flex-start; gap: 14px; padding: 16px; }
    .el-actions { width: 100%; display: flex; gap: 8px; flex-wrap: wrap; }
    .el-btn-edit, .el-btn-download, .el-btn-delete { flex: 1; justify-content: center; }
  }
`;

const SHEET_LABELS = {
  question_sheet:   'Question Sheet',
  grid_sheet:       'Grid Sheet',
  correction_sheet: 'Correction Sheet',
};

function DownloadModal({ exam, onClose }) {
  const { downloadAll, loading, error, completedSteps, allDone, reset, SHEET_STEPS } = useDownloadPDF({
    form: exam.form,
    questions: exam.questions || [],
    checkboxType: exam.checkboxType,
    gridLayout: exam.gridLayout,
  });

  function handleStart() { reset(); downloadAll(); }
  function handleClose() { reset(); onClose(); }

  return (
    <div className="dl-overlay" onClick={handleClose}>
      <div className="dl-modal" onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #0B96D9, #053B76)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Download size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#053B76', fontWeight: 700, fontSize: '1rem' }}>Download PDF sheets</h3>
            <p style={{ margin: 0, color: '#6B8DB2', fontSize: '0.8rem', fontWeight: 600 }}>
              {exam.form?.title ? `"${exam.form.title}"` : 'All 3 sheets will be downloaded'}
            </p>
          </div>
          <button onClick={handleClose} style={{ marginLeft: 'auto', width: 32, height: 32, borderRadius: '50%', border: '2px solid #ceedf8', background: '#fff', color: '#6B8DB2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          {SHEET_STEPS.map((step, idx) => {
            const isDone   = completedSteps.includes(step.key);
            const isActive = loading && !isDone && completedSteps.length === idx;
            return (
              <div key={step.key} className="dl-step-row">
                <div className="dl-step-icon" style={{ background: isDone ? '#e8fff6' : isActive ? '#e8f6ff' : '#f4faff' }}>
                  {isDone
                    ? <CheckCircle2 size={18} color="#0FE2A6" />
                    : isActive
                      ? <Download size={18} color="#0B96D9" className="dl-spinner" />
                      : <Download size={18} color="#b0c8e0" />
                  }
                </div>
                <span style={{ flex: 1, fontWeight: 600, color: isDone ? '#053B76' : '#6B8DB2', fontSize: '0.88rem' }}>{SHEET_LABELS[step.key]}</span>
                {isDone   && <span style={{ fontSize: '0.75rem', color: '#0FE2A6', fontWeight: 700 }}>Done</span>}
                {isActive && <span style={{ fontSize: '0.75rem', color: '#0B96D9', fontWeight: 700 }}>Downloading…</span>}
                {!isDone && !isActive && !loading && <span style={{ fontSize: '0.75rem', color: '#b0c8e0', fontWeight: 600 }}>Pending</span>}
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fff0f0', border: '1.5px solid #ffd0d0', borderRadius: 12, padding: '12px 14px', marginBottom: 18 }}>
            <XCircle size={18} color="#e05252" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ margin: 0, color: '#e05252', fontWeight: 700, fontSize: '0.85rem' }}>Download failed</p>
              <p style={{ margin: '3px 0 0', color: '#c04040', fontSize: '0.78rem' }}>{error}</p>
              <p style={{ margin: '4px 0 0', color: '#6B8DB2', fontSize: '0.75rem' }}>Make sure the backend server is running.</p>
            </div>
          </div>
        )}

        {allDone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#e8fff6', border: '1.5px solid #0FE2A6', borderRadius: 12, padding: '12px 14px', marginBottom: 18 }}>
            <CheckCircle2 size={18} color="#0FE2A6" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, color: '#053B76', fontWeight: 700, fontSize: '0.85rem' }}>All 3 sheets downloaded successfully!</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleClose} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '2px solid #ceedf8', background: '#fff', color: '#053B76', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
            Close
          </button>
          <button
            onClick={handleStart}
            disabled={loading}
            style={{ flex: 2, padding: '10px', borderRadius: 12, border: 'none', background: loading ? '#b0c8e0' : 'linear-gradient(135deg, #0B96D9, #053B76)', color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Download size={16} />
            {loading ? 'Downloading…' : allDone ? 'Download again' : 'Download all 3 PDFs'}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ExamList() {
  const { exams, deleteExam, startEditExam, cancelEdit } = useExamList();
  const { loadExamConfig, resetForm } = useExamConfig();
  const { loadQuestions, resetQuestions } = useQuestions();
  const navigate = useNavigate();
  const [confirmId, setConfirmId] = useState(null);
  const [downloadExam, setDownloadExam] = useState(null);

  function handleEdit(exam) {
    startEditExam(exam.id);
    loadExamConfig(exam.form, exam.checkboxType, exam.gridLayout);
    loadQuestions(exam.questions || []);
    navigate('/dashboard/exam-config');
  }

  function handleNewExam() {
    cancelEdit();
    resetForm();
    resetQuestions();
    navigate('/dashboard/exam-config');
  }

  function handleDeleteConfirm() {
    deleteExam(confirmId);
    setConfirmId(null);
  }

  return (
    <>
      <style>{styles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#e8f6ff', color: '#0B96D9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="el-title" style={{ color: '#053B76', fontWeight: 700, margin: 0 }}>Exam List</h2>
            <p style={{ color: '#6B8DB2', margin: 0, fontSize: '0.85rem' }}>
              {exams.length} exam{exams.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <button
            onClick={handleNewExam}
            style={{ marginLeft: 'auto', padding: '10px 22px', background: '#0B96D9', color: '#fff', fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ClipboardList size={16} /> New exam
          </button>
        </div>

        {exams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B8DB2' }}>
            <BookOpen size={48} style={{ opacity: 0.25, marginBottom: 16 }} />
            <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>No exams saved yet.</p>
            <p style={{ fontSize: '0.85rem', margin: '6px 0 20px' }}>Click Save on the correction sheet to save your first exam.</p>
            <button
              onClick={handleNewExam}
              style={{ padding: '10px 24px', background: '#0B96D9', color: '#fff', fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer' }}
            >
              Create an exam
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {exams.map((exam) => (
              <div key={exam.id} className="el-card">
                <div className="el-icon-box"><ClipboardList size={24} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#053B76', fontSize: '1rem', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {exam.form?.title || 'Untitled exam'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {exam.form?.module   && <span className="el-badge"><BookOpen size={12} />{exam.form.module}</span>}
                    {exam.form?.duration && <span className="el-badge"><Clock size={12} />{exam.form.duration}</span>}
                    {exam.questions?.length > 0 && <span className="el-badge"><Hash size={12} />{exam.questions.length} questions</span>}
                    {exam.savedAt && <span className="el-badge"><Calendar size={12} />{formatDate(exam.savedAt)}</span>}
                  </div>
                </div>
                <div className="el-actions" style={{ display: 'flex', gap: 8 }}>
                  <button className="el-btn-download" onClick={() => setDownloadExam(exam)} title="Download"><Download size={16} /></button>
                  <button className="el-btn-edit" onClick={() => handleEdit(exam)}><Pencil size={14} /> Edit</button>
                  <button className="el-btn-delete" onClick={() => setConfirmId(exam.id)}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {downloadExam && (
        <DownloadModal exam={downloadExam} onClose={() => setDownloadExam(null)} />
      )}

      {confirmId && (
        <div className="el-overlay" onClick={() => setConfirmId(null)}>
          <div className="el-dialog" onClick={e => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff0f0', color: '#e05252', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ color: '#053B76', fontWeight: 700, margin: '0 0 8px' }}>Delete this exam?</h3>
            <p style={{ color: '#6B8DB2', fontSize: '0.88rem', margin: '0 0 24px' }}>This action cannot be undone. The exam and all its questions will be permanently deleted.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmId(null)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '2px solid #ceedf8', background: '#fff', color: '#053B76', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDeleteConfirm} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: '#e05252', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}