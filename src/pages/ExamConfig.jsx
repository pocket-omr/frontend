import React from 'react';
import { useExamConfig } from '../context/Examconfigcontext';
import { useQuestions } from '../context/QuestionsContext';
import { useExamList } from '../context/ExamListContext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PenLine, Eye, LayoutGrid, CheckSquare, ArrowLeft, Pencil, Download, UserPlus, X, Users, Upload } from 'lucide-react';

const responsiveStyles = `
  .ec-grid-2 { grid-template-columns: 1fr 1fr; }
  .ec-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
  .ec-checkbox-row { flex-wrap: nowrap; }

  .ec-steps { display: flex; align-items: flex-start; gap: 0; margin-bottom: 28px; width: 100%; overflow: hidden; min-width: 0; }
  .ec-step-item { display: flex; align-items: center; flex: 1; min-width: 0; }
  .ec-step-item:last-child { flex: 0 0 auto; }
  .ec-step-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; background: none; border: none; padding: 0; flex-shrink: 0; }
  .ec-step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; transition: all 0.2s; border: 2.5px solid #ceedf8; background: #fff; color: #6B8DB2; flex-shrink: 0; }
  .ec-step-circle.active { background: #0B96D9; border-color: #0B96D9; color: #fff; box-shadow: 0 4px 12px rgba(11,150,217,0.28); }
  .ec-step-circle.done { background: #f4faff; border-color: #0B96D9; color: #0B96D9; }
  .ec-step-label { font-size: 0.72rem; font-weight: 600; color: #6B8DB2; white-space: nowrap; }
  .ec-step-label.active { color: #0B96D9; }
  .ec-step-label.done { color: #0B96D9; }
  .ec-step-line { flex: 1; height: 2.5px; background: #ceedf8; margin: 0 6px; margin-bottom: 22px; border-radius: 2px; transition: background 0.3s; min-width: 0; }
  .ec-step-line.done { background: #0B96D9; }

  /* Back button */
  .ec-back-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: #fff; border: 2px solid #ceedf8;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #0B96D9; transition: all 0.2s; flex-shrink: 0;
  }
  .ec-back-btn:hover { background: #0B96D9; color: #fff; border-color: #0B96D9; box-shadow: 0 4px 12px rgba(11,150,217,0.25); }

  /* Edit banner — app style */
  .ec-edit-banner {
    display: flex; align-items: center; gap: 12px;
    background: #e8f6ff; border: 2px solid #0B96D9;
    border-radius: 16px; padding: 12px 18px; margin-bottom: 20px;
  }
  .ec-edit-banner-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: #0B96D9; color: #fff;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ec-edit-banner-title { color: #053B76; font-weight: 700; font-size: 0.88rem; margin: 0 0 2px; }
  .ec-edit-banner-sub { color: #6B8DB2; font-weight: 600; font-size: 0.78rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .ec-step-circle.download { background: linear-gradient(135deg, #0B96D9, #053B76) !important; border-color: #0B96D9 !important; color: #fff !important; box-shadow: 0 4px 14px rgba(11,150,217,0.35) !important; }
  .ec-step-label.download { color: #0B96D9 !important; font-weight: 700 !important; }

  /* Input fix */
  .ec-input {
    width: 100%; height: 46px; border-radius: 10px;
    border: 1.5px solid #0B96D9; padding: 0 16px;
    font-weight: 600; font-size: 0.9rem; color: #053B76;
    background: #fff; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box; font-family: inherit;
  }
  .ec-input::placeholder { color: #b0c8e0; font-weight: 500; }
  .ec-input:focus { border-color: #053B76; box-shadow: 0 0 0 3px #ceedf8; }

  .ec-textarea {
    width: 100%; resize: none; font-weight: 600; color: #053B76;
    font-size: 1rem; outline: none; background: transparent;
    border: none; font-family: inherit;
  }
  .ec-textarea::placeholder { color: #b0c8e0; font-weight: 500; }

  @media (max-width: 1024px) and (min-width: 768px) {
    .ec-grid-3 { grid-template-columns: 1fr 1fr !important; }
    .ec-checkbox-row { flex-wrap: wrap !important; }
    .ec-card { padding: 32px !important; }
  }
  @media (max-width: 767px) {
    .ec-grid-2 { grid-template-columns: 1fr !important; }
    .ec-grid-3 { grid-template-columns: 1fr !important; }
    .ec-checkbox-row { flex-wrap: wrap !important; gap: 10px !important; }
    .ec-card { padding: 20px 16px !important; border-radius: 20px !important; }
    .ec-section { padding: 16px !important; border-radius: 16px !important; }
    .ec-title { font-size: 1.1rem !important; }
    .ec-step-label { font-size: 0.62rem !important; }
    .ec-step-circle { width: 34px !important; height: 34px !important; }
    .ec-edit-banner { flex-wrap: wrap; }
  }
  @media (max-width: 480px) {
    .ec-step-label { display: none !important; }
    .ec-step-circle { width: 30px !important; height: 30px !important; font-size: 0.75rem !important; }
  }
`;

const labelStyle = {
  display: 'block', color: '#053B76', fontWeight: 700,
  marginBottom: 8, marginLeft: 4, fontSize: '0.9rem',
};

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
    <div className="ec-steps">
      {steps.map((step, i) => {
        const isDone   = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.label} className="ec-step-item">
            <button className="ec-step-btn" onClick={() => navigate(step.path)}>
              <div className={`ec-step-circle${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDone && !step.isDownload ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : step.icon}
              </div>
              <span className={`ec-step-label${isActive ? ' active' : isDone ? ' done' : ''}${step.isDownload ? ' download' : ''}`}>{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`ec-step-line${isDone ? ' done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ExamConfig() {
  const { form, setForm, checkboxType, handleCheckboxType, gridLayout, setGridLayout, students, setStudents, resetForm } = useExamConfig();
  const { questions, changeQuestion, resetQuestions } = useQuestions();
  const { editingExam, cancelEdit } = useExamList();
  const navigate = useNavigate();
  const emptyStudent = { firstName: '', lastName: '', group: '', registrationNumber: '' };
  const [newStudent, setNewStudent] = React.useState(emptyStudent);
  const [fileLoading, setFileLoading] = React.useState(false);
  const fileInputRef = React.useRef(null);

  // Normalize a student entry to the structured shape. Tolerates legacy exams
  // where students were stored as plain "First Last" name strings.
  const normalizeStudent = (s) => {
    if (typeof s === 'string') {
      const [firstName = '', ...rest] = s.trim().split(/\s+/);
      return { firstName, lastName: rest.join(' '), group: '', registrationNumber: '' };
    }
    return { firstName: '', lastName: '', group: '', registrationNumber: '', ...s };
  };

  const addStudent = () => {
    const s = {
      firstName: newStudent.firstName.trim(),
      lastName: newStudent.lastName.trim(),
      group: newStudent.group.trim(),
      registrationNumber: newStudent.registrationNumber.trim(),
    };
    if (!s.firstName && !s.lastName) return; // require at least a name
    setStudents(prev => [...prev, s]);
    setNewStudent(emptyStudent);
  };

  const isEditing = Boolean(editingExam);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      alert('Unsupported file type. Please upload .xlsx, .xls, or .csv');
      return;
    }
    setFileLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/api/v1/students/parse-file', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to parse file');
      }
      const data = await res.json();
      const imported = data.students.map(s => ({
        firstName: s.first_name || '',
        lastName: s.last_name || '',
        group: s.group || '',
        registrationNumber: s.registration_number || '',
      }));
      setStudents(prev => [...prev, ...imported]);
    } catch (err) {
      alert(err.message || 'Failed to upload file');
    } finally {
      setFileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
        // Drop any correct answers that point at removed choices.
        const correct = (Array.isArray(q.correct) ? q.correct : q.correct == null ? [] : [q.correct])
          .filter(i => i < newCount);
        changeQuestion(q.id, 'correct', correct);
      }
    });
  };

  // Cancel edit: discard changes, reset state, go back to list
  function handleCancelEdit() {
    cancelEdit();
    resetForm();
    resetQuestions();
    navigate('/dashboard/exam-list');
  }

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        <StepsNav currentIndex={0} navigate={navigate} />

        {/* EDIT MODE: back row + banner */}
        {isEditing && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button className="ec-back-btn" onClick={handleCancelEdit} title="Cancel and go back to Exam List">
                <ArrowLeft size={18} />
              </button>
              <span style={{ color: '#6B8DB2', fontWeight: 600, fontSize: '0.85rem' }}>
                Cancel and go back to Exam List
              </span>
            </div>

            <div className="ec-edit-banner">
              <div className="ec-edit-banner-icon">
                <Pencil size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="ec-edit-banner-title">
                  Editing: <span style={{ color: '#0B96D9' }}>{editingExam.form?.title || 'Untitled exam'}</span>
                </p>
                <p className="ec-edit-banner-sub">
                  Your changes will be saved when you click Save on the Correction sheet.
                </p>
              </div>
            </div>
          </>
        )}

        {/* FORM CARD */}
        <div className="ec-card" style={{
          background: '#fff', borderRadius: 32, border: '4px solid #ceedf8',
          width: '100%', padding: '40px', display: 'flex', flexDirection: 'column',
          gap: 32, boxShadow: '0 2px 16px rgba(5,59,118,0.07)',
        }}>

          <div>
            <h3 className="ec-title" style={{ color: '#053B76', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>Exam information</h3>
            <div className="ec-section ec-grid-2" style={{ border: '2px solid #ceedf8', borderRadius: 24, padding: 24, display: 'grid', gap: '20px 48px' }}>
              <div><label style={labelStyle}>Exam Title</label><input name="title" value={form.title} onChange={handleChange} className="ec-input" placeholder="e.g. Final Exam 2025" /></div>
              <div><label style={labelStyle}>Module/Subject</label><input name="module" value={form.module} onChange={handleChange} className="ec-input" placeholder="e.g. Mathematics" /></div>
              <div><label style={labelStyle}>University</label><input name="university" value={form.university} onChange={handleChange} className="ec-input" placeholder="e.g. University of Tlemcen" /></div>
              <div><label style={labelStyle}>Department / Level</label><input name="department" value={form.department} onChange={handleChange} className="ec-input" placeholder="e.g. L2 Computer Science" /></div>
              <div><label style={labelStyle}>Date</label><input type="date" name="date" value={form.date} onChange={handleChange} className="ec-input" /></div>
              <div><label style={labelStyle}>Duration</label><input name="duration" value={form.duration} onChange={handleChange} className="ec-input" placeholder="e.g. 1h30" /></div>
            </div>
          </div>

          <div>
            <h3 className="ec-title" style={{ color: '#053B76', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>Grid configuration</h3>
            <div className="ec-section" style={{ border: '2px solid #ceedf8', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="ec-grid-3" style={{ display: 'grid', gap: '20px 32px' }}>
                <div><label style={labelStyle}>Number of Questions</label><input name="numQuestions" value={form.numQuestions} onChange={handleChange} className="ec-input" placeholder="e.g. 20" /></div>
                <div><label style={labelStyle}>Choices per Question</label><input name="choices" value={form.choices} onChange={handleChoicesChange} className="ec-input" placeholder="e.g. 4" /></div>
                <div><label style={labelStyle}>Questions per Page (max 20)</label><input name="questionsPerPage" value={form.questionsPerPage} onChange={handleChange} className="ec-input" placeholder="e.g. 20" /></div>
              </div>
              <div>
                <label style={labelStyle}>Checkbox Type</label>
                <div className="ec-checkbox-row" style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  {['Fill', 'Bubbel'].map(type => (
                    <button key={type} onClick={() => handleCheckboxType(type)} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
                      borderRadius: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                      background: checkboxType === type ? '#053B76' : 'transparent',
                      color: checkboxType === type ? '#fff' : '#0B96D9',
                      border: checkboxType === type ? '1.5px solid #053B76' : '1.5px solid #ceedf8',
                    }}>
                      {type === 'Fill'   && <span style={{ display: 'inline-block', width: 14, height: 14, background: 'currentColor', borderRadius: 3 }} />}
                      {type === 'Bubbel' && <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid currentColor', borderRadius: '50%' }} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Grid Layout</label>
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

          <div>
            <h3 className="ec-title" style={{ color: '#053B76', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>Candidate Instructions</h3>
            <div className="ec-section" style={{ border: '2px solid #ceedf8', borderRadius: 24, padding: 24, minHeight: 100, display: 'flex', alignItems: 'center' }}>
              <textarea name="instructions" value={form.instructions} onChange={handleChange} rows={2} placeholder="Enter any instructions for candidates..." className="ec-textarea" />
            </div>
          </div>

          <div>
            <h3 className="ec-title" style={{ color: '#053B76', fontWeight: 700, fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={20} /> Student List
              {students.length > 0 && (
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6B8DB2' }}>
                  ({students.length} student{students.length !== 1 ? 's' : ''})
                </span>
              )}
            </h3>
            <div className="ec-section" style={{ border: '2px solid #ceedf8', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))', gap: 10, flex: 1, minWidth: 280 }}>
                  <input
                    value={newStudent.firstName}
                    onChange={e => setNewStudent(s => ({ ...s, firstName: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStudent(); } }}
                    className="ec-input"
                    placeholder="First name"
                  />
                  <input
                    value={newStudent.lastName}
                    onChange={e => setNewStudent(s => ({ ...s, lastName: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStudent(); } }}
                    className="ec-input"
                    placeholder="Last name"
                  />
                  <input
                    value={newStudent.group}
                    onChange={e => setNewStudent(s => ({ ...s, group: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStudent(); } }}
                    className="ec-input"
                    placeholder="Group (optional)"
                  />
                  <input
                    value={newStudent.registrationNumber}
                    onChange={e => setNewStudent(s => ({ ...s, registrationNumber: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStudent(); } }}
                    className="ec-input"
                    placeholder="Registration № (optional)"
                  />
                </div>
                <button
                  onClick={addStudent}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 46,
                    borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer',
                    background: '#0B96D9', color: '#fff', fontSize: '0.88rem', flexShrink: 0,
                  }}
                >
                  <UserPlus size={16} /> Add
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px',
                    borderRadius: 10, border: '2px solid #0B96D9', fontWeight: 700,
                    cursor: fileLoading ? 'not-allowed' : 'pointer',
                    background: '#fff', color: '#0B96D9', fontSize: '0.88rem', flexShrink: 0,
                    height: 46, opacity: fileLoading ? 0.6 : 1,
                  }}
                >
                  <Upload size={16} /> {fileLoading ? 'Importing...' : 'Import Excel'}
                </button>
              </div>
              <p style={{ color: '#8aa6c4', fontWeight: 500, fontSize: '0.78rem', margin: '-6px 0 0' }}>
                Imported file columns: first name, last name, group, registration number.
              </p>

              {students.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {students.map((raw, idx) => {
                    const s = normalizeStudent(raw);
                    const fullName = `${s.firstName} ${s.lastName}`.trim() || '—';
                    return (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: '#f4faff', borderRadius: 12, padding: '10px 14px',
                      border: '1.5px solid #ceedf8',
                    }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8, background: '#0B96D9', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                      }}>
                        {idx + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#053B76', fontWeight: 600, fontSize: '0.9rem' }}>{fullName}</div>
                        {(s.group || s.registrationNumber) && (
                          <div style={{ color: '#6B8DB2', fontWeight: 500, fontSize: '0.78rem', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {s.group && <span>Group: {s.group}</span>}
                            {s.registrationNumber && <span>Reg №: {s.registrationNumber}</span>}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setStudents(prev => prev.filter((_, i) => i !== idx))}
                        style={{
                          width: 28, height: 28, borderRadius: 8, border: '1.5px solid #ffd0d0',
                          background: '#fff', color: '#e05252', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                        title="Remove student"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    );
                  })}
                </div>
              )}

              {students.length === 0 && (
                <p style={{ color: '#b0c8e0', fontWeight: 500, fontSize: '0.88rem', textAlign: 'center', margin: '8px 0 0' }}>
                  No students added yet. Add student names who will take this exam.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}