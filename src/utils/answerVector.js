// Answer-key vector helpers.
//
// The teacher marks one correct choice per question (`question.correct` is a
// 0-based index into `question.choices`, or `null` if unset). For grading we
// transform that into a one-hot matrix that mirrors what an OMR scan reports:
// one row per question, one column per choice bubble, `1` for the correct
// bubble and `0` everywhere else. A student's scanned sheet has the same shape,
// so correction becomes a position-by-position comparison.

/**
 * Build the one-hot answer key for a question. Supports multiple correct
 * answers: every correct choice gets a 1.
 * @param {{ choices: any[], correct: number[] | number | null }} question
 * @returns {number[]} e.g. correct A & C of 4 choices -> [1, 0, 1, 0]
 */
export function questionToVector(question) {
  const row = new Array(question.choices.length).fill(0);
  const correct = Array.isArray(question.correct)
    ? question.correct
    : question.correct == null
      ? []
      : [question.correct];
  for (const i of correct) {
    if (i >= 0 && i < row.length) row[i] = 1;
  }
  return row;
}

/**
 * Build the full one-hot answer key matrix for an exam.
 * Unanswered questions yield an all-zero row.
 * @param {Array<{ choices: any[], correct: number|null }>} questions
 * @returns {number[][]} e.g. [[0,0,1,0], [1,0,0,0], ...]
 */
export function buildAnswerKey(questions) {
  return questions.map(questionToVector);
}

/**
 * Build the per-question points vector for an exam.
 * @param {Array<{ points?: number }>} questions
 * @returns {number[]} e.g. [1, 2, 1, 3] (defaults to 1 when unset)
 */
export function buildPointsVector(questions) {
  return questions.map(q => (q.points == null ? 1 : q.points));
}

/**
 * Compare a scanned student sheet against the answer key.
 *
 * This is the grading *seam*, not a grading model — it assumes the student
 * matrix has already been produced (e.g. by the OMR scan/detection step) in the
 * same one-hot shape as `answerKey`. A question is counted correct only when its
 * row matches the key row exactly. Each correct question is worth its points
 * (from `points`, default 1 each), so `score`/`total` are point totals.
 *
 * @param {number[][]} answerKey   one-hot key from buildAnswerKey()
 * @param {number[][]} studentMatrix one-hot detected answers, same shape
 * @param {number[]} [points]      per-question points (default 1 each)
 * @returns {{ score: number, total: number, perQuestion: boolean[] }}
 */
export function gradeSheet(answerKey, studentMatrix, points) {
  const perQuestion = answerKey.map((keyRow, i) => {
    const studentRow = studentMatrix[i] || [];
    if (studentRow.length !== keyRow.length) return false;
    return keyRow.every((v, j) => v === studentRow[j]);
  });
  const pointsFor = i => (points && points[i] != null ? points[i] : 1);
  return {
    score: perQuestion.reduce((sum, ok, i) => sum + (ok ? pointsFor(i) : 0), 0),
    total: answerKey.reduce((sum, _row, i) => sum + pointsFor(i), 0),
    perQuestion,
  };
}
