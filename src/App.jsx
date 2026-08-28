import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function Nav() {
  const { user, logout } = useAuth()
  return (
    <nav>
      <Link to="/" className="brand">Resource Booking</Link>
      <Link to="/">Resurser</Link>
      {user ? (
        <>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{user.email}</span>
          <button className="secondary" style={{ padding: '0.3rem 0.7rem' }} onClick={logout}>Logga ut</button>
        </>
      ) : (
        <>
          <Link to="/login">Logga in</Link>
          <Link to="/register">Registrera</Link>
        </>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<ResourcesPage />} />
        <Route path="/resources/:id" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
