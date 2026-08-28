import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getResource, getAvailability } from '../api/resources.js'
import { createBooking, cancelBooking, getBookings } from '../api/bookings.js'
import { getComments, createComment } from '../api/comments.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../hooks/useSocket.js'

export default function BookingPage() {
  const { id } = useParams()
  const { token, user } = useAuth()
  const [resource, setResource] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [myBookings, setMyBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadAvailability = useCallback(async () => {
    const s = await getAvailability(id, date)
    setSlots(s)
    setSelectedSlot(null)
  }, [id, date])

  const loadMyBookings = useCallback(async () => {
    if (!token) return
    const b = await getBookings(token)
    setMyBookings(b.filter(bk => bk.resourceId === id || bk.resourceId?._id === id))
  }, [token, id])

  useEffect(() => {
    getResource(id).then(setResource)
  }, [id])

  useEffect(() => {
    loadAvailability()
    loadMyBookings()
  }, [loadAvailability, loadMyBookings])

  useSocket({
    'booking:updated': ({ resourceId, date: updatedDate }) => {
      if (resourceId === id && updatedDate === date) {
        loadAvailability()
        loadMyBookings()
      }
    },
    'comment:added': ({ bookingId, comment }) => {
      if (selectedBooking && bookingId === selectedBooking._id) {
        setComments(prev => [...prev, comment])
      }
    },
  })

  async function handleBook() {
    if (!selectedSlot || !token) return
    setError(''); setSuccess('')
    try {
      await createBooking(token, id, selectedSlot.startsAt, selectedSlot.endsAt)
      setSuccess('Bokning gjord!')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCancel(bookingId) {
    try {
      await cancelBooking(token, bookingId)
      setSuccess('Bokning avbokad.')
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking(null)
        setComments([])
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function selectBooking(booking) {
    setSelectedBooking(booking)
    const c = await getComments(token, booking._id)
    setComments(c)
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      await createComment(token, selectedBooking._id, commentText)
      setCommentText('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!resource) return <div className="container"><p>Laddar…</p></div>

  return (
    <div className="container">
      <h1>{resource.name} <span className={`badge ${resource.type}`}>{resource.type}</span></h1>
      {resource.description && <p style={{ color: '#64748b', marginBottom: '1rem' }}>{resource.description}</p>}

      <div className="card">
        <h2>Välj datum</h2>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 'auto' }} />
      </div>

      <div className="card">
        <h2>Tillgänglighet</h2>
        <div className="slot-grid">
          {slots.map(slot => {
            const hour = new Date(slot.startsAt).getUTCHours()
            const isSelected = selectedSlot?.startsAt === slot.startsAt
            return (
              <div
                key={slot.startsAt}
                className={`slot ${!slot.available ? 'booked' : isSelected ? 'selected' : 'available'}`}
                onClick={() => slot.available && setSelectedSlot(isSelected ? null : slot)}
              >
                {hour}:00–{hour + 1}:00
              </div>
            )
          })}
        </div>
        {token && selectedSlot && (
          <button onClick={handleBook}>Boka {new Date(selectedSlot.startsAt).getUTCHours()}:00–{new Date(selectedSlot.endsAt).getUTCHours()}:00</button>
        )}
        {!token && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Logga in för att boka.</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>

      {token && myBookings.length > 0 && (
        <div className="card">
          <h2>Dina bokningar för denna resurs</h2>
          {myBookings.filter(b => b.status === 'confirmed').map(b => (
            <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem' }}>
                {new Date(b.startsAt).toLocaleDateString('sv')} {new Date(b.startsAt).getUTCHours()}:00–{new Date(b.endsAt).getUTCHours()}:00
              </span>
              <button className="secondary" style={{ padding: '0.2rem 0.6rem' }} onClick={() => selectBooking(b)}>Kommentarer</button>
              <button className="danger" style={{ padding: '0.2rem 0.6rem' }} onClick={() => handleCancel(b._id)}>Avboka</button>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <div className="card">
          <h2>Kommentarer</h2>
          {comments.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Inga kommentarer ännu.</p>}
          {comments.map(c => (
            <div key={c._id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.userEmail} · {new Date(c.createdAt).toLocaleString('sv')}</span>
              <p style={{ marginTop: '0.2rem' }}>{c.text}</p>
            </div>
          ))}
          <form onSubmit={handleComment} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Skriv en kommentar…" style={{ flex: 1 }} />
            <button type="submit">Skicka</button>
          </form>
        </div>
      )}
    </div>
  )
}
