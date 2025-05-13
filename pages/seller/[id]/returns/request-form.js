'use client'
import { useState } from 'react'

export default function ReturnRequestForm({ orderId }) {
  const [reason, setReason] = useState('')
  const [image, setImage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    await fetch('/api/seller/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, reason, image }),
    })
    setSubmitted(true)
  }

  if (submitted) return <p className="text-green-600">Return request submitted!</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow max-w-md">
      <h2 className="text-xl font-bold">Request a Return</h2>
      <textarea
        placeholder="Reason for return"
        value={reason}
        onChange={e => setReason(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="url"
        placeholder="Image URL (optional)"
        value={image}
        onChange={e => setImage(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
        Submit Return Request
      </button>
    </form>
  )
}
