import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useExamList } from '../context/ExamListContext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PenLine, Eye, LayoutGrid, CheckSquare, ArrowLeft, Download, CheckCircle2, XCircle } from 'lucide-react';
import { useDownloadPDF } from '../hooks/useDownloadPDF';
import { QRCodeSVG } from 'qrcode.react';

function getLabel(i) { return String.fromCharCode(65 + i); }
// Correct answers are an array of choice indices (multiple-choice supported).
function correctList(q) {
  return Array.isArray(q.correct) ? q.correct : q.correct == null ? [] : [q.correct];
}
function isCorrect(q, li) { return correctList(q).includes(li); }
function correctLabels(q) {
  const ls = correctList(q).filter(i => i < q.choices.length).sort((a, b) => a - b);
  return ls.length ? ls.map(getLabel).join(', ') : '—';
}
const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const responsiveStyles = `
  .cs-title { font-size: 1.8rem; }
  .cs-steps { display: flex; align-items: flex-start; gap: 0; margin-bottom: 28px; width: 100%; overflow: hidden; min-width: 0; }
  .cs-step-item { display: flex; align-items: center; flex: 1; min-width: 0; }
  .cs-step-item:last-child { flex: 0 0 auto; }
  .cs-step-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; background: none; border: none; padding: 0; flex-shrink: 0; }
  .cs-step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; transition: all 0.2s; border: 2.5px solid #ceedf8; background: #fff; color: #6B8DB2; flex-shrink: 0; }
  .cs-step-circle.active { background: #0B96D9; border-color: #0B96D9; color: #fff; box-shadow: 0 4px 12px rgba(11,150,217,0.28); }
  .cs-step-circle.done { background: #f4faff; border-color: #0B96D9; color: #0B96D9; }
  .cs-step-label { font-size: 0.72rem; font-weight: 600; color: #6B8DB2; white-space: nowrap; }
  .cs-step-label.active { color: #0B96D9; }
  .cs-step-label.done { color: #0B96D9; }
  .cs-step-line { flex: 1; height: 2.5px; background: #ceedf8; margin: 0 6px; margin-bottom: 22px; border-radius: 2px; transition: background 0.3s; min-width: 0; }
  .cs-step-line.done { background: #0B96D9; }
  .cs-back-btn { width: 40px; height: 40px; border-radius: 50%; background: #fff; border: 2px solid #ceedf8; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #0B96D9; transition: all 0.2s; flex-shrink: 0; }
  .cs-back-btn:hover { background: #0B96D9; color: #fff; border-color: #0B96D9; box-shadow: 0 4px 12px rgba(11,150,217,0.25); }
  .cs-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: #0FE2A6; color: #053B76; padding: 12px 28px; border-radius: 14px; font-weight: 700; font-size: 0.9rem; box-shadow: 0 8px 24px rgba(15,226,166,0.35); z-index: 9999; animation: toastIn 0.25s ease; }
  @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  .cs-step-circle.download { background: linear-gradient(135deg, #0B96D9, #053B76); border-color: #0B96D9; color: #fff; box-shadow: 0 4px 14px rgba(11,150,217,0.35); }
  .cs-step-circle.download:hover { transform: scale(1.12); box-shadow: 0 6px 20px rgba(11,150,217,0.45); }
  .cs-step-label.download { color: #0B96D9; font-weight: 700; }
  .dl-overlay { position: fixed; inset: 0; background: rgba(5,59,118,0.45); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .dl-modal { background: #fff; border-radius: 24px; padding: 32px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(5,59,118,0.22); animation: slideUp 0.22s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .dl-step-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f7ff; }
  .dl-step-row:last-child { border-bottom: none; }
  .dl-step-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dl-spinner { animation: spin 0.8s linear infinite; }
  .screen-only { display: block; }
  .print-only  { display: none;  }
  @media (max-width: 767px) {
    .cs-title { font-size: 1.3rem !important; }
    .cs-toolbar { flex-wrap: wrap; gap: 10px !important; }
    .cs-btn { padding: 8px 16px !important; font-size: 0.85rem !important; }
    .cs-step-label { font-size: 0.62rem !important; }
    .cs-step-circle { width: 34px !important; height: 34px !important; }
  }
  @media (max-width: 480px) {
    .cs-step-label { display: none !important; }
    .cs-step-circle { width: 30px !important; height: 30px !important; font-size: 0.75rem !important; }
  }
  @media print {
    body > * { display: none !important; }
    body > #cs-print-root { display: block !important; }
    .screen-only { display: none !important; }
    .print-only  { display: block !important; }
    .print-sheet { page-break-after: always; break-after: page; width: 100%; padding: 16px; box-sizing: border-box; }
    .print-sheet:last-child { page-break-after: avoid; break-after: avoid; }
    .print-sheet * { box-shadow: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
`;

const steps = [
  { label: "Create exam",      path: "/dashboard/exam-config",  icon: <ClipboardList size={16} /> },
  { label: "Add questions",    path: "/dashboard/questions",    icon: <PenLine size={16} /> },
  { label: "Question sheet",   path: "/dashboard/preview",      icon: <Eye size={16} /> },
  { label: "Grid sheet",       path: "/dashboard/grid-preview", icon: <LayoutGrid size={16} /> },
  { label: "Correction sheet", path: "/dashboard/correction",   icon: <CheckSquare size={16} /> },
  { label: "Download",         path: null,                      icon: <Download size={16} />, isDownload: true },
];

function StepsNav({ currentIndex, navigate, onDownloadClick }) {
  return (
    <div className="cs-steps">
      {steps.map((step, i) => {
        const isDone   = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.label} className="cs-step-item">
            <button className="cs-step-btn" onClick={() => step.isDownload ? onDownloadClick?.() : navigate(step.path)}>
              <div className={`cs-step-circle${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                {isDone && !step.isDownload ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : step.icon}
              </div>
              <span className={`cs-step-label${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}>{step.label}</span>
            </button>
            {i < steps.length - 1 && <div className={`cs-step-line${isDone ? ' done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function ExamHeader({ form, page, totalPages }) {
  return (
    <div style={{ border: '1px solid #ceedf8', borderRadius: 10, padding: '10px 14px', marginBottom: 10, color: '#053B76', fontSize: '0.83rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
      <div><span style={{ fontWeight: 700 }}>Exam subject: </span>{form.title}</div>
      <div><span style={{ fontWeight: 700 }}>University: </span>{form.university}</div>
      <div><span style={{ fontWeight: 700 }}>Module: {form.module}</span>{form.duration ? <span style={{ fontWeight: 700 }}> | Duration: {form.duration}</span> : ''}</div>
      <div><span style={{ fontWeight: 700 }}>Page: </span>{page} / {totalPages}</div>
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
  const marker = { width: 10, height: 10, background: '#000', flexShrink: 0 };
  return (
    <div style={{ border: '1.5px solid #ceedf8', borderRadius: 14, padding: '14px 18px', marginBottom: 20, color: '#053B76', fontSize: '0.82rem' }}>
      {/* Top markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, marginLeft: -36, marginRight: -36 }}>
        <div style={marker} />
        <div style={marker} />
      </div>
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
      {/* Bottom markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginLeft: -36, marginRight: -36 }}>
        <div style={marker} />
        <div style={marker} />
      </div>
    </div>
  );
}

/* ── Question Sheet ────────────────────────────────────────────── */
function QuestionSheetContent({ questions, form, questionsPerPage }) {
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage)
  );
  return (
    <>
      {pages.map((pageQs, pi) => (
        <div key={`qs-${pi}`} className="print-sheet">
          <ExamHeader form={form} page={pi + 1} totalPages={totalPages} />
          <StudentInfo />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {pageQs.map((q, i) => {
              const gi = pi * questionsPerPage + i;
              return (
                <div key={q.id} style={{ color: '#053B76' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 10, marginTop: 0 }}>
                    Q{gi + 1}. {q.text || `Question ${gi + 1}`}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 48px', marginLeft: 20 }}>
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
        </div>
      ))}
    </>
  );
}

/* ── Grid Sheet (Template Design) ─────────────────────────────── */
function AlignmentMarker({ top, left, right, bottom }) {
  const style = { position: 'absolute', width: 10, height: 10, background: '#000' };
  if (top !== undefined) style.top = top;
  if (left !== undefined) style.left = left;
  if (right !== undefined) style.right = right;
  if (bottom !== undefined) style.bottom = bottom;
  return <div style={style} />;
}

function GridSheetContent({ questions, form, questionsPerPage, checkboxType }) {
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage)
  );
  const maxChoices = questions.length > 0 ? Math.max(...questions.map(q => q.choices.length)) : 4;
  const isBubble = checkboxType === 'Bubbel';

  function BubbleGrid({ pageQs, startIndex }) {
    const colCount = 3;
    const rowsPerCol = Math.ceil(pageQs.length / colCount);
    const columns = [];
    for (let c = 0; c < colCount; c++) {
      columns.push(pageQs.slice(c * rowsPerCol, (c + 1) * rowsPerCol));
    }

    const marker = { width: 10, height: 10, background: '#000', flexShrink: 0 };

    return (
      <div>
        {/* Top markers — before first question row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <div style={marker} />
          <div style={marker} />
        </div>
      </div>
    );
  }

  function HowToFillPrint() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden', maxWidth: 360 }}>
          <div style={{ background: '#4a4a4a', color: '#fff', fontWeight: 700, fontSize: '0.68rem', padding: '4px 10px', letterSpacing: 1 }}>
            HOW TO FILL
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 12px', fontSize: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: '#888' }}>WRONG</span>
                <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #888', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 3, left: 3, width: 8, height: 8, borderRadius: '50%', background: '#bbb' }} />
                  </div>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid #888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, color: '#888' }}>✕</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, fontSize: '0.5rem', color: '#888', marginTop: 1 }}>
                  <span>Partial</span><span>Cross Overflow</span>
                </div>
              </div>
              <span style={{ color: '#666' }}>→</span>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: '#333', fontWeight: 700 }}>CORRECT</span>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#333', margin: '2px auto 0' }} />
                <span style={{ fontSize: '0.5rem', color: '#333' }}>Filled</span>
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.65rem', color: '#444' }}>
              <li>• Use black pen only</li>
              <li>• Fill the circle completely</li>
              <li>• Do not cross the boundary</li>
              <li>• One answer per question</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {pages.map((pageQs, pi) => {
        const startIndex = pi * questionsPerPage;
        return (
          <div key={`gs-${pi}`} className="print-sheet" style={{ position: 'relative', padding: 16, boxSizing: 'border-box' }}>
            <div style={{ padding: '0 20px' }}>
              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#333' }}>
                  {form.title || 'Exam'}
                </div>
                {form.duration && (
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Duration: {form.duration}</div>
                )}
              </div>

              {/* Separator */}
              <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '10px 0' }} />

              {/* Student info */}
              <StudentInfo />

              {/* Separator */}
              <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '10px 0' }} />

              {/* Instruction */}
              <p style={{ fontSize: '0.8rem', color: '#333', marginBottom: 12 }}>
                Fill the circles completely using a black pen.
              </p>

              {/* Bubble grid — this sits between the middle markers */}
              <BubbleGrid pageQs={pageQs} startIndex={startIndex} />

              {/* How to fill + QR code at bottom */}
              <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <HowToFillPrint />
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
    </>
  );
}

/* ── Correction Sheet (NO StudentInfo) ─────────────────────────── */
function CorrectionSheetContent({ questions, form, questionsPerPage }) {
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage)
  );
  const maxChoices = questions.length > 0 ? Math.max(...questions.map(q => q.choices.length)) : 4;
  const colLabels  = Array.from({ length: maxChoices }, (_, i) => getLabel(i));

  return (
    <>
      {pages.map((pageQs, pi) => {
        const startIndex = pi * questionsPerPage;
        const isLast = pi === pages.length - 1;
        return (
          <div key={`cs-${pi}`} className={isLast ? '' : 'print-sheet'} style={isLast ? { padding: '16px', boxSizing: 'border-box' } : {}}>
            <ExamHeader form={form} page={pi + 1} totalPages={totalPages} />
            <p style={{ color: '#053B76', fontSize: '0.75rem', marginBottom: 10, fontWeight: 600 }}>
              Correction Key — For teacher use only.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#053B76', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ background: '#0B96D9', color: '#fff', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                  <th style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 700 }}>Questions</th>
                  {colLabels.map(l => <th key={l} style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>{l}</th>)}
                  <th style={{ padding: '6px 12px', textAlign: 'center', fontWeight: 700 }}>Answer</th>
                </tr>
              </thead>
              <tbody>
                {pageQs.map((q, i) => {
                  const gi = startIndex + i;
                  return (
                    <tr key={q.id} style={{ background: i % 2 === 0 ? '#fff' : '#f4faff', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                      <td style={{ padding: '5px 12px', fontWeight: 700 }}>Q{gi + 1}</td>
                      {colLabels.map((l, li) => (
                        <td key={l} style={{ padding: '4px 6px', textAlign: 'center' }}>
                          {li < q.choices.length
                            ? <div style={{ width: 22, height: 22, borderRadius: 5, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isCorrect(q, li) ? '#0FE2A6' : 'transparent', border: isCorrect(q, li) ? '2px solid #0FE2A6' : '1.5px solid #ceedf8', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                                {isCorrect(q, li) && <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1 }}>✓</span>}
                              </div>
                            : <div style={{ width: 22, height: 22, borderRadius: 5, background: '#f0f0f0', margin: '0 auto', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
                          }
                        </td>
                      ))}
                      <td style={{ padding: '5px 12px', textAlign: 'center', fontWeight: 700 }}>
                        {correctLabels(q)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

/* ── Download Modal ─────────────────────────────────────────────── */
const SHEET_ICONS = {
  question_sheet:   '📄',
  grid_sheet:       '⊞',
  correction_sheet: '✅',
};
const SHEET_LABELS = {
  question_sheet:   'Question Sheet',
  grid_sheet:       'Grid Sheet',
  correction_sheet: 'Correction Sheet',
};

function DownloadModal({ onClose, form, questions, checkboxType, gridLayout }) {
  const { downloadAll, loading, error, completedSteps, allDone, reset, SHEET_STEPS } = useDownloadPDF({ form, questions, checkboxType, gridLayout });

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
              {form.title ? `"${form.title}"` : 'All 3 sheets will be downloaded'}
            </p>
          </div>
          <button onClick={handleClose} style={{ marginLeft: 'auto', width: 32, height: 32, borderRadius: '50%', border: '2px solid #ceedf8', background: '#fff', color: '#6B8DB2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ marginBottom: 24 }}>
          {SHEET_STEPS.map(step => {
            const isDone    = completedSteps.includes(step.key);
            const isActive  = loading && !isDone && completedSteps.length === SHEET_STEPS.indexOf(step);
            const isPending = !isDone && !isActive;
            return (
              <div key={step.key} className="dl-step-row">
                <div className="dl-step-icon" style={{ background: isDone ? '#e8fff6' : isActive ? '#e8f6ff' : '#f4faff' }}>
                  {isDone
                    ? <CheckCircle2 size={18} color="#0FE2A6" />
                    : isActive
                      ? <Download size={18} color="#0B96D9" className="dl-spinner" />
                      : <span style={{ fontSize: '1.1rem' }}>{SHEET_ICONS[step.key]}</span>
                  }
                </div>
                <span style={{ flex: 1, fontWeight: 600, color: isDone ? '#053B76' : '#6B8DB2', fontSize: '0.88rem' }}>{SHEET_LABELS[step.key]}</span>
                {isDone && <span style={{ fontSize: '0.75rem', color: '#0FE2A6', fontWeight: 700 }}>Done</span>}
                {isActive && <span style={{ fontSize: '0.75rem', color: '#0B96D9', fontWeight: 700 }}>Downloading…</span>}
                {isPending && !loading && <span style={{ fontSize: '0.75rem', color: '#b0c8e0', fontWeight: 600 }}>Pending</span>}
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
              <p style={{ margin: '4px 0 0', color: '#6B8DB2', fontSize: '0.75rem' }}>Make sure the backend server is running at the configured URL.</p>
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
          <button onClick={handleClose} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '2px solid #ceedf8', background: '#fff', color: '#053B76', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>Close</button>
          <button onClick={handleStart} disabled={loading}
            style={{ flex: 2, padding: '10px', borderRadius: 12, border: 'none', background: loading ? '#b0c8e0' : 'linear-gradient(135deg, #0B96D9, #053B76)', color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Download size={16} />
            {loading ? 'Downloading…' : allDone ? 'Download again' : 'Download all 3 PDFs'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function CorrectionSheet() {
  const { questions } = useQuestions();
  const { form, resetForm, checkboxType, gridLayout, students } = useExamConfig();
  const { saveExam } = useExamList();
  const { resetQuestions } = useQuestions();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState('Exam saved! Redirecting to exam list…');
  const [showDownload, setShowDownload] = React.useState(false);

  const questionsPerPage = parseInt(form.questionsPerPage) || 20;
  const totalCorrectionPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));

  function handlePrint() {
    const el = document.getElementById('cs-print-root');
    const placeholder = document.createElement('div');
    placeholder.id = 'cs-print-placeholder';

    if (el) {
      el.parentNode.insertBefore(placeholder, el);
      document.body.appendChild(el);
    }

    const afterPrint = () => {
      window.removeEventListener('afterprint', afterPrint);
      if (el && placeholder.parentNode) {
        placeholder.parentNode.insertBefore(el, placeholder);
        placeholder.remove();
      }
    };

    window.addEventListener('afterprint', afterPrint);
    window.print();
  }

  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      // Persist to the backend (the only store — nothing is kept locally).
      await saveExam(form, questions, checkboxType, gridLayout, students);
    } catch (err) {
      console.error('Could not save exam:', err);
      setSaving(false);
      // Keep the form intact so the user can retry without losing their work.
      setToastMsg('Could not save exam. Check your connection/login and try again.');
      setToast(true);
      setTimeout(() => setToast(false), 2800);
      return;
    }
    setToastMsg('Exam saved! Redirecting to exam list…');
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setSaving(false);
      resetForm();
      resetQuestions();
      navigate('/dashboard/exam-list');
    }, 1800);
  }

  return (
    <>
      <style>{responsiveStyles}</style>

      {/* ── Screen UI ── */}
      <div className="screen-only" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <StepsNav currentIndex={4} navigate={navigate} onDownloadClick={() => setShowDownload(true)} />

        <div className="cs-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="cs-back-btn" onClick={() => navigate('/dashboard/grid-preview')} title="Back to Grid sheet">
            <ArrowLeft size={18} />
          </button>
          <h2 className="cs-title" style={{ color: '#053B76', fontWeight: 700, margin: 0, flex: 1 }}>
            Correction sheet{' '}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6B8DB2' }}>
              {totalCorrectionPages} page{totalCorrectionPages > 1 ? 's' : ''}
            </span>
          </h2>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <button onClick={handlePrint}
              style={{ padding: '10px 24px', border: '2px solid #0B96D9', color: '#0B96D9', fontWeight: 700, borderRadius: 14, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.9rem' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print all (3 sheets)
            </button>
            <button onClick={handleSave}
              style={{ padding: '10px 24px', background: '#0B96D9', color: '#fff', fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
              Save
            </button>
          </div>
        </div>

        {/* Screen preview — NO StudentInfo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {Array.from({ length: totalCorrectionPages }, (_, pi) => {
            const pageQs     = questions.slice(pi * questionsPerPage, (pi + 1) * questionsPerPage);
            const startIndex = pi * questionsPerPage;
            const maxChoices = questions.length > 0 ? Math.max(...questions.map(q => q.choices.length)) : 4;
            const colLabels  = Array.from({ length: maxChoices }, (_, i) => getLabel(i));
            return (
              <div key={pi} style={{ background: '#fff', borderRadius: 24, border: '2px solid #ceedf8', padding: 32, boxShadow: '0 2px 8px rgba(5,59,118,0.06)' }}>
                <div style={{ border: '1px solid #ceedf8', borderRadius: 14, padding: 14, marginBottom: 14, color: '#053B76', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 32px' }}>
                  <div><span style={{ fontWeight: 700 }}>Exam subject: </span>{form.title}</div>
                  <div><span style={{ fontWeight: 700 }}>University: </span>{form.university}</div>
                  <div><span style={{ fontWeight: 700 }}>Module: {form.module} | Duration: {form.duration}</span></div>
                  <div><span style={{ fontWeight: 700 }}>Page: </span>{pi + 1} / {totalCorrectionPages}</div>
                </div>
                <p style={{ color: '#053B76', fontSize: '0.78rem', marginBottom: 16, fontWeight: 600 }}>
                  Correction Key — For teacher use only. The highlighted box indicates the correct answer.
                </p>
                {questions.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6B8DB2', padding: '32px 0' }}>No questions added yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#053B76', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: '#0B96D9', color: '#fff' }}>
                          <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 700 }}>Questions</th>
                          {colLabels.map(l => <th key={l} style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{l}</th>)}
                          <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 700 }}>Answer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageQs.map((q, i) => {
                          const gi = startIndex + i;
                          return (
                            <tr key={q.id} style={{ background: i % 2 === 0 ? '#fff' : '#f4faff' }}>
                              <td style={{ padding: '8px 16px', fontWeight: 700 }}>Q{gi + 1}</td>
                              {colLabels.map((l, li) => (
                                <td key={l} style={{ padding: '6px 8px', textAlign: 'center' }}>
                                  {li < q.choices.length
                                    ? <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto', background: isCorrect(q, li) ? '#0FE2A6' : 'transparent', border: isCorrect(q, li) ? '2px solid #0FE2A6' : '2px solid #ceedf8' }} />
                                    : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0f0f0', margin: '0 auto' }} />
                                  }
                                </td>
                              ))}
                              <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 700 }}>
                                {correctLabels(q)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Print area ── */}
      <div id="cs-print-root" className="print-only">
        <QuestionSheetContent   questions={questions} form={form} questionsPerPage={questionsPerPage} />
        <GridSheetContent       questions={questions} form={form} questionsPerPage={questionsPerPage} checkboxType={checkboxType} gridLayout={gridLayout} />
        <CorrectionSheetContent questions={questions} form={form} questionsPerPage={questionsPerPage} />
      </div>

      {showDownload && (
        <DownloadModal onClose={() => setShowDownload(false)} form={form} questions={questions} checkboxType={checkboxType} gridLayout={gridLayout} />
      )}

      {toast && <div className="cs-toast">{toastMsg}</div>}
    </>
  );
}