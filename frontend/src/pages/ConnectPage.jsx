import React, { useState, useEffect } from 'react'
import RepoCard from '../components/RepoCard'
import { Link, Navigate, useNavigate } from 'react-router-dom'

export default function ConnectPage() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  // redirect if not signed in
  if (!token) return <Navigate to="/signin" replace />

  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [visibleCount, setVisibleCount] = useState(3)
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // reset pagination whenever you start a new search
  useEffect(() => {
    if (searchActive) setVisibleCount(3)
  }, [searchActive, searchQuery])

  // load from backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/repos', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to load repositories')
        const data = await res.json()
        setRepos(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    )
  }

  // filter by user‐search if active
  const allRepos = searchActive
    ? repos.filter(r =>
        r.user.username
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      )
    : repos

  const visibleRepos = allRepos.slice(0, visibleCount)
  const handleViewMore = () =>
    setVisibleCount(prev => Math.min(prev + 10, allRepos.length))

  return (
    <main className="font-mono selection::bg-purple-800 bg-black min-h-screen">
      <section className="w-11/12 mx-auto pt-16 flex justify-between">
        <div className="text-white flex flex-col gap-4">
          <p className="sm:text-md md:text-xl lg:text-4xl font-bold">
            Progress Together
          </p>
          <p className="sm:text-sm md:text-md lg:text-lg font-bold">
            Discover how others are locking in and improve together
          </p>
        </div>

        <div className="flex items-center space-x-2 font-bold text-gray-400">
          {!searchActive ? (
            <button
              onClick={() => setSearchActive(true)}
              className="duration-500 hover:text-white flex items-center space-x-1"
            >
              <i className="bi bi-search" />
              <span>Search for a friend</span>
            </button>
          ) : (
            <>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter username..."
                className="bg-transparent border-b border-gray-400 text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  setSearchActive(false)
                  setSearchQuery('')
                }}
                className="text-gray-500 duration-500 hover:text-white"
              >
                <i className="bi bi-x-square" />
              </button>
            </>
          )}
        </div>
      </section>

      <section className="w-11/12 mx-auto pt-12">
        <div className="text-white font-medium pb-4">
          <p>Repositories:</p>
        </div>
        <div className="border-2 border-gray-400 rounded overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col gap-8 p-4">
            {visibleRepos.map(r => (
              <Link
                key={r._id}
                to={`/profile/${r.user.username}/repos/${r._id}`}
                className="block"
              >
                <RepoCard
                  repo={r}
                  className="duration-500 hover:border-white"
                />
              </Link>
            ))}
          </div>

          {visibleCount < allRepos.length && (
            <button
              onClick={handleViewMore}
              className="block mx-auto my-4 mb-8 px-6 py-2 bg-blue-900 text-white rounded"
            >
              View More
            </button>
          )}
        </div>
      </section>
    </main>
  )
}