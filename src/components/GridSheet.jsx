import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PenLine, Eye, LayoutGrid, CheckSquare, ArrowLeft, Download } from 'lucide-react';

function getLabel(i) { return String.fromCharCode(65 + i); }

const responsiveStyles = `
  .gs-title { font-size: 1.8rem; }
  .gs-page-card { padding: 32px; }
  .gs-header-grid { grid-template-columns: 1fr 1fr; }
  .gs-student-grid { grid-template-columns: repeat(4, 1fr); }
  .gs-double-col { flex-direction: row; gap: 24px; }

  /* Steps */
  .gs-steps { display: flex; align-items: flex-start; gap: 0; margin-bottom: 28px; width: 100%; overflow: hidden; min-width: 0; }
  .gs-step-item { display: flex; align-items: center; flex: 1; min-width: 0; }
  .gs-step-item:last-child { flex: 0 0 auto; }
  .gs-step-btn {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 0; flex-shrink: 0;
  }
  .gs-step-circle {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.85rem; transition: all 0.2s;
    border: 2.5px solid #ceedf8; background: #fff; color: #6B8DB2;
    flex-shrink: 0;
  }
  .gs-step-circle.active { background: #0B96D9; border-color: #0B96D9; color: #fff; box-shadow: 0 4px 12px rgba(11,150,217,0.28); }
  .gs-step-circle.done { background: #f4faff; border-color: #0B96D9; color: #0B96D9; }
  .gs-step-label { font-size: 0.72rem; font-weight: 600; color: #6B8DB2; white-space: nowrap; }
  .gs-step-label.active { color: #0B96D9; }
  .gs-step-label.done { color: #0B96D9; }
  .gs-step-line { flex: 1; height: 2.5px; background: #ceedf8; margin: 0 6px; margin-bottom: 22px; border-radius: 2px; transition: background 0.3s; min-width: 0; }
  .gs-step-line.done { background: #0B96D9; }

  .gs-step-circle.download { background: linear-gradient(135deg, #0B96D9, #053B76) !important; border-color: #0B96D9 !important; color: #fff !important; box-shadow: 0 4px 14px rgba(11,150,217,0.35) !important; }
  .gs-step-label.download { color: #0B96D9 !important; font-weight: 700 !important; }

  /* Back button */
  .gs-back-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: #fff; border: 2px solid #ceedf8;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #0B96D9; transition: all 0.2s; flex-shrink: 0;
  }
  .gs-back-btn:hover { background: #0B96D9; color: #fff; border-color: #0B96D9; box-shadow: 0 4px 12px rgba(11,150,217,0.25); }

  @media (max-width: 1024px) and (min-width: 768px) {
    .gs-page-card { padding: 20px !important; }
    .gs-double-col { gap: 16px !important; }
  }
  @media (max-width: 767px) {
    .gs-title { font-size: 1.3rem !important; }
    .gs-toolbar { flex-wrap: wrap; gap: 10px !important; }
    .gs-page-card { padding: 14px !important; border-radius: 16px !important; }
    .gs-header-grid { grid-template-columns: 1fr !important; gap: 4px !important; }
    .gs-student-grid { grid-template-columns: 1fr 1fr !important; }
    .gs-double-col { flex-direction: column !important; }
    .gs-btn { padding: 8px 16px !important; font-size: 0.85rem !important; }
    .gs-cell { width: 24px !important; height: 24px !important; }
    th, td { padding: 6px 6px !important; font-size: 0.78rem !important; }
    .gs-step-label { font-size: 0.62rem !important; }
    .gs-step-circle { width: 34px !important; height: 34px !important; }
  }
  @media (max-width: 480px) {
    .gs-step-label { display: none !important; }
    .gs-step-circle { width: 30px !important; height: 30px !important; font-size: 0.75rem !important; }
  }

  @media print {
    .gs-no-print { display: none !important; }
    .gs-page-card {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .gs-page-card.page-break { page-break-after: always; break-after: page; }
    #gs-print-wrapper { display: flex !important; flex-direction: column; gap: 0; }
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
    <div className="gs-steps gs-no-print">
      {steps.map((step, i) => {
        const isDone   = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.label} className="gs-step-item">
            <button className="gs-step-btn" onClick={() => navigate(step.path)}>
              <div
                className={`gs-step-circle${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isDone && !step.isDownload ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : step.icon}
              </div>
              <span className={`gs-step-label${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}>
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && <div className={`gs-step-line${isDone ? ' done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function HowToFill({ checkboxType }) {
  const isBubble = checkboxType === 'Bubbel';
  return (
    <div style={{ marginTop: 20, border: '1.5px solid #ceedf8', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: '#4a4a4a', color: '#fff', fontWeight: 700, fontSize: '0.78rem', padding: '6px 14px', letterSpacing: 1 }}>
        HOW TO FILL
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '10px 16px', background: '#fff' }}>
        {/* Wrong / Correct examples */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Partial */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {isBubble
                  ? <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #888', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 3, left: 3, width: 10, height: 10, borderRadius: '50%', background: '#bbb' }} />
                    </div>
                  : <div style={{ width: 22, height: 22, borderRadius: 3, border: '2px solid #888', background: '#ddd' }} />
                }
                <span style={{ fontSize: '0.6rem', color: '#888' }}>Partial</span>
              </div>
              {/* Cross overflow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {isBubble
                  ? <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 14, color: '#888', lineHeight: 1 }}>✕</span>
                    </div>
                  : <div style={{ width: 22, height: 22, borderRadius: 3, border: '2px solid #888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 14, color: '#888', lineHeight: 1 }}>✕</span>
                    </div>
                }
                <span style={{ fontSize: '0.6rem', color: '#888' }}>Cross Overflow</span>
              </div>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#c00', fontWeight: 700 }}>WRONG</span>
          </div>

          <span style={{ fontSize: '1.2rem', color: '#444', margin: '0 4px' }}>→</span>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {isBubble
              ? <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#222' }} />
              : <div style={{ width: 22, height: 22, borderRadius: 3, border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14, color: '#222', lineHeight: 1, fontWeight: 700 }}>✕</span>
                </div>
            }
            <span style={{ fontSize: '0.65rem', color: '#222', fontWeight: 700 }}>CORRECT</span>
          </div>
        </div>

        {/* Rules */}
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            'Use black pen only',
            isBubble ? 'Fill the circle completely' : 'Fill the square completely',
            'Do not cross the boundary',
            'One answer per question',
          ].map(rule => (
            <li key={rule} style={{ fontSize: '0.75rem', color: '#333', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#0B96D9', fontWeight: 700 }}>•</span> {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GridCell({ checkboxType }) {
  const base = { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
  if (checkboxType === 'Bubbel')
    return <div className="gs-cell" style={{ ...base, width: 28, height: 28, borderRadius: '50%', border: '2px solid #ceedf8' }} />;
  return <div className="gs-cell" style={{ ...base, width: 28, height: 28, borderRadius: 4, border: '2px solid #ceedf8' }} />;
}

function GrayCell() {
  return <div className="gs-cell" style={{ width: 28, height: 28, borderRadius: 4, background: '#f0f0f0', margin: '0 auto' }} />;
}

function GridTable({ questions, colLabels, checkboxType, startIndex = 0 }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#053B76', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#0B96D9', color: '#fff' }}>
            <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 700 }}>Q</th>
            {colLabels.map(l => <th key={l} style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{l}</th>)}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={q.id} style={{ background: i % 2 === 0 ? '#fff' : '#f4faff' }}>
              <td style={{ padding: '8px 16px', fontWeight: 700 }}>Q{startIndex + i + 1}</td>
              {colLabels.map((l, li) => (
                <td key={l} style={{ padding: '6px 8px', textAlign: 'center' }}>
                  {li < q.choices.length ? <GridCell checkboxType={checkboxType} /> : <GrayCell />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExamHeader({ exam }) {
  return (
    <div className="gs-header-grid" style={{ border: '1px solid #ceedf8', borderRadius: 14, padding: 14, marginBottom: 14, color: '#053B76', fontSize: '0.85rem', display: 'grid', gap: '5px 32px' }}>
      <div><span style={{ fontWeight: 700 }}>Exam subject: </span>{exam.title}</div>
      <div><span style={{ fontWeight: 700 }}>University: </span>{exam.university}</div>
      <div><span style={{ fontWeight: 700 }}>Module: {exam.module} | Duration: {exam.duration}</span></div>
      <div><span style={{ fontWeight: 700 }}>Page: </span>{exam.page}</div>
    </div>
  );
}

function LetterBoxes({ count }) {
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: 22, height: 26, border: '1.5px solid #053B76', borderRadius: 2 }} />
      ))}
    </div>
  );
}

function StudentInfo() {
  return (
    <div style={{ border: '1.5px solid #ceedf8', borderRadius: 14, padding: '14px 18px', marginBottom: 20, color: '#053B76', fontSize: '0.82rem' }}>
      <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#444', borderBottom: '1px solid #ceedf8', paddingBottom: 8 }}>
        Write clearly in UPPERCASE letters, as it appears in your student ID.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>First Name</div>
            <LetterBoxes count={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Group</div>
            <LetterBoxes count={2} />
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Last Name</div>
          <LetterBoxes count={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Serial Code</div>
          <LetterBoxes count={12} />
        </div>
      </div>
    </div>
  );
}

export default function GridSheet() {
  const { questions } = useQuestions();
  const { checkboxType, gridLayout, form } = useExamConfig();
  const navigate = useNavigate();

  const questionsPerPage = parseInt(form.questionsPerPage) || 20;
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage)
  );

  const maxChoices = questions.length > 0 ? Math.max(...questions.map(q => q.choices.length)) : 4;
  const colLabels  = Array.from({ length: maxChoices }, (_, i) => getLabel(i));
  const isDouble   = gridLayout === 'Double Column';

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        {/* STEP NAV — hidden on print */}
        <StepsNav currentIndex={3} navigate={navigate} />

        {/* TOOLBAR — hidden on print */}
        <div className="gs-toolbar gs-no-print" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="gs-back-btn" onClick={() => navigate('/dashboard/questions')} title="Back to Add questions">
            <ArrowLeft size={18} />
          </button>
          <h2 className="gs-title" style={{ color: '#053B76', fontWeight: 700, margin: 0, flex: 1 }}>
            Grid sheet{' '}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6B8DB2' }}>
              {totalPages} page{totalPages > 1 ? 's' : ''}
            </span>
          </h2>
        </div>

        {/* PAGES — this is what prints */}
        <div id="gs-print-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {pages.map((pageQs, pi) => {
            const startIndex = pi * questionsPerPage;
            const half    = Math.ceil(pageQs.length / 2);
            const leftQs  = isDouble ? pageQs.slice(0, half) : pageQs;
            const rightQs = isDouble ? pageQs.slice(half)    : [];

            return (
              <div
                key={pi}
                className={`gs-page-card${pi < pages.length - 1 ? ' page-break' : ''}`}
                style={{
                  background: '#fff', borderRadius: 24,
                  border: '2px solid #ceedf8', padding: 32,
                  boxShadow: '0 2px 8px rgba(5,59,118,0.06)',
                }}
              >
                <ExamHeader exam={{
                  title: form.title,
                  university: form.university,
                  module: form.module,
                  duration: form.duration,
                  page: `${pi + 1} / ${totalPages}`,
                }} />

                <StudentInfo />

                {form.instructions && form.instructions.trim() !== '' && (
                  <div style={{
                    border: '1.5px solid #ceedf8', borderRadius: 12, padding: '12px 16px',
                    marginBottom: 20, background: '#f4faff', color: '#053B76',
                    fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                  }}>
                    <span style={{ fontWeight: 700, marginRight: 6 }}>Instructions:</span>
                    {form.instructions.trim()}
                  </div>
                )}

                {questions.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6B8DB2', padding: '32px 0' }}>No questions added yet.</p>
                ) : isDouble ? (
                  <div className="gs-double-col" style={{ display: 'flex' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <GridTable questions={leftQs}  colLabels={colLabels} checkboxType={checkboxType} startIndex={startIndex} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <GridTable questions={rightQs} colLabels={colLabels} checkboxType={checkboxType} startIndex={startIndex + half} />
                    </div>
                  </div>
                ) : (
                  <GridTable questions={pageQs} colLabels={colLabels} checkboxType={checkboxType} startIndex={startIndex} />
                )}

                <HowToFill checkboxType={checkboxType} />
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}