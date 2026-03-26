import React from 'react';
import { useQuestions } from '../context/QuestionsContext';

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const responsiveStyles = `
  .qc-choice-input { font-size: 0.9rem; }
  @media (max-width: 767px) {
    .qc-header h2 { font-size: 1.5rem !important; }
    .qc-add-btn { padding: 8px 20px !important; font-size: 0.9rem !important; }
    .qc-card { margin-bottom: 16px !important; border-radius: 16px !important; }
    .qc-choice-input { font-size: 0.85rem !important; }
    .qc-choice-label { width: 28px !important; height: 28px !important; font-size: 0.75rem !important; }
    .qc-correct-btn { width: 28px !important; height: 28px !important; }
    .qc-del-choice { width: 24px !important; height: 24px !important; }
  }
`;

function QuestionCard({ q, index, onDelete, onChange, onAddChoice, onChangeChoice, onSetCorrect, onDeleteChoice }) {
  return (
    <div className="qc-card" style={{
      marginBottom: 24, borderRadius: 20, border: '2px solid #ceedf8',
      background: '#fff', boxShadow: '0 2px 8px rgba(5,59,118,0.06)', overflow: 'hidden',
    }}>
      {/* Header */}
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

      {/* Choices */}
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

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className="qc-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ color: '#053B76', fontWeight: 700, fontSize: '1.8rem', margin: 0 }}>Questions</h2>
          <button className="qc-add-btn" onClick={addQuestion} style={{
            padding: '10px 32px', background: '#0B96D9', color: '#fff',
            fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer',
            fontSize: '1rem', boxShadow: '0 2px 8px rgba(11,150,217,0.25)',
          }}>Add</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, maxHeight: 'calc(100vh - 200px)' }}>
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