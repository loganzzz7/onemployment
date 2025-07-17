import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import avatar from "../assets/logo.png"
import { AuthContext } from '../contexts/AuthContext'
const API = import.meta.env.VITE_API_BASE;



const CommitPage = () => {
  const { username, repoid, commitid } = useParams()
  const token = localStorage.getItem('token')
  const { user: currentUser } = useContext(AuthContext)
  const isAuthenticated = Boolean(token)
  const isOwner = currentUser?.username === username
  const navigate = useNavigate()
  const location = useLocation()

  const [repo, setRepo] = useState(null)
  const [commit, setCommit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [formDesc, setFormDesc] = useState('')

  const [isAddingComment, setIsAddingComment] = useState(false)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`${API}/repos/${repoid}`, { headers })
        if (!res.ok) throw new Error('Failed to load repo')
        const data = await res.json()
        setRepo(data)
        const c = data.commits.find(c => c._id === commitid)
        if (!c) throw new Error('Commit not found')
        setCommit(c)
        setFormDesc(c.description)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [repoid, commitid, token])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading…</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>
  }

  const commitNumber = repo.commits.findIndex(c => c._id === commitid) + 1

  // only the owner can save description
  async function saveDesc() {
    const res = await fetch(`${API}/repos/${repoid}/commits/${commitid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: formDesc }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCommit(updated)
      setIsEditingDesc(false)
    }
  }

  // any user may post a comment
  async function submitComment() {
    try {
      const res = await fetch(
        `${API}/repos/${repoid}/commits/${commitid}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      )
      if (!res.ok) throw new Error('Failed to post comment')
      // reload to refresh comment
      const freshRes = await fetch(`${API}/repos/${repoid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      const fresh = await freshRes.json()
      setRepo(fresh)
      const updated = fresh.commits.find(c => c._id === commitid)
      setCommit(updated)
      setNewComment('')
      setIsAddingComment(false)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <main className="font-mono min-h-screen bg-black text-white">
      {/* head */}
      <header className="py-4 px-6 flex items-center justify-between border-b-2 border-gray-800">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${username}`}>
            <img
              src={repo.user.avatarUrl || avatar}
              alt={`${repo.user.username} avatar`}
              className="h-8 w-8 rounded-full border-2 border-gray-600 duration-500 hover:border-white cursor-pointer"
            />
          </Link>
          <h1 className="text-2xl font-bold">
            <Link to={`/profile/${username}`} className="hover:underline">
              {repo.user.username}
            </Link>
            <span className="text-gray-500"> / </span>
            <Link to={`/profile/${username}/repos/${repoid}`} className="hover:underline">
              {repo.name}
            </Link>
            <span className="text-gray-500"> / </span>
            Commit #{commitNumber}
          </h1>
          <span className="ml-4 px-2 py-1 bg-gray-200 text-black font-semibold rounded text-md">
            {repo.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </header>

      {/* summary and desc */}
      <section className="py-8 px-16 flex flex-col gap-8">
        <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-between border-2 border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={avatar}
              alt={`${repo.user.username} avatar`}
              className="w-12 h-12 rounded-full object-cover border border-gray-600"
            />
            <div>
              <p className="text-gray-600">@{repo.user.username}</p>
              <h1 className="text-2xl font-bold">{commit.summary}</h1>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-gray-600 text-sm">
              {format(new Date(commit.createdAt), 'PPP p')}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 shadow rounded-lg p-6 border-2 border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Description:</h2>
            {isOwner ? (
              isEditingDesc ? (
                <div className="space-x-2">
                  <button
                    onClick={saveDesc}
                    className="px-3 py-1 bg-blue-900 text-white font-semibold rounded duration-500 hover:bg-blue-700"
                  >Save</button>
                  <button
                    onClick={() => { setFormDesc(commit.description); setIsEditingDesc(false) }}
                    className="px-3 py-1 bg-gray-600 text-white font-semibold rounded duration-500 hover:bg-gray-500"
                  >Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="text-gray-400 duration-500 hover:text-white"
                >
                  <i className="bi bi-pencil-square" />
                </button>
              )
            ) : null}
          </div>
          {isEditingDesc ? (
            <textarea
              rows={8}
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded p-3 focus:outline-none resize-vertical"
            />
          ) : (
            <pre className="whitespace-pre-wrap text-gray-400">{commit.description}</pre>
          )}
        </div>

        {/* — Comments — */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Comments ({commit.comments.length})
          </h2>

          {isAddingComment && isAuthenticated ? (
            <div className="space-y-4">
              <textarea
                rows={4}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded p-3 focus:outline-none resize-vertical"
                placeholder="Write your comment..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={submitComment}
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded duration-500 hover:bg-blue-700"
                >Submit</button>
                <button
                  onClick={() => setIsAddingComment(false)}
                  className="px-4 py-2 bg-gray-600 text-white font-semibold rounded duration-500 hover:bg-gray-500"
                >Cancel</button>
              </div>
            </div>
          ) : commit.comments.length === 0 ? (
            <p className="text-gray-600">No comments yet…</p>
          ) : (
            <div className="border-2 border-gray-700 rounded-lg overflow-y-auto max-h-[30vh] p-4 space-y-4">
              {commit.comments.map(c => (
                <div key={c._id} className="bg-gray-900 shadow rounded-lg p-4 border-2 border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>@{c.author.username}</span>
                    <span>{format(new Date(c.createdAt), 'MMM d, yyyy p')}</span>
                  </div>
                  <p className="text-sm">{c.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            {isAuthenticated ? (
              <button
                onClick={() => setIsAddingComment(true)}
                className="px-6 py-2 bg-blue-900 text-white font-semibold rounded duration-500 hover:bg-blue-700"
              >Add a comment</button>
            ) : (
              <button
                onClick={() => navigate('/signin', { state: { from: location.pathname } })}
                className="px-6 py-2 bg-blue-900 text-white font-semibold rounded duration-500 hover:bg-blue-700"
              >Sign in to comment</button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default CommitPage