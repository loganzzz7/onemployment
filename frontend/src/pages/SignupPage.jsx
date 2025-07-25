import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
const API = import.meta.env.VITE_API_BASE;



const SignupPage = () => {
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        login(data.token, data.user)
        navigate(`/profile/${data.user.username}`)
      } else {
        console.error('Register error:', data.error)
        setError(data.error)
      }
    } catch (err) {
      console.error('Network or JSON error:', err)
      setError('Unexpected error')
    }
  }

  return (
    <main className="font-mono min-h-screen bg-black text-white flex items-center justify-center">
      <section className="w-2/3 p-8 bg-gray-800 text-white rounded border-2 border-gray-600 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Register</h2>
        {error && <p className="mb-2 text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold">Username:</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded p-2"
              required
            />
          </div>
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
              Sign Up
            </button>
            <Link
              to="/signin"
              className="text-center font-bold w-1/6 bg-blue-900 py-2 rounded duration-500 hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}

export default SignupPage