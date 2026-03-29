import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PenLine, Eye, LayoutGrid, CheckSquare, ArrowLeft, Download } from 'lucide-react';

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const responsiveStyles = `
  .qc-choice-input { font-size: 0.9rem; }

  /* Steps */
  .qc-steps { display: flex; align-items: flex-start; gap: 0; margin-bottom: 28px; width: 100%; overflow: hidden; min-width: 0; }
  .qc-step-item { display: flex; align-items: center; flex: 1; min-width: 0; }
  .qc-step-item:last-child  { flex: 0 0 auto; }
  .qc-step-btn {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  cursor: pointer; background: none; border: none; padding: 0; flex-shrink: 0;
}
  .qc-step-circle {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.85rem; transition: all 0.2s;
    border: 2.5px solid #ceedf8; background: #fff; color: #6B8DB2;
    flex-shrink: 0;
  }
  .qc-step-circle.active { background: #0B96D9; border-color: #0B96D9; color: #fff; box-shadow: 0 4px 12px rgba(11,150,217,0.28); }
  .qc-step-circle.done { background: #f4faff; border-color: #0B96D9; color: #0B96D9; }
  .qc-step-label { font-size: 0.72rem; font-weight: 600; color: #6B8DB2; white-space: nowrap; }
  .qc-step-label.active { color: #0B96D9; }
  .qc-step-label.done { color: #0B96D9; }
  .qc-step-line { flex: 1; height: 2.5px; background: #ceedf8; margin: 0 6px; margin-bottom: 22px; border-radius: 2px; transition: background 0.3s; min-width: 0; }
  .qc-step-line.done { background: #0B96D9; }

  .qc-step-circle.download { background: linear-gradient(135deg, #0B96D9, #053B76) !important; border-color: #0B96D9 !important; color: #fff !important; box-shadow: 0 4px 14px rgba(11,150,217,0.35) !important; }
  .qc-step-label.download { color: #0B96D9 !important; font-weight: 700 !important; }

  /* Back button */
  .qc-back-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: #fff; border: 2px solid #ceedf8;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #0B96D9; transition: all 0.2s; flex-shrink: 0;
  }
  .qc-back-btn:hover { background: #0B96D9; color: #fff; border-color: #0B96D9; box-shadow: 0 4px 12px rgba(11,150,217,0.25); }

  @media (max-width: 767px) {
    .qc-header h2 { font-size: 1.5rem !important; }
    .qc-add-btn { padding: 8px 20px !important; font-size: 0.9rem !important; }
    .qc-card { margin-bottom: 16px !important; border-radius: 16px !important; }
    .qc-choice-input { font-size: 0.85rem !important; }
    .qc-choice-label { width: 28px !important; height: 28px !important; font-size: 0.75rem !important; }
    .qc-correct-btn { width: 28px !important; height: 28px !important; }
    .qc-del-choice { width: 24px !important; height: 24px !important; }
    .qc-step-label { font-size: 0.62rem !important; }
    .qc-step-circle { width: 34px !important; height: 34px !important; }
  }

  @media (max-width: 480px) {
    .qc-step-label { display: none !important; }
    .qc-step-circle { width: 30px !important; height: 30px !important; font-size: 0.75rem !important; }
  }
`;

const steps = [
  { label: "Create exam",      path: "/dashboard/exam-config",  icon: <ClipboardList size={16} /> },
  { label: "Add questions",    path: "/dashboard/questions",    icon: <PenLine size={16} /> },
  { label: "Question sheet",   path: "/dashboard/preview",      icon: <Eye size={16} /> },
  { label: "Grid sheet",       path: "/dashboard/grid-preview", icon: <LayoutGrid size={16} /> },
  { label: "Correction sheet", path: "/dashboard/correction",   icon: <CheckSquare size={16} /> },
  { label: "Download",         path: "/dashboard/correction",   icon: <Download size={16} />, isDownload: true },
];

function StepsNav({ currentIndex, navigate }) {
  return (
    <div className="qc-steps">
      {steps.map((step, i) => {
        const isDone   = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.label} className="qc-step-item">
            <button className="qc-step-btn" onClick={() => navigate(step.path)}>
              <div className={`qc-step-circle${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDone && !step.isDownload ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : step.icon}
              </div>
              <span className={`qc-step-label${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}>{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`qc-step-line${isDone ? ' done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuestionCard({ q, index, onDelete, onChange, onAddChoice, onChangeChoice, onSetCorrect, onDeleteChoice }) {
  return (
    <div className="qc-card" style={{
      marginBottom: 24, borderRadius: 20, border: '2px solid #ceedf8',
      background: '#fff', boxShadow: '0 2px 8px rgba(5,59,118,0.06)', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '2px solid #ceedf8' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#053B76',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.95rem', flexShrink: 0,
        }}>{index + 1}</div>
        <input
          type="text" value={q.text}
          onChange={e => onChange(q.id, 'text', e.target.value)}
          placeholder="Type a question..."
          style={{
            flex: 1, border: '1.5px solid #0B96D9', borderRadius: 10,
            padding: '8px 14px', color: '#053B76', fontWeight: 600,
            fontSize: '0.95rem', outline: 'none', minWidth: 0,
          }}
        />
        <button onClick={() => onDelete(q.id)} style={{
          width: 34, height: 34, borderRadius: '50%', background: '#fee2e2',
          color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
        }}>✕</button>
      </div>

      <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.choices.map((choice, ci) => (
          <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="qc-choice-label" style={{
              width: 32, height: 32, borderRadius: 8, background: '#0B96D9',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
            }}>{CHOICE_LABELS[ci] ?? ci + 1}</div>
            <input
              type="text" value={choice.text}
              onChange={e => onChangeChoice(q.id, ci, e.target.value)}
              placeholder={`Choice ${CHOICE_LABELS[ci] ?? ci + 1}`}
              className="qc-choice-input"
              style={{
                flex: 1, border: '1.5px solid #ceedf8', borderRadius: 10,
                padding: '8px 14px', color: '#053B76', fontSize: '0.9rem',
                outline: 'none', minWidth: 0,
              }}
            />
            <button className="qc-correct-btn" onClick={() => onSetCorrect(q.id, ci)} style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              border: q.correct === ci ? '2px solid #0B96D9' : '2px solid #ceedf8',
              background: q.correct === ci ? '#0B96D9' : '#fff',
              color: q.correct === ci ? '#fff' : '#ceedf8',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {q.correct === ci && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
            <button className="qc-del-choice" onClick={() => onDeleteChoice(q.id, ci)} style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: '#fff5f5', border: 'none', color: '#fca5a5',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
            }}>✕</button>
          </div>
        ))}

        <button onClick={() => onAddChoice(q.id)} style={{
          marginTop: 8, width: '100%', border: '2px dashed #0B96D9',
          color: '#0B96D9', borderRadius: 12, padding: '8px 0',
          fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: 'transparent',
        }}>+ Add choice</button>
      </div>
    </div>
  );
}

export default function QuestionsCreation() {
  const { questions, addQuestion, deleteQuestion, changeQuestion, addChoice, changeChoice, setCorrect, deleteChoice } = useQuestions();
  const navigate = useNavigate();

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        {/* STEP NAV */}
        <StepsNav currentIndex={1} navigate={navigate} />

        {/* HEADER */}
        <div className="qc-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          {/* Back button */}
          <button className="qc-back-btn" onClick={() => navigate('/dashboard/exam-config')} title="Back to Create exam">
            <ArrowLeft size={18} />
          </button>
          <h2 style={{ color: '#053B76', fontWeight: 700, fontSize: '1.8rem', margin: 0, flex: 1 }}>Questions</h2>
          <button className="qc-add-btn" onClick={addQuestion} style={{
            padding: '10px 32px', background: '#0B96D9', color: '#fff',
            fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer',
            fontSize: '1rem', boxShadow: '0 2px 8px rgba(11,150,217,0.25)',
          }}>Add</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, maxHeight: 'calc(100vh - 260px)' }}>
          {questions.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6B8DB2', padding: '64px 0' }}>
              No questions yet. Click <strong>Add</strong> to get started.
            </p>
          )}
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id} q={q} index={index}
              onDelete={deleteQuestion} onChange={changeQuestion}
              onAddChoice={addChoice} onChangeChoice={changeChoice}
              onSetCorrect={setCorrect} onDeleteChoice={deleteChoice}
            />
          ))}
        </div>
      </div>
    </>
  );
}