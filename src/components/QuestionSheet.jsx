import React from 'react';
import { useQuestions } from '../context/QuestionsContext';

const MOCK_EXAM = {
  title: "POO Second Exam",
  university: "ESI",
  module: "POO",
  duration: "2h:30min",
  page: "1",
};

function ExamHeader({ exam }) {
  return (
    <div className="border border-[#ceedf8] rounded-xl p-4 mb-4 text-[#053B76] text-sm grid grid-cols-2 gap-x-8 gap-y-1">
      <div><span className="font-bold">Exam subject: </span>{exam.title}</div>
      <div><span className="font-bold">University: </span>{exam.university}</div>
      <div><span className="font-bold">Module: {exam.module} | Duration: {exam.duration}</span></div>
      <div><span className="font-bold">Page: </span>{exam.page}</div>
    </div>
  );
}

function StudentInfo() {
  return (
    <div className="border border-[#ceedf8] rounded-xl p-4 mb-6 text-[#053B76] text-sm grid grid-cols-4 gap-6">
      {["First and last name", "N student", "Group", "Mark /20"].map(label => (
        <div key={label}>
          <div className="font-bold mb-2">{label}</div>
          <div className="border-b-2 border-[#0B96D9] h-8" />
        </div>
      ))}
    </div>
  );
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionSheet() {
  const { questions } = useQuestions();
  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#053B76]">Question sheet</h2>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="px-6 py-2.5 border-2 border-[#0B96D9] text-[#0B96D9] font-bold rounded-xl hover:bg-[#f0faff] transition-colors cursor-pointer bg-white">Print</button>
          <button className="px-6 py-2.5 bg-[#0B96D9] text-white font-bold rounded-xl hover:bg-[#0a7dbf] transition-colors cursor-pointer border-none">Save</button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border-2 border-[#ceedf8] p-8 flex-1 shadow-sm">
        <ExamHeader exam={MOCK_EXAM} />
        <StudentInfo />

        {questions.length === 0 ? (
          <p className="text-center text-[#6B8DB2] py-8">No questions added yet. Go to "Add questions" to create them.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {questions.map((q, index) => (
              <div key={q.id} className="text-[#053B76] text-sm">
                <p className="font-bold mb-2">Q{index + 1}. {q.text || `Question ${index + 1}`}</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 ml-4">
                  {q.choices.map((c, ci) => (
                    <p key={ci}>{CHOICE_LABELS[ci] ?? ci + 1}. {c.text || `Choice ${CHOICE_LABELS[ci] ?? ci + 1}`}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
