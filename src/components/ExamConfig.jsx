import React, { useState } from 'react';

export default function ExamConfig() {
  const [form, setForm] = useState({
    title: "Second exam of POO",
    module: "POO",
    university: "ESI",
    department: "2CP",
    date: "2025-05-25",
    duration: "2h:30min",
    numQuestions: "20",
    choices: "4",
    questionsPerPage: "20",
    instructions: '"Do not make any stray marks on this sheet."'
  });

  const [checkboxType, setCheckboxType] = useState('Fill');
  const [gridLayout, setGridLayout] = useState('Linear');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const Label = ({ children }) => <label className="block text-[#053B76] font-bold mb-2 ml-1 text-[0.9rem]">{children}</label>;
  const Input = (props) => (
    <input {...props} className="w-full h-[46px] rounded-lg border-[1.5px] border-[#0B96D9] px-4 font-semibold text-[#6B8DB2] outline-none focus:border-[#053B76] focus:ring-2 focus:ring-[#ceedf8]" />
  );

  return (
    <div className="bg-white rounded-[32px] shadow-sm border-4 border-[#ceedf8] w-full max-w-[1100px] p-10 flex flex-col gap-8 mx-auto self-start">
      
      {/* EXAM INFORMATION */}
      <div>
        <h3 className="text-[#053B76] font-bold text-xl mb-4">Exam information</h3>
        <div className="border-2 border-[#ceedf8] rounded-[24px] p-6 grid grid-cols-2 gap-x-12 gap-y-6">
          <div><Label>Exam Title</Label><Input name="title" value={form.title} onChange={handleChange} /></div>
          <div><Label>Module/Subject</Label><Input name="module" value={form.module} onChange={handleChange} /></div>
          <div><Label>University</Label><Input name="university" value={form.university} onChange={handleChange} /></div>
          <div><Label>Department / level</Label><Input name="department" value={form.department} onChange={handleChange} /></div>
          <div><Label>Date</Label><Input type="date" name="date" value={form.date} onChange={handleChange} /></div>
          <div><Label>Duration (in hour)</Label><Input name="duration" value={form.duration} onChange={handleChange} /></div>
        </div>
      </div>

      {/* GRID CONFIGURATION */}
      <div>
        <h3 className="text-[#053B76] font-bold text-xl mb-4">Grid configuration</h3>
        <div className="border-2 border-[#ceedf8] rounded-[24px] p-6 flex flex-col gap-8">
          
          <div className="grid grid-cols-3 gap-8">
            <div><Label>Number of Questions</Label><Input name="numQuestions" value={form.numQuestions} onChange={handleChange} /></div>
            <div><Label>Choices per Question</Label><Input name="choices" value={form.choices} onChange={handleChange} /></div>
            <div><Label>Questions per Page (max 20)</Label><Input name="questionsPerPage" value={form.questionsPerPage} onChange={handleChange} /></div>
          </div>

          <div>
            <Label>Checkbox Type</Label>
            <div className="flex gap-4 mt-3">
              {['Fill', 'Bubbel', 'Cross', 'Tick'].map(type => (
                <button
                  key={type}
                  onClick={() => setCheckboxType(type)}
                  className={`px-8 py-2 rounded-lg font-bold transition-all cursor-pointer ${checkboxType === type ? 'bg-[#053B76] text-white shadow-md' : 'bg-transparent text-[#0B96D9] border-[1.5px] border-[#ceedf8] hover:bg-[#f4faff]'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Grid Layout</Label>
            <div className="flex gap-4 mt-3">
              {['Linear', 'Double Column'].map(layout => (
                <button
                  key={layout}
                  onClick={() => setGridLayout(layout)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all cursor-pointer ${gridLayout === layout ? 'bg-[#053B76] text-white shadow-md' : 'bg-transparent text-[#0B96D9] border-[1.5px] border-[#ceedf8] hover:bg-[#f4faff]'}`}
                >
                  {layout === 'Linear' ? <span className="text-xl leading-none">☰</span> : <span className="text-xl leading-none">☷</span>}
                  {layout}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CANDIDATE INSTRUCTIONS */}
      <div>
        <h3 className="text-[#053B76] font-bold text-xl mb-4">Candidate Instructions</h3>
        <div className="border-2 border-[#ceedf8] rounded-[24px] p-6 bg-white min-h-[100px] flex items-center">
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows={1}
            className="w-full resize-none font-semibold text-[#053B76] text-lg outline-none bg-transparent"
          />
        </div>
      </div>

    </div>
  );
}
