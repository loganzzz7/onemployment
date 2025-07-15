import React, { useState, useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'



const SigninPage = () => {
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  // back to commit after signin
  const from = location.state?.from || null

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        // update context (and localStorage)
        login(data.token, data.user)
        // go back to where user came from; else normal
        navigate(from || `/profile/${data.user.username}`, { replace: true })
      } else {
        setError(data.error)
      }
    } catch {
      setError('Unexpected error')
    }
  }

  return (
    <main className="font-mono min-h-screen bg-black text-white flex items-center justify-center">
      <section className="w-2/3 p-8 bg-gray-800 rounded border-2 border-gray-600 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Sign In</h2>
        {error && <p className="mb-2 text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded p-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold">Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded p-2"
              required
            />
          </div>
          <div className="flex flex-col gap-4 items-center pt-4">
            <button
              type="submit"
              className="font-bold w-1/6 bg-blue-900 py-2 rounded duration-500 hover:bg-blue-700"
            >
              Sign In
            </button>
            <Link
              to="/signup"
              className="text-center font-bold w-1/6 bg-blue-900 py-2 rounded duration-500 hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}

export default SigninPage