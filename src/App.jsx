import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import JoinCoursesPage from './pages/JoinCoursesPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/join-courses" element={<JoinCoursesPage />} />
      <Route path="/success" element={<PaymentSuccessPage />} />
    </Routes>
  )
}
