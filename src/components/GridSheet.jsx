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

// Generate column labels: A, B, C, D, E, F...
function getLabel(i) {
  return String.fromCharCode(65 + i);
}

export default function GridSheet() {
  const { questions } = useQuestions();
  const handlePrint = () => window.print();

  // Determine the max number of choices across all questions
  const maxChoices = questions.length > 0
    ? Math.max(...questions.map(q => q.choices.length))
    : 4;

  const colLabels = Array.from({ length: maxChoices }, (_, i) => getLabel(i));

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#053B76]">Grid sheet</h2>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="px-6 py-2.5 border-2 border-[#0B96D9] text-[#0B96D9] font-bold rounded-xl hover:bg-[#f0faff] transition-colors cursor-pointer bg-white">Print</button>
          <button className="px-6 py-2.5 bg-[#0B96D9] text-white font-bold rounded-xl hover:bg-[#0a7dbf] transition-colors cursor-pointer border-none">Save</button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border-2 border-[#ceedf8] p-8 flex-1 shadow-sm">
        <ExamHeader exam={MOCK_EXAM} />
        <StudentInfo />

        <p className="text-[#053B76] text-xs mb-4 font-semibold">
          Answer Grid: Mark the box corresponding to your answer. Do not write outside the grid. Only one answer per question.
        </p>

        {questions.length === 0 ? (
          <p className="text-center text-[#6B8DB2] py-8">No questions added yet. Go to "Add questions" to create them.</p>
        ) : (
          <table className="w-full text-sm border-collapse text-[#053B76]">
            <thead>
              <tr className="bg-[#0B96D9] text-white">
                <th className="py-2 px-4 text-left font-bold w-[100px] rounded-tl-lg">Questions</th>
                {colLabels.map(l => (
                  <th key={l} className="py-2 px-4 text-center font-bold w-[80px]">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => {
                // This question's own number of choices
                const qCols = q.choices.length;
                return (
                  <tr key={q.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f4faff]'}>
                    <td className="py-2 px-4 font-bold text-[#053B76]">Q{i + 1}</td>
                    {colLabels.map((l, li) => (
                      <td key={l} className="py-2 px-4 text-center">
                        {li < qCols ? (
                          <div className="mx-auto w-8 h-8 border-2 border-[#ceedf8] rounded-md" />
                        ) : (
                          // Gray out cells that don't apply to this question
                          <div className="mx-auto w-8 h-8 rounded-md bg-[#f0f0f0]" />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
