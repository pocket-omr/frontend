import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PenLine, Eye, LayoutGrid, CheckSquare, ArrowLeft, Download } from 'lucide-react';

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const responsiveStyles = `
  .qs-title { font-size: 1.8rem; }
  .qs-choices-grid { grid-template-columns: 1fr 1fr; gap: 4px 48px; }
  .qs-page-card { padding: 32px; }
  .qs-header-grid { grid-template-columns: 1fr 1fr; }
  .qs-student-grid { grid-template-columns: repeat(4, 1fr); }

  /* Steps */
  .qs-steps { display: flex; align-items: flex-start; gap: 0; margin-bottom: 28px; width: 100%; overflow: hidden; min-width: 0; }
  .qs-step-item { display: flex; align-items: center; flex: 1; min-width: 0; }
  .qs-step-item:last-child { flex: 0 0 auto; }
  .qs-step-btn {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 0; flex-shrink: 0;
  }
  .qs-step-circle {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.85rem; transition: all 0.2s;
    border: 2.5px solid #ceedf8; background: #fff; color: #6B8DB2;
    flex-shrink: 0;
  }
  .qs-step-circle.active { background: #0B96D9; border-color: #0B96D9; color: #fff; box-shadow: 0 4px 12px rgba(11,150,217,0.28); }
  .qs-step-circle.done { background: #f4faff; border-color: #0B96D9; color: #0B96D9; }
  .qs-step-label { font-size: 0.72rem; font-weight: 600; color: #6B8DB2; white-space: nowrap; }
  .qs-step-label.active { color: #0B96D9; }
  .qs-step-label.done { color: #0B96D9; }
  .qs-step-line { flex: 1; height: 2.5px; background: #ceedf8; margin: 0 6px; margin-bottom: 22px; border-radius: 2px; transition: background 0.3s; min-width: 0; }
  .qs-step-line.done { background: #0B96D9; }

  .qs-step-circle.download { background: linear-gradient(135deg, #0B96D9, #053B76) !important; border-color: #0B96D9 !important; color: #fff !important; box-shadow: 0 4px 14px rgba(11,150,217,0.35) !important; }
  .qs-step-label.download { color: #0B96D9 !important; font-weight: 700 !important; }

  /* Back button */
  .qs-back-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: #fff; border: 2px solid #ceedf8;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #0B96D9; transition: all 0.2s; flex-shrink: 0;
  }
  .qs-back-btn:hover { background: #0B96D9; color: #fff; border-color: #0B96D9; box-shadow: 0 4px 12px rgba(11,150,217,0.25); }

  @media (max-width: 1024px) and (min-width: 768px) {
    .qs-page-card { padding: 24px !important; }
  }
  @media (max-width: 767px) {
    .qs-title { font-size: 1.3rem !important; }
    .qs-toolbar { flex-wrap: wrap; gap: 10px !important; }
    .qs-toolbar h2 { flex: 1; }
    .qs-choices-grid { grid-template-columns: 1fr !important; }
    .qs-page-card { padding: 16px !important; border-radius: 16px !important; }
    .qs-header-grid { grid-template-columns: 1fr !important; gap: 4px !important; }
    .qs-student-grid { grid-template-columns: 1fr 1fr !important; }
    .qs-btn { padding: 8px 16px !important; font-size: 0.85rem !important; }
    .qs-step-label { font-size: 0.62rem !important; }
    .qs-step-circle { width: 34px !important; height: 34px !important; }
  }
  @media (max-width: 480px) {
    .qs-step-label { display: none !important; }
    .qs-step-circle { width: 30px !important; height: 30px !important; font-size: 0.75rem !important; }
  }

  @media print {
    .qs-no-print { display: none !important; }
    .qs-page-card {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .qs-page-card.page-break { page-break-after: always; break-after: page; }
    #qs-print-wrapper { display: flex !important; flex-direction: column; gap: 0; }
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
    <div className="qs-steps qs-no-print">
      {steps.map((step, i) => {
        const isDone   = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.label} className="qs-step-item">
            <button className="qs-step-btn" onClick={() => navigate(step.path)}>
              <div
                className={`qs-step-circle${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isDone && !step.isDownload ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : step.icon}
              </div>
              <span className={`qs-step-label${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}>
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && <div className={`qs-step-line${isDone ? ' done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function ExamHeader({ exam }) {
  return (
    <div className="qs-header-grid" style={{ border: '2px solid #ceedf8', borderRadius: 14, padding: 16, marginBottom: 16, color: '#053B76', fontSize: '0.9rem', display: 'grid', gap: '6px 32px' }}>
      <div><span style={{ fontWeight: 700 }}>Exam subject: </span>{exam.title}</div>
      <div><span style={{ fontWeight: 700 }}>University: </span>{exam.university}</div>
      <div>
        <span style={{ fontWeight: 700 }}>Module: </span>{exam.module}
        <span style={{ fontWeight: 700, marginLeft: 16 }}>Duration: </span>{exam.duration}
      </div>
      <div><span style={{ fontWeight: 700 }}>Page: </span>{exam.page}</div>
    </div>
  );
}

function LetterBoxes({ count }) {
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: 17, height: 17, border: '1.5px solid #053B76', borderRadius: 2 }} />
      ))}
    </div>
  );
}

function StudentInfo() {
  return (
    <div style={{ border: '1.5px solid #ceedf8', borderRadius: 14, padding: '14px 18px', marginBottom: 24, color: '#053B76', fontSize: '0.82rem' }}>
      <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#444', borderBottom: '1px solid #ceedf8', paddingBottom: 8 }}>
        Write clearly in UPPERCASE letters, as it appears in your student ID.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>First Name</div>
          <LetterBoxes count={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Last Name</div>
          <LetterBoxes count={20} />
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Registration Number</div>
            <LetterBoxes count={12} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Group</div>
            <LetterBoxes count={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionSheet() {
  const { questions } = useQuestions();
  const { form } = useExamConfig();
  const navigate = useNavigate();

  const questionsPerPage = parseInt(form.questionsPerPage) || 20;
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage)
  );

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        {/* STEP NAV — hidden on print */}
        <StepsNav currentIndex={2} navigate={navigate} />

        {/* TOOLBAR — hidden on print */}
        <div className="qs-toolbar qs-no-print" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="qs-back-btn" onClick={() => navigate('/dashboard/questions')} title="Back to Add questions">
            <ArrowLeft size={18} />
          </button>
          <h2 className="qs-title" style={{ color: '#053B76', fontWeight: 700, margin: 0, flex: 1 }}>
            Question sheet{' '}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6B8DB2' }}>
              {totalPages} page{totalPages > 1 ? 's' : ''}
            </span>
          </h2>
        </div>

        {/* PAGES — this is what prints */}
        <div id="qs-print-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {pages.map((pageQs, pi) => (
            <div
              key={pi}
              className={`qs-page-card${pi < pages.length - 1 ? ' page-break' : ''}`}
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
              {questions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6B8DB2', padding: '32px 0' }}>No questions added yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {pageQs.map((q, i) => {
                    const gi = pi * questionsPerPage + i;
                    return (
                      <div key={q.id} style={{ color: '#053B76' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 10, marginTop: 0 }}>
                          Q{gi + 1}. {q.text || `Question ${gi + 1}`}
                        </p>
                        <div className="qs-choices-grid" style={{ display: 'grid', marginLeft: 20 }}>
                          {q.choices.map((c, ci) => (
                            <p key={ci} style={{ fontSize: '0.88rem', margin: '2px 0' }}>
                              <span style={{ fontWeight: 600 }}>{CHOICE_LABELS[ci] ?? ci + 1}.</span>{' '}
                              {c.text || `Choice ${CHOICE_LABELS[ci] ?? ci + 1}`}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}