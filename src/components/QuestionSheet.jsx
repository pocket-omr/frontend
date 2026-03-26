import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { useExamConfig } from '../context/Examconfigcontext';
import { useSavePDF } from '../hooks/useSavePDF';

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const responsiveStyles = `
  .qs-title { font-size: 1.8rem; }
  .qs-choices-grid { grid-template-columns: 1fr 1fr; gap: 4px 48px; }
  .qs-page-card { padding: 32px; }
  .qs-header-grid { grid-template-columns: 1fr 1fr; }
  .qs-student-grid { grid-template-columns: repeat(4, 1fr); }

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
  }

  @media print {
    body * { visibility: hidden; }
    #print-area-qs, #print-area-qs * { visibility: visible; }
    #print-area-qs { position: fixed; top: 0; left: 0; width: 100%; padding: 24px; box-sizing: border-box; }
    .page-break { page-break-after: always; }
  }
`;

function ExamHeader({ exam }) {
  return (
    <div className="qs-header-grid" style={{ border: '2px solid #ceedf8', borderRadius: 14, padding: 16, marginBottom: 16, color: '#053B76', fontSize: '0.9rem', display: 'grid', gap: '6px 32px' }}>
      <div><span style={{ fontWeight: 700 }}>Exam subject: </span>{exam.title}</div>
      <div><span style={{ fontWeight: 700 }}>University: </span>{exam.university}</div>
      <div><span style={{ fontWeight: 700 }}>Module: </span>{exam.module}<span style={{ fontWeight: 700, marginLeft: 16 }}>Duration: </span>{exam.duration}</div>
      <div><span style={{ fontWeight: 700 }}>Page: </span>{exam.page}</div>
    </div>
  );
}

function StudentInfo() {
  return (
    <div className="qs-student-grid" style={{ border: '2px solid #ceedf8', borderRadius: 14, padding: 16, marginBottom: 24, color: '#053B76', fontSize: '0.85rem', display: 'grid', gap: 16 }}>
      {['First and last name', 'N student', 'Group', 'Mark /20'].map(label => (
        <div key={label}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{label}</div>
          <div style={{ borderBottom: '2px solid #0B96D9', height: 32 }} />
        </div>
      ))}
    </div>
  );
}

export default function QuestionSheet() {
  const { questions } = useQuestions();
  const { form } = useExamConfig();
  const handleSave = useSavePDF('print-area-qs', `${form.title || 'exam'}-question-sheet`);

  const questionsPerPage = parseInt(form.questionsPerPage) || 20;
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) => questions.slice(i * questionsPerPage, (i + 1) * questionsPerPage));

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        <div className="qs-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <h2 className="qs-title" style={{ color: '#053B76', fontWeight: 700, margin: 0 }}>
            Question sheet <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6B8DB2' }}>{totalPages} page{totalPages > 1 ? 's' : ''}</span>
          </h2>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <button className="qs-btn" onClick={() => window.print()} style={{ padding: '10px 24px', border: '2px solid #0B96D9', color: '#0B96D9', fontWeight: 700, borderRadius: 14, background: '#fff', cursor: 'pointer' }}>Print</button>
            <button className="qs-btn" onClick={handleSave} style={{ padding: '10px 24px', background: '#0B96D9', color: '#fff', fontWeight: 700, borderRadius: 14, border: 'none', cursor: 'pointer' }}>Save</button>
          </div>
        </div>

        <div id="print-area-qs" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {pages.map((pageQs, pi) => (
            <div key={pi} className={`qs-page-card ${pi < pages.length - 1 ? 'page-break' : ''}`}
              style={{ background: '#fff', borderRadius: 24, border: '2px solid #ceedf8', padding: 32, boxShadow: '0 2px 8px rgba(5,59,118,0.06)' }}>
              <ExamHeader exam={{ title: form.title, university: form.university, module: form.module, duration: form.duration, page: `${pi + 1} / ${totalPages}` }} />
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