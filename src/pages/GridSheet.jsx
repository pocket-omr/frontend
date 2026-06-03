import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PenLine, Eye, LayoutGrid, CheckSquare, ArrowLeft, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function getLabel(i) { return String.fromCharCode(65 + i); }

const responsiveStyles = `
  .gs-title { font-size: 1.8rem; }
  .gs-page-card { padding: 32px; }

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

  @media (max-width: 767px) {
    .gs-title { font-size: 1.3rem !important; }
    .gs-toolbar { flex-wrap: wrap; gap: 10px !important; }
    .gs-page-card { padding: 14px !important; border-radius: 16px !important; }
    .gs-step-label { font-size: 0.62rem !important; }
    .gs-step-circle { width: 34px !important; height: 34px !important; }
  }
  @media (max-width: 480px) {
    .gs-step-label { display: none !important; }
    .gs-step-circle { width: 30px !important; height: 30px !important; font-size: 0.75rem !important; }
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
    <div className="gs-steps">
      {steps.map((step, i) => {
        const isDone   = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.label} className="gs-step-item">
            <button className="gs-step-btn" onClick={() => navigate(step.path)}>
              <div className={`gs-step-circle${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

function AlignmentMarker({ top, left, right, bottom }) {
  const style = { position: 'absolute', width: 10, height: 10, background: '#000', zIndex: 2 };
  if (top !== undefined) style.top = top;
  if (left !== undefined) style.left = left;
  if (right !== undefined) style.right = right;
  if (bottom !== undefined) style.bottom = bottom;
  return <div style={style} />;
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
  const marker = { width: 10, height: 10, background: '#000', flexShrink: 0 };
  return (
    <div style={{ color: '#053B76', fontSize: '0.82rem', marginBottom: 12 }}>
      {/* Top markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, marginLeft: -48, marginRight: -48 }}>
        <div style={marker} />
        <div style={marker} />
      </div>
      <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#444' }}>
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
      {/* Bottom markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginLeft: -48, marginRight: -48 }}>
        <div style={marker} />
        <div style={marker} />
      </div>
    </div>
  );
}

function BubbleGrid({ questions, maxChoices, checkboxType, startIndex }) {
  const colCount = 3;
  const rowsPerCol = Math.ceil(questions.length / colCount);
  const columns = [];
  for (let c = 0; c < colCount; c++) {
    columns.push(questions.slice(c * rowsPerCol, (c + 1) * rowsPerCol));
  }

  const marker = { width: 10, height: 10, background: '#000', flexShrink: 0 };

  return (
    <div>
      {/* Top markers — before first question row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, marginLeft: -48, marginRight: -48 }}>
        <div style={marker} />
        <div style={marker} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        {columns.map((colQs, ci) => (
          <div key={ci} style={{ flex: 1 }}>
            {colQs.map((q, ri) => {
              const qNum = startIndex + ci * rowsPerCol + ri + 1;
              return (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 24, fontSize: '0.8rem', fontWeight: 600, color: '#333', textAlign: 'right' }}>{qNum}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from({ length: maxChoices }).map((_, bi) => (
                      <div key={bi} style={{
                        width: 19, height: 19,
                        borderRadius: '50%',
                        border: '1.5px solid #555',
                        background: 'transparent',
                      }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom markers — after last question row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginLeft: -48, marginRight: -48 }}>
        <div style={marker} />
        <div style={marker} />
      </div>
    </div>
  );
}

function HowToFill({ checkboxType }) {
  const isBubble = checkboxType === 'Bubbel';
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden', maxWidth: 360 }}>
      <div style={{ background: '#4a4a4a', color: '#fff', fontWeight: 700, fontSize: '0.68rem', padding: '4px 10px', letterSpacing: 1 }}>
        HOW TO FILL
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 12px', fontSize: '0.7rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.6rem', color: '#888' }}>WRONG</span>
            <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
              <div style={{ width: 19, height: 19, borderRadius: '50%', border: '1.5px solid #888', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 3, left: 3, width: 8, height: 8, borderRadius: '50%', background: '#bbb' }} />
              </div>
              <div style={{ width: 19, height: 19, borderRadius: '50%', border: '1.5px solid #888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: '#888' }}>✕</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2, fontSize: '0.5rem', color: '#888', marginTop: 1 }}>
              <span>Partial</span><span>Cross</span>
            </div>
          </div>
          <span style={{ color: '#666' }}>→</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.6rem', color: '#333', fontWeight: 700 }}>CORRECT</span>
            <div style={{ width: 19, height: 19, borderRadius: '50%', background: '#333', margin: '2px auto 0' }} />
            <span style={{ fontSize: '0.5rem', color: '#333' }}>Filled</span>
          </div>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.65rem', color: '#444' }}>
          <li>• Use black pen only</li>
          <li>• {isBubble ? 'Fill the circle completely' : 'Fill the square completely'}</li>
          <li>• Do not cross the boundary</li>
          <li>• One answer per question</li>
        </ul>
      </div>
    </div>
  );
}

export default function GridSheet() {
  const { questions } = useQuestions();
  const { checkboxType, form } = useExamConfig();
  const navigate = useNavigate();

  const questionsPerPage = parseInt(form.questionsPerPage) || 20;
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage)
  );
  const maxChoices = questions.length > 0 ? Math.max(...questions.map(q => q.choices.length)) : 4;

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <StepsNav currentIndex={3} navigate={navigate} />

        <div className="gs-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="gs-back-btn" onClick={() => navigate('/dashboard/preview')} title="Back to Question sheet">
            <ArrowLeft size={18} />
          </button>
          <h2 className="gs-title" style={{ color: '#053B76', fontWeight: 700, margin: 0, flex: 1 }}>
            Grid sheet{' '}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6B8DB2' }}>
              {totalPages} page{totalPages > 1 ? 's' : ''}
            </span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {pages.map((pageQs, pi) => {
            const startIndex = pi * questionsPerPage;
            return (
              <div key={pi} className="gs-page-card" style={{
                background: '#fff', borderRadius: 24, border: '2px solid #ceedf8',
                padding: 32, boxShadow: '0 2px 8px rgba(5,59,118,0.06)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ padding: '0 16px' }}>
                  {/* Title */}
                  <div style={{ textAlign: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#333' }}>
                      {form.title || 'Exam'}
                    </div>
                    {form.duration && (
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Duration: {form.duration}</div>
                    )}
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '10px 0' }} />

                  <StudentInfo />

                  <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '10px 0' }} />

                  <p style={{ fontSize: '0.8rem', color: '#333', marginBottom: 12 }}>
                    Fill the circles completely using a black pen.
                  </p>

                  {questions.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6B8DB2', padding: '32px 0' }}>No questions added yet.</p>
                  ) : (
                    <BubbleGrid questions={pageQs} maxChoices={maxChoices} checkboxType={checkboxType} startIndex={startIndex} />
                  )}

                  <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <HowToFill checkboxType={checkboxType} />
                    <QRCodeSVG
                      value={JSON.stringify({
                        title: form.title,
                        module: form.module,
                        questions: questions.length,
                        choices: maxChoices,
                      })}
                      size={80}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
