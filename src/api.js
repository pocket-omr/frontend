const BASE = 'http://localhost:8000'

// Exchange the refresh token for a fresh access token. Returns true on success.
async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    if (data.access_token) localStorage.setItem('access_token', data.access_token)
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
    return Boolean(data.access_token)
  } catch {
    return false
  }
}

export async function apiFetch(path, options = {}, _retried = false) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })

  // 401 on a non-auth call: try a transparent refresh+retry once. If that
  // fails the session is dead (expired or for a deleted account) — clear the
  // stale tokens and bounce to login instead of failing silently.
  if (res.status === 401 && !_retried && !path.includes('/auth/')) {
    if (localStorage.getItem('refresh_token') && (await refreshAccessToken())) {
      return apiFetch(path, options, true)
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/signin')) {
      window.location.assign('/signin')
    }
  }

  if (!res.ok) {
    let body
    try { body = await res.json() } catch { body = { detail: res.statusText } }
    throw body
  }
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

/** List the current user's exams from the backend. */
export async function listExams() {
  return apiFetch('/api/v1/exams')
}

/** Delete an exam on the backend. */
export async function deleteExamApi(examId) {
  return apiFetch(`/api/v1/exams/${examId}`, { method: 'DELETE' })
}

/** Download the exam's graded students as an Excel file (triggers a browser download). */
export async function downloadResultsExcel(examId, title) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE}/api/v1/exams/${examId}/results.xlsx`, {
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
  })
  if (!res.ok) {
    let body
    try { body = await res.json() } catch { body = { detail: res.statusText } }
    throw body
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(title || 'exam').replace(/[^a-z0-9 _-]/gi, '')}_grades.xlsx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Build the backend ExamCreate payload from the web app's exam state. */
export function buildExamPayload(form, questions, checkboxType, gridLayout, students) {
  return {
    form: {
      title: form.title,
      module: form.module,
      university: form.university,
      department: form.department,
      date: form.date,
      duration: form.duration,
      numQuestions: form.numQuestions,
      choices: form.choices,
      questionsPerPage: form.questionsPerPage,
      instructions: form.instructions,
    },
    questions: (questions || []).map(q => ({
      text: q.text,
      choices: (q.choices || []).map(c => ({ text: c.text })),
      // Correct answers as an array of choice indices (multiple-choice support).
      correct: Array.isArray(q.correct) ? q.correct : q.correct == null ? [] : [q.correct],
      points: q.points == null ? 1 : q.points,
    })),
    checkboxType: checkboxType || 'Fill',
    gridLayout: gridLayout || 'Linear',
    students: (students || []).map(s => ({
      firstName: s.firstName || '',
      lastName: s.lastName || '',
      group: s.group || '',
      registrationNumber: s.registrationNumber || '',
    })),
  }
}

/** Create an exam on the backend. Requires a logged-in user (Bearer token). */
export async function createExam(payload) {
  return apiFetch('/api/v1/exams', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Update an existing backend exam. */
export async function updateExam(examId, payload) {
  return apiFetch(`/api/v1/exams/${examId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}