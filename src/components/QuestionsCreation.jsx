import React from 'react';
import { useQuestions } from '../context/QuestionsContext';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

function QuestionCard({ q, index, onDelete, onChange, onAddChoice, onChangeChoice, onSetCorrect }) {
  return (
    <div className="mb-6 rounded-2xl border-2 border-[#ceedf8] bg-white shadow-sm overflow-hidden">
      {/* Question Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#ceedf8]">
        <div className="w-9 h-9 rounded-full bg-[#053B76] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
          {index + 1}
        </div>
        <input
          type="text"
          value={q.text}
          onChange={e => onChange(q.id, 'text', e.target.value)}
          placeholder="Type a question..."
          className="flex-1 border border-[#0B96D9] rounded-lg px-4 py-2 text-[#053B76] font-semibold outline-none focus:ring-2 focus:ring-[#ceedf8] text-[0.95rem]"
        />
        <button onClick={() => onDelete(q.id)} className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors cursor-pointer border-none">
          ✕
        </button>
      </div>

      {/* Choices */}
      <div className="px-5 pt-3 pb-4 flex flex-col gap-2">
        {q.choices.map((choice, ci) => (
          <div key={ci} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B96D9] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {CHOICE_LABELS[ci] || ci + 1}
            </div>
            <input
              type="text"
              value={choice.text}
              onChange={e => onChangeChoice(q.id, ci, e.target.value)}
              placeholder={`Choice ${CHOICE_LABELS[ci] || ci + 1}`}
              className="flex-1 border border-[#ceedf8] rounded-lg px-4 py-2 text-[#053B76] outline-none focus:border-[#0B96D9] focus:ring-2 focus:ring-[#ceedf8] text-[0.9rem]"
            />
            <button
              onClick={() => onSetCorrect(q.id, ci)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${q.correct === ci ? 'bg-[#0B96D9] border-[#0B96D9] text-white' : 'border-[#ceedf8] bg-white text-[#ceedf8]'}`}
            >
              {q.correct === ci && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              )}
            </button>
            <div className="w-4 h-4 rounded-full bg-[#0B96D9] flex-shrink-0" />
          </div>
        ))}

        <button
          onClick={() => onAddChoice(q.id)}
          className="mt-3 w-full border-2 border-dashed border-[#0B96D9] text-[#0B96D9] rounded-xl py-2 font-semibold hover:bg-[#f4faff] transition-colors cursor-pointer bg-transparent text-sm"
        >
          + Add choices
        </button>
      </div>
    </div>
  );
}

export default function QuestionsCreation() {
  const { questions, addQuestion, deleteQuestion, changeQuestion, addChoice, changeChoice, setCorrect } = useQuestions();

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#053B76]">Questions</h2>
        <button
          onClick={addQuestion}
          className="px-8 py-2.5 bg-[#0B96D9] text-white font-bold rounded-xl shadow hover:bg-[#0a7dbf] transition-colors cursor-pointer border-none text-base"
        >
          Add
        </button>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[calc(100vh-200px)]">
        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={index}
            onDelete={deleteQuestion}
            onChange={changeQuestion}
            onAddChoice={addChoice}
            onChangeChoice={changeChoice}
            onSetCorrect={setCorrect}
          />
        ))}
      </div>
    </div>
  );
}
