import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuestionsProvider } from './context/QuestionsContext';
import { ExamConfigProvider } from './context/Examconfigcontext';  // ← add this
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ForgotPassword from './components/ForgotPassword';
import VerifyCode from './components/VerifyCode';
import ResetPassword from './components/ResetPassword';
import DashboardLayout from './components/DashboardLayout';
import Profile from './components/Profile';
import ExamConfig from './components/ExamConfig';
import QuestionsCreation from './components/QuestionsCreation';
import QuestionSheet from './components/QuestionSheet';
import GridSheet from './components/GridSheet';
import CorrectionSheet from './components/CorrectionSheet';

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
            </Route>
          </Routes>
        </BrowserRouter>
      </QuestionsProvider>
    </ExamConfigProvider>
  );
}

export default App;