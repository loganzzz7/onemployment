import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import avatar from '../assets/logo.png'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  DialogBackdrop,
} from '@headlessui/react'
import { AuthContext } from '../contexts/AuthContext'

export default function RepoPage() {
  const { repoid } = useParams()
  const token = localStorage.getItem('token')
  const isAuthenticated = Boolean(token)

  const { user: currentUser } = useContext(AuthContext)

  const [repo, setRepo]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // inline‐edit state
  const [isEditingAbout, setIsEditingAbout]   = useState(false)
  const [formSummary, setFormSummary]         = useState('')
  const [isEditingReadme, setIsEditingReadme] = useState(false)
  const [formReadme, setFormReadme]           = useState('')

  // Add Commit
  const [isAddOpen, setIsAddOpen]           = useState(false)
  const [newSummary, setNewSummary]         = useState('')
  const [newDescription, setNewDescription] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`/api/repos/${repoid}`, { headers })
        if (!res.ok) throw new Error('Failed to load repo')
        const data = await res.json()
        setRepo(data)
        setFormSummary(data.summary)
        setFormReadme(data.readme)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [repoid, token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    )
  }
  if (error || !repo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || 'Not found'}
      </div>
    )
  }

  // only the owner can chaneg
  const isOwner = currentUser?.username === repo.user.username

  // PATCH “About”
  async function saveAbout() {
    await fetch(`/api/repos/${repoid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ summary: formSummary }),
    })
    setRepo(r => ({ ...r, summary: formSummary }))
    setIsEditingAbout(false)
  }

  // PATCH “Readme”
  async function saveReadme() {
    await fetch(`/api/repos/${repoid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ readme: formReadme }),
    })
    setRepo(r => ({ ...r, readme: formReadme }))
    setIsEditingReadme(false)
  }

  // POST Commit
  async function handleAddCommit() {
    await fetch(`/api/repos/${repoid}/commits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ summary: newSummary, description: newDescription }),
    })
    setIsAddOpen(false)
    setNewSummary('')
    setNewDescription('')
    const fresh = await fetch(`/api/repos/${repoid}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(r => r.json())
    setRepo(fresh)
  }

  // toggle pin/star
  async function togglePin() {
    const res = await fetch(`/api/repos/${repoid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ togglePin: true })
    })
    const updated = await res.json()
    setRepo(prev => ({ ...prev, ...updated, user: prev.user }))
  }
  async function toggleStar() {
    const res = await fetch(`/api/repos/${repoid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toggleStar: true })
    })
    const updated = await res.json()
    setRepo(prev => ({ ...prev, ...updated, user: prev.user }))
  }

  return (
    <main className="font-mono min-h-screen bg-black text-white">
      {/* head */}
      <div className="py-4 px-6 flex items-center justify-between border-b-2 border-gray-800">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${repo.user.username}`}>
            <img
              src={repo.user.avatarUrl || avatar}
              alt={`${repo.user.username} avatar`}
              className="h-8 w-8 rounded-full border-2 border-gray-600 duration-500 hover:border-white cursor-pointer"
            />
          </Link>
          <h1 className="text-2xl font-bold">
            <Link to={`/profile/${repo.user.username}`} className="hover:underline">
              {repo.user.username}
            </Link>
            <span className="text-gray-500"> / </span>
            {repo.name}
          </h1>
          <span className="ml-4 px-2 py-1 bg-gray-200 text-black font-semibold rounded">
            {repo.isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        {/* only the owner sees these */}
        {isOwner && (
          <div className="space-x-4">
            <button
              className="px-3 py-1 bg-gray-500 text-white font-semibold rounded duration-500 hover:bg-gray-300 hover:text-black"
              onClick={() => setIsAddOpen(true)}
            >
              <i className="bi bi-plus-square" /> Add Commit
            </button>
            <button onClick={togglePin}>
              {repo.isPinned ? (
                <div className="px-3 py-1 bg-gray-300 text-black font-semibold rounded duration-500 hover:bg-gray-500">
                  <i className="bi bi-pin-angle-fill" /> Unpin
                </div>
              ) : (
                <div className="px-3 py-1 bg-gray-500 text-white font-semibold rounded duration-500 hover:bg-gray-300">
                  <i className="bi bi-pin-angle" /> Pin
                </div>
              )}
            </button>
            <button onClick={toggleStar}>
              {repo.isStarred ? (
                <div className="px-3 py-1 bg-yellow-400 text-black font-semibold rounded duration-500 hover:bg-gray-500">
                  <i className="bi bi-star-fill" /> Unstar
                </div>
              ) : (
                <div className="px-3 py-1 bg-gray-500 text-white font-semibold rounded duration-500 hover:bg-yellow-300">
                  <i className="bi bi-star" /> Star
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* add commit Dialog */}
      {isOwner && (
        <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} className="relative z-50 font-mono">
          <DialogBackdrop className="fixed inset-0 bg-black/80" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-gray-800 text-white rounded-lg p-6 space-y-4">
              <DialogTitle className="text-lg font-bold">New Commit</DialogTitle>
              <Description className="text-sm text-gray-400">
                Add a summary and description below
              </Description>
              <label className="block text-sm font-semibold">Summary</label>
              <input
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2"
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
              />
              <label className="block text-sm font-semibold mt-4">Description</label>
              <textarea
                rows={4}
                className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 resize-vertical"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded duration-500 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCommit}
                  className="px-4 py-2 bg-blue-900 rounded duration-500 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}

      {/* body */}
      <div className="mx-auto px-16 py-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* sidebar */}
        <aside className="flex flex-col gap-8">
          <div>
            <h2 className="font-semibold mb-2">About</h2>
            {isEditingAbout ? (
              <textarea
                rows={6}
                className="w-full bg-transparent border border-gray-800 rounded p-2 text-gray-200"
                value={formSummary}
                onChange={e => setFormSummary(e.target.value)}
              />
            ) : (
              <p className="text-gray-400">{repo.summary}</p>
            )}
            {isOwner && (
              isEditingAbout ? (
                <div className="flex gap-2 mt-4">
                  <button onClick={saveAbout} className="bg-blue-900 py-2 w-full rounded duration-500 hover:bg-blue-700">
                    Save
                  </button>
                  <button onClick={() => { setFormSummary(repo.summary); setIsEditingAbout(false) }} className="bg-gray-600 py-2 w-full rounded hover:bg-gray-500">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditingAbout(true)} className="font-semibold mt-4 bg-blue-900 w-full py-2 rounded duration-500 hover:bg-blue-700">
                  <i className="bi bi-gear-wide-connected" /> Edit About
                </button>
              )
            )}
          </div>
          <div>
            <h2 className="font-semibold mb-2">Created</h2>
            <p className="text-gray-400">{format(new Date(repo.createdAt), 'PPP')}</p>
          </div>
        </aside>

        {/* commits + readme */}
        <section className="md:col-span-3 space-y-4">
          {repo.commits.length > 0 && <p className="font-bold text-2xl">Commits:</p>}
          {repo.commits.length > 0 && (
            <div className="border-2 border-gray-700 rounded-lg overflow-y-auto max-h-[40vh] p-4 space-y-4">
              {repo.commits.map(c => (
                <Link
                  key={c._id}
                  to={`/profile/${repo.user.username}/repos/${repoid}/commits/${c._id}`}
                  className="block"
                >
                  <div className="flex flex-col gap-2 bg-gray-900 border-2 border-gray-700 rounded-lg p-4 hover:border-white duration-500">
                    <h3 className="font-semibold text-lg">{c.summary}</h3>
                    <p className="text-sm text-gray-400">{c.description}</p>
                    <div className="mt-2 text-sm flex justify-between">
                      <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm">
                        {repo.user.username} • {c.projectSeason}
                      </span>
                      <span>{format(new Date(c.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </Link>
              ))}  
            </div>
          )}
          <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold"><i className="bi bi-book" /></h2>
              {isOwner && (
                isEditingReadme ? (
                  <div className="space-x-2">
                    <button onClick={saveReadme} className="px-3 py-1 bg-blue-900 rounded hover:bg-blue-700 font-semibold">Save</button>
                    <button onClick={() => { setFormReadme(repo.readme); setIsEditingReadme(false) }} className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 font-semibold">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditingReadme(true)} className="text-gray-400 duration-500 hover:text-white">
                    <i className="bi bi-pencil-square" />
                  </button>
                )
              )}
            </div>
            {isEditingReadme ? (
              <textarea
                rows={10}
                className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded p-3 focus:outline-none resize-vertical"
                value={formReadme}
                onChange={e => setFormReadme(e.target.value)}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-gray-400">{repo.readme}</pre>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}