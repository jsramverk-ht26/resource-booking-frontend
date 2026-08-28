import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as apiLogin } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await apiLogin(email, password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: '3rem' }}>
      <div className="card">
        <h1>Logga in</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-post</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Lösenord</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>Logga in</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
          Inget konto? <Link to="/register" style={{ color: '#3b82f6' }}>Registrera dig</Link>
        </p>
      </div>
    </div>
  )
}
