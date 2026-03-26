import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useSavePDF } from '../hooks/useSavePDF';

function getLabel(i) { return String.fromCharCode(65 + i); }

const responsiveStyles = `
  .cs-title { font-size: 1.8rem; }
  .cs-page-card { padding: 32px; }
  .cs-header-grid { grid-template-columns: 1fr 1fr; }
  .cs-student-grid { grid-template-columns: repeat(4, 1fr); }

  @media (max-width: 1024px) and (min-width: 768px) {
    .cs-page-card { padding: 20px !important; }
  }

  @media (max-width: 767px) {
    .cs-title { font-size: 1.3rem !important; }
    .cs-toolbar { flex-wrap: wrap; gap: 10px !important; }
    .cs-page-card { padding: 14px !important; border-radius: 16px !important; }
    .cs-header-grid { grid-template-columns: 1fr !important; gap: 4px !important; }
    .cs-student-grid { grid-template-columns: 1fr 1fr !important; }
    .cs-btn { padding: 8px 16px !important; font-size: 0.85rem !important; }
    .cs-cell { width: 24px !important; height: 24px !important; }
    th, td { padding: 6px 6px !important; font-size: 0.78rem !important; }
  }

  @media print {
    body * { visibility: hidden; }
    #print-area-cs, #print-area-cs * { visibility: visible; }
    #print-area-cs { position: fixed; top: 0; left: 0; width: 100%; padding: 24px; box-sizing: border-box; }
    .page-break { page-break-after: always; }
  }
`;

function ExamHeader({ exam }) {
  return (
    <div className="cs-header-grid" style={{ border: '1px solid #ceedf8', borderRadius: 14, padding: 14, marginBottom: 14, color: '#053B76', fontSize: '0.85rem', display: 'grid', gap: '5px 32px' }}>
      <div><span style={{ fontWeight: 700 }}>Exam subject: </span>{exam.title}</div>
      <div><span style={{ fontWeight: 700 }}>University: </span>{exam.university}</div>
      <div><span style={{ fontWeight: 700 }}>Module: {exam.module} | Duration: {exam.duration}</span></div>
      <div><span style={{ fontWeight: 700 }}>Page: </span>{exam.page}</div>
    </div>
  );
}

function StudentInfo() {
  return (
    <div className="cs-student-grid" style={{ border: '1px solid #ceedf8', borderRadius: 14, padding: 14, marginBottom: 20, color: '#053B76', fontSize: '0.82rem', display: 'grid', gap: 16 }}>
      {['First and last name', 'N student', 'Group', 'Mark /20'].map(label => (
        <div key={label}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{label}</div>
          <div style={{ borderBottom: '2px solid #0B96D9', height: 28 }} />
        </div>
      ))}
    </div>
  );
}

export default function CorrectionSheet() {
  const { questions } = useQuestions();
  const { form } = useExamConfig();
  const handleSave = useSavePDF('print-area-cs', `${form.title || 'exam'}-correction-sheet`);

  const questionsPerPage = parseInt(form.questionsPerPage) || 20;
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) => questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage));

  const maxChoices = questions.length > 0 ? Math.max(...questions.map(q => q.choices.length)) : 4;
  const colLabels  = Array.from({ length: maxChoices }, (_, i) => getLabel(i));

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        <div className="cs-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <h2 className="cs-title" style={{ color: '#053B76', fontWeight: 700, margin: 0 }}>
            Correction sheet <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6B8DB2' }}>{totalPages} page{totalPages > 1 ? 's' : ''}</span>
          </h2>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <button className="cs-btn" onClick={() => window.print()} style={{ padding: '10px 24px', border: '2px solid #0B96D9', color: '#0B96D9', fontWeight: 700, borderRadius: 14, background: '#fff', cursor: 'pointer' }}>Print</button>
            <button className="cs-btn" onClick={handleSave} style={{ padding: '10px 24px', background: '#0B96D9', color: '#fff', fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer' }}>Save</button>
          </div>
        </div>

        <div id="print-area-cs" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {pages.map((pageQs, pi) => {
            const startIndex = pi * questionsPerPage;
            return (
              <div key={pi} className={`cs-page-card ${pi < pages.length - 1 ? 'page-break' : ''}`}
                style={{ background: '#fff', borderRadius: 24, border: '2px solid #ceedf8', padding: 32, boxShadow: '0 2px 8px rgba(5,59,118,0.06)' }}>
                <ExamHeader exam={{ title: form.title, university: form.university, module: form.module, duration: form.duration, page: `${pi + 1} / ${totalPages}` }} />
                <StudentInfo />

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
                                  {li < q.choices.length ? (
                                    <div className="cs-cell" style={{
                                      width: 28, height: 28, borderRadius: 6, margin: '0 auto',
                                      background: q.correct === li ? '#0FE2A6' : 'transparent',
                                      border: q.correct === li ? '2px solid #0FE2A6' : '2px solid #ceedf8',
                                    }} />
                                  ) : (
                                    <div className="cs-cell" style={{ width: 28, height: 28, borderRadius: 6, background: '#f0f0f0', margin: '0 auto' }} />
                                  )}
                                </td>
                              ))}
                              <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 700 }}>
                                {q.correct !== null && q.correct < q.choices.length ? getLabel(q.correct) : '—'}
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
    </>
  );
}