import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuestionsProvider } from './context/QuestionsContext';
import { ExamConfigProvider } from './context/Examconfigcontext';  // ← add this
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './pages/DashboardLayout';
import Profile from './pages/Profile';
import ExamConfig from './pages/ExamConfig';
import QuestionsCreation from './pages/QuestionsCreation';
import QuestionSheet from './pages/QuestionSheet';
import GridSheet from './pages/GridSheet';
import CorrectionSheet from './pages/CorrectionSheet';
import ExamList from './pages/ExamList';

function App() {
  return (
    <ExamConfigProvider>        {/* ← outer, so QuestionsProvider can read it */}
      <QuestionsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="exam-config" element={<ExamConfig />} />
              <Route path="questions" element={<QuestionsCreation />} />
              <Route path="preview" element={<QuestionSheet />} />
              <Route path="grid-preview" element={<GridSheet />} />
              <Route path="correction" element={<CorrectionSheet />} />
              <Route path="exam-list" element={<ExamList />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QuestionsProvider>
    </ExamConfigProvider>
  );
}

export default App;