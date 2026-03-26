import React from 'react';
import { useExamConfig } from '../context/Examconfigcontext';
import { useQuestions } from '../context/QuestionsContext';

const responsiveStyles = `
  .ec-grid-2 { grid-template-columns: 1fr 1fr; }
  .ec-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
  .ec-checkbox-row { flex-wrap: nowrap; }

  @media (max-width: 1024px) and (min-width: 768px) {
    .ec-grid-3 { grid-template-columns: 1fr 1fr !important; }
    .ec-checkbox-row { flex-wrap: wrap !important; }
    .ec-card { padding: 32px 32px !important; }
  }

  @media (max-width: 767px) {
    .ec-grid-2 { grid-template-columns: 1fr !important; }
    .ec-grid-3 { grid-template-columns: 1fr !important; }
    .ec-checkbox-row { flex-wrap: wrap !important; gap: 10px !important; }
    .ec-card { padding: 20px 16px !important; border-radius: 20px !important; }
    .ec-section { padding: 16px !important; border-radius: 16px !important; }
    .ec-title { font-size: 1.1rem !important; }
  }
`;

const labelClass = "block text-[#053B76] font-bold mb-2 ml-1 text-[0.9rem]";
const inputClass = "w-full h-[46px] rounded-lg border-[1.5px] border-[#0B96D9] px-4 font-semibold text-[#6B8DB2] outline-none focus:border-[#053B76] focus:ring-2 focus:ring-[#ceedf8]";

export default function ExamConfig() {
  const { form, setForm, checkboxType, handleCheckboxType, gridLayout, setGridLayout } = useExamConfig();
  const { questions, changeQuestion } = useQuestions();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleChoicesChange = (e) => {
    const raw = e.target.value;
    setForm(f => ({ ...f, choices: raw }));
    const newCount = parseInt(raw);
    if (!newCount || newCount < 1) return;
    questions.forEach(q => {
      const current = q.choices.length;
      if (current < newCount) {
        changeQuestion(q.id, 'choices', [...q.choices, ...Array.from({ length: newCount - current }, () => ({ text: '' }))]);
      } else if (current > newCount) {
        changeQuestion(q.id, 'choices', q.choices.slice(0, newCount));
        if (q.correct !== null && q.correct >= newCount) changeQuestion(q.id, 'correct', null);
      }
    });
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <div className="ec-card" style={{
        background: '#fff', borderRadius: 32, border: '4px solid #ceedf8',
        width: '100%', padding: '40px 40px', display: 'flex', flexDirection: 'column',
        gap: 32, boxShadow: '0 2px 16px rgba(5,59,118,0.07)',
      }}>

        {/* EXAM INFORMATION */}
        <div>
          <h3 className="ec-title" style={{ color: '#053B76', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>Exam information</h3>
          <div className="ec-section ec-grid-2" style={{ border: '2px solid #ceedf8', borderRadius: 24, padding: 24, display: 'grid', gap: '20px 48px' }}>
            <div><label className={labelClass}>Exam Title</label><input name="title" value={form.title} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Module/Subject</label><input name="module" value={form.module} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>University</label><input name="university" value={form.university} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Department / level</label><input name="department" value={form.department} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Date</label><input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Duration</label><input name="duration" value={form.duration} onChange={handleChange} className={inputClass} /></div>
          </div>
        </div>

        {/* GRID CONFIGURATION */}
        <div>
          <h3 className="ec-title" style={{ color: '#053B76', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>Grid configuration</h3>
          <div className="ec-section" style={{ border: '2px solid #ceedf8', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>

            <div className="ec-grid-3" style={{ display: 'grid', gap: '20px 32px' }}>
              <div><label className={labelClass}>Number of Questions</label><input name="numQuestions" value={form.numQuestions} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Choices per Question</label><input name="choices" value={form.choices} onChange={handleChoicesChange} className={inputClass} /></div>
              <div><label className={labelClass}>Questions per Page (max 20)</label><input name="questionsPerPage" value={form.questionsPerPage} onChange={handleChange} className={inputClass} /></div>
            </div>

            <div>
              <label className={labelClass}>Checkbox Type</label>
              <div className="ec-checkbox-row" style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                {['Fill', 'Bubbel', 'Cross', 'Tick'].map(type => (
                  <button key={type} onClick={() => handleCheckboxType(type)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
                    borderRadius: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    background: checkboxType === type ? '#053B76' : 'transparent',
                    color: checkboxType === type ? '#fff' : '#0B96D9',
                    border: checkboxType === type ? '1.5px solid #053B76' : '1.5px solid #ceedf8',
                  }}>
                    {type === 'Fill'   && <span style={{ display: 'inline-block', width: 14, height: 14, background: 'currentColor', borderRadius: 3 }} />}
                    {type === 'Bubbel' && <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid currentColor', borderRadius: '50%' }} />}
                    {type === 'Cross'  && <span style={{ fontWeight: 900 }}>✗</span>}
                    {type === 'Tick'   && <span style={{ fontWeight: 900 }}>✓</span>}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Grid Layout</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                {['Linear', 'Double Column'].map(layout => (
                  <button key={layout} onClick={() => setGridLayout(layout)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
                    borderRadius: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    background: gridLayout === layout ? '#053B76' : 'transparent',
                    color: gridLayout === layout ? '#fff' : '#0B96D9',
                    border: gridLayout === layout ? '1.5px solid #053B76' : '1.5px solid #ceedf8',
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{layout === 'Linear' ? '☰' : '☷'}</span>
                    {layout}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div>
          <h3 className="ec-title" style={{ color: '#053B76', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>Candidate Instructions</h3>
          <div className="ec-section" style={{ border: '2px solid #ceedf8', borderRadius: 24, padding: 24, minHeight: 100, display: 'flex', alignItems: 'center' }}>
            <textarea name="instructions" value={form.instructions} onChange={handleChange} rows={2}
              style={{ width: '100%', resize: 'none', fontWeight: 600, color: '#053B76', fontSize: '1rem', outline: 'none', background: 'transparent', border: 'none' }} />
          </div>
        </div>
      </div>
    </>
  );
}