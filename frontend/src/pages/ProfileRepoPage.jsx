import React, { useState, useEffect, useContext } from 'react'
import RepoCard from '../components/RepoCard'
import { format } from 'date-fns'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import defaultAvatar from '../assets/logo.png'
import { AuthContext } from '../contexts/AuthContext'
const API = import.meta.env.VITE_API_BASE;



export default function ProfileRepoPage() {
  const { user: currentUser, setUser: setAuthUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { username } = useParams()
  const token = localStorage.getItem('token')
  const isOwner = currentUser?.username === username
  const isAuthenticated = !!currentUser

  // profile + repos
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])

  // follow/unfollow state
  const [isFollowing, setIsFollowing] = useState(false)

  // edit form (owner only)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '', bio: '', company: '', location: '',
    website: '', twitter: '', linkedin: '', github: '',
  })

  // search + pagination
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(3)
  useEffect(() => {
    if (searchActive) setVisibleCount(3)
  }, [searchActive, searchQuery])

  // initialize follow state
  useEffect(() => {
    if (!isOwner && currentUser && user) {
      const me = Array.isArray(currentUser.following)
        ? currentUser.following.map(String)
        : []
      setIsFollowing(me.includes(String(user._id)))
    }
  }, [currentUser, user, isOwner])

  // follow API
  async function handleFollow() {
    const res = await fetch(`${API}/users/${username}/follow`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return

    // update their followers list
    setUser(u => ({
      ...u,
      followers: Array.isArray(u.followers)
        ? [...u.followers, currentUser._id]
        : [currentUser._id]
    }))
    // update my following in context
    setAuthUser(cu => ({
      ...cu,
      following: Array.isArray(cu.following)
        ? [...cu.following, user._id]
        : [user._id]
    }))
    setIsFollowing(true)
  }

  // unfollow API
  async function handleUnfollow() {
    const res = await fetch(`${API}/users/${username}/follow`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return

    setUser(u => ({
      ...u,
      followers: Array.isArray(u.followers)
        ? u.followers.filter(id => String(id) !== String(currentUser._id))
        : []
    }))
    setAuthUser(cu => ({
      ...cu,
      following: Array.isArray(cu.following)
        ? cu.following.filter(id => String(id) !== String(user._id))
        : []
    }))
    setIsFollowing(false)
  }

  // icons
  const icons = {
    twitter: 'bi bi-twitter-x',
    linkedin: 'bi bi-linkedin',
    github: 'bi bi-github',
  }

  // fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API}/repos/user/${username}`)
        if (!res.ok) throw new Error('Profile not found')
        const { user: u } = await res.json()
        setUser(u)
        setFormData({
          name: u.name,
          bio: u.bio || '',
          company: u.company || '',
          location: u.location || '',
          website: u.website || '',
          twitter: u.socials.twitter || '',
          linkedin: u.socials.linkedin || '',
          github: u.socials.github || '',
        })
      } catch {
        navigate('/', { replace: true })
      }
    }
    fetchProfile()
  }, [username, navigate])

  // fetch repos
  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(`${API}/repos/all?user=${username}`)
        if (!res.ok) throw new Error('Failed to load repos')
        setRepos(await res.json())
      } catch {
        console.error('Could not load repos')
      }
    }
    fetchRepos()
  }, [username])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  // logout
  function handleLogout() {
    logout()
    navigate('/signin', { replace: true })
  }

  // save edits
  async function handleSave() {
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setUser(data.user)
      setIsEditing(false)
    } catch (err) {
      alert(err.message)
    }
  }

  function handleCancel() {
    setFormData({
      name: user.name,
      bio: user.bio || '',
      company: user.company || '',
      location: user.location || '',
      website: user.website || '',
      twitter: user.socials.twitter || '',
      linkedin: user.socials.linkedin || '',
      github: user.socials.github || '',
    })
    setIsEditing(false)
  }

  // filter + paginate
  const filtered = searchActive
    ? repos.filter(r =>
      r.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    : repos
  const visible = filtered.slice(0, visibleCount)
  const loadMore = () =>
    setVisibleCount(c => Math.min(c + 10, filtered.length))

  return (
    <main className="font-mono bg-black min-h-screen">
      <section className="py-8 text-white">
        <div className="px-24 grid grid-cols-1 md:grid-cols-3 gap-16">

          {/* left */}
          <div className="space-y-4">
            <img
              src={user.avatarUrl || defaultAvatar}
              alt={`${user.name} avatar`}
              className="mx-auto lg:mx-0 h-48 w-48 rounded-full border-2 border-gray-800"
            />

            <h1 className="text-2xl font-bold">
              {isOwner && isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Name"
                  className="w-full mx-auto lg:mx-0 bg-transparent border border-gray-800 rounded px-2 py-1 text-white focus:outline-none"
                />
              ) : (
                user.name
              )}
            </h1>

            <p className="text-gray-300">@{user.username}</p>

            {isOwner && isEditing ? (
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Write a bio..."
                className="w-full mx-auto lg:mx-0 bg-transparent border border-gray-800 rounded px-2 py-1 text-gray-400 focus:outline-none"
              />
            ) : (
              <p className="mt-4 text-gray-400">{user.bio}</p>
            )}

            {/* Edit/Save/Cancel/Logout OR Follow/Unfollow */}
            <div className="flex gap-4 w-11/12 sm:w-full">
              {isOwner ? (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                      >Save</button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-gray-500"
                      >Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-900 w-full text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                    >
                      <i className="bi bi-gear-wide-connected" /> Edit Profile
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-900 w-full text-white font-bold px-4 py-2 rounded duration-500 hover:bg-red-700"
                  >
                    <i className="bi bi-box-arrow-right" /> Log Out
                  </button>
                </>
              ) : (
                !isAuthenticated ? (
                  <button
                    onClick={() => navigate('/signin', { state: { from: location.pathname } })}
                    className="bg-blue-900 w-full text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                  >Sign in to follow</button>
                ) : isFollowing ? (
                  <button
                    onClick={handleUnfollow}
                    className="bg-red-900 w-full text-white font-bold px-4 py-2 rounded duration-500 hover:bg-red-700"
                  >Unfollow</button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className="bg-blue-900 w-full text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                  >Follow</button>
                )
              )}
            </div>

            {/* stats & socials */}
            <ul className="space-y-2 text-gray-400">
              <li>
                👥{' '}
                {Array.isArray(user.followers)
                  ? user.followers.length
                  : user.followers || 0}{' '}
                followers
              </li>
              <li>
                👀{' '}
                {Array.isArray(user.following)
                  ? user.following.length
                  : user.following || 0}{' '}
                following
              </li>

              {isOwner && isEditing ? (
                <li>
                  <div className="flex gap-2">
                    🏢{' '}
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                    />
                  </div>
                </li>
              ) : user.company ? (
                <li>🏢 {user.company}</li>
              ) : null}

              {isOwner && isEditing ? (
                <li>
                  <div className="flex gap-2">
                    📍{' '}
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                    />
                  </div>
                </li>
              ) : user.location ? (
                <li>📍 {user.location}</li>
              ) : null}

              <li>🗓 Joined {format(new Date(user.createdAt), 'MMM yyyy')}</li>

              {isOwner && isEditing ? (
                <li>
                  <div className="flex gap-2">
                    🔗{' '}
                    <input
                      type="text"
                      value={formData.website}
                      onChange={e => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                    />
                  </div>
                </li>
              ) : user.website ? (
                <li>
                  <div className="flex gap-2">
                    🔗{' '}
                    <a
                      href={user.website}
                      className="text-blue-700 hover:underline flex flex-wrap break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  </div>
                </li>
              ) : null}
            </ul>

            {/* social URLs when editing */}
            {isOwner && isEditing && (
              <ul className="space-y-2 text-gray-400 pt-2">
                <li>
                  <div className="flex gap-2">
                    <i className="bi bi-twitter-x text-blue-700" />{' '}
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                    />
                  </div>
                </li>
                <li>
                  <div className="flex gap-2">
                    <i className="bi bi-linkedin text-blue-700" />{' '}
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                    />
                  </div>

                </li>
                <li>
                  <div className="flex gap-2">
                    <i className="bi bi-github text-blue-700" />{' '}
                    <input
                      type="text"
                      value={formData.github}
                      onChange={e => setFormData({ ...formData, github: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                    />
                  </div>
                </li>
              </ul>
            )}

            {/* social icons when not editing */}
            {!isEditing && (
              <div className="text-blue-700 mt-4 gap-4 flex">
                {['twitter', 'linkedin', 'github'].map(key =>
                  formData[key] ? (
                    <a
                      key={key}
                      href={formData[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="duration-500 hover:text-white text-2xl"
                    >
                      <i className={icons[key]} />
                    </a>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* right */}
          <div className="w-full mx-auto md:col-span-2 space-y-4">
            <div className="flex justify-between">
              {/* search */}
              <div className="flex items-center space-x-2 font-bold text-gray-400">
                {!searchActive ? (
                  <button
                    onClick={() => setSearchActive(true)}
                    className="hover:text-white duration-200 flex items-center space-x-1"
                  >
                    <i className="bi bi-search" />
                    <span>Search repos</span>
                  </button>
                ) : (
                  <>
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Repo name…"
                      className="bg-transparent border-b border-gray-400 text-white focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        setSearchActive(false)
                        setSearchQuery('')
                      }}
                      className="hover:text-white text-gray-500 duration-200"
                    >
                      <i className="bi bi-x-square" />
                    </button>
                  </>
                )}
              </div>

              {/* back home */}
              <Link
                to={`/profile/${user.username}`}
                className="text-white font-semibold"
              >
                <div className="py-2 px-4 bg-gray-800 rounded hover:bg-gray-300 hover:text-black duration-500">
                  <i className="bi bi-arrow-left-square" /> Home
                </div>
              </Link>
            </div>

            {/* repo list */}
            <section>
              <div className="text-white font-semibold pb-4">
                <p>Repositories:</p>
              </div>
              <div className="border-2 border-gray-400 rounded overflow-y-auto max-h-[65vh]">
                <div className="flex flex-col gap-4 p-4">
                  {visible.map(r => (
                    <Link
                      key={r._id}
                      to={`/profile/${user.username}/repos/${r._id}`}
                      className="block"
                    >
                      <RepoCard
                        repo={r}
                        className="duration-500 hover:border-white"
                      />
                    </Link>
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <button
                    onClick={loadMore}
                    className="mx-auto my-4 block px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 duration-200"
                  >
                    View More
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}