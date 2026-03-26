import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useSavePDF } from '../hooks/useSavePDF';

function getLabel(i) { return String.fromCharCode(65 + i); }

const responsiveStyles = `
  .gs-title { font-size: 1.8rem; }
  .gs-page-card { padding: 32px; }
  .gs-header-grid { grid-template-columns: 1fr 1fr; }
  .gs-student-grid { grid-template-columns: repeat(4, 1fr); }
  .gs-double-col { flex-direction: row; gap: 24px; }

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
  }

  @media print {
    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
    #print-area { position: fixed; top: 0; left: 0; width: 100%; padding: 24px; box-sizing: border-box; }
    .page-break { page-break-after: always; }
  }
`;

function GridCell({ checkboxType }) {
  const base = { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
  if (checkboxType === 'Bubbel') return <div className="gs-cell" style={{ ...base, width: 28, height: 28, borderRadius: '50%', border: '2px solid #ceedf8' }} />;
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

function StudentInfo() {
  return (
    <div className="gs-student-grid" style={{ border: '1px solid #ceedf8', borderRadius: 14, padding: 14, marginBottom: 20, color: '#053B76', fontSize: '0.82rem', display: 'grid', gap: 16 }}>
      {['First and last name', 'N student', 'Group', 'Mark /20'].map(label => (
        <div key={label}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{label}</div>
          <div style={{ borderBottom: '2px solid #0B96D9', height: 28 }} />
        </div>
      ))}
    </div>
  );
}

export default function GridSheet() {
  const { questions } = useQuestions();
  const { checkboxType, gridLayout, form } = useExamConfig();
  const handleSave = useSavePDF('print-area', `${form.title || 'exam'}-grid-sheet`);

  const questionsPerPage = parseInt(form.questionsPerPage) || 20;
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) => questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage));

  const maxChoices = questions.length > 0 ? Math.max(...questions.map(q => q.choices.length)) : 4;
  const colLabels  = Array.from({ length: maxChoices }, (_, i) => getLabel(i));
  const isDouble   = gridLayout === 'Double Column';

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        <div className="gs-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <h2 className="gs-title" style={{ color: '#053B76', fontWeight: 700, margin: 0 }}>
            Grid sheet <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6B8DB2' }}>{totalPages} page{totalPages > 1 ? 's' : ''}</span>
          </h2>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <button className="gs-btn" onClick={() => window.print()} style={{ padding: '10px 24px', border: '2px solid #0B96D9', color: '#0B96D9', fontWeight: 700, borderRadius: 14, background: '#fff', cursor: 'pointer' }}>Print</button>
            <button className="gs-btn" onClick={handleSave} style={{ padding: '10px 24px', background: '#0B96D9', color: '#fff', fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer' }}>Save</button>
          </div>
        </div>

        <div id="print-area" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {pages.map((pageQs, pi) => {
            const startIndex = pi * questionsPerPage;
            const half   = Math.ceil(pageQs.length / 2);
            const leftQs  = isDouble ? pageQs.slice(0, half)  : pageQs;
            const rightQs = isDouble ? pageQs.slice(half)     : [];

            return (
              <div key={pi} className={`gs-page-card ${pi < pages.length - 1 ? 'page-break' : ''}`}
                style={{ background: '#fff', borderRadius: 24, border: '2px solid #ceedf8', padding: 32, boxShadow: '0 2px 8px rgba(5,59,118,0.06)' }}>
                <ExamHeader exam={{ title: form.title, university: form.university, module: form.module, duration: form.duration, page: `${pi + 1} / ${totalPages}` }} />
                <StudentInfo />
                {form.instructions && form.instructions.trim() !== '' && (
                  <div style={{
                    border: '1.5px solid #ceedf8',
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 20,
                    background: '#f4faff',
                    color: '#053B76',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}>
                    <span style={{ fontWeight: 700, marginRight: 6 }}>Instructions:</span>
                    {form.instructions.trim()}
                  </div>
                )}

                {questions.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6B8DB2', padding: '32px 0' }}>No questions added yet.</p>
                ) : isDouble ? (
                  <div className="gs-double-col" style={{ display: 'flex' }}>
                    <div style={{ flex: 1, minWidth: 0 }}><GridTable questions={leftQs}  colLabels={colLabels} checkboxType={checkboxType} startIndex={startIndex} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}><GridTable questions={rightQs} colLabels={colLabels} checkboxType={checkboxType} startIndex={startIndex + half} /></div>
                  </div>
                ) : (
                  <GridTable questions={pageQs} colLabels={colLabels} checkboxType={checkboxType} startIndex={startIndex} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}