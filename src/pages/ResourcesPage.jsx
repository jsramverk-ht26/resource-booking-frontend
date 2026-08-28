import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getResources } from '../api/resources.js'

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getResources().then(setResources).catch(err => setError(err.message))
  }, [])

  return (
    <div className="container">
      <h1>Tillgängliga resurser</h1>
      {error && <p className="error">{error}</p>}
      {resources.map(r => (
        <Link to={`/resources/${r._id}`} key={r._id}>
          <div className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <strong>{r.name}</strong>
              <span className={`badge ${r.type}`}>{r.type}</span>
            </div>
            {r.description && <p style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>{r.description}</p>}
          </div>
        </Link>
      ))}
      {resources.length === 0 && !error && <p style={{ color: '#64748b' }}>Inga resurser hittades.</p>}
    </div>
  )
}
