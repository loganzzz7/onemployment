import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import RepoCard from '../components/RepoCard'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import defaultAvatar from '../assets/logo.png'

export default function ProfileRepoPage() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { username } = useParams()
    if (!token) return <Navigate to="/signin" replace />

    // profile + repos state
    const [user, setUser] = useState(null)
    const [repos, setRepos] = useState([])

    // edit form state
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        company: '',
        location: '',
        website: '',
        twitter: '',
        linkedin: '',
        github: '',
    })

    // search + pagination
    const [searchActive, setSearchActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [visibleCount, setVisibleCount] = useState(3)
    useEffect(() => {
        if (searchActive) setVisibleCount(3)
    }, [searchActive, searchQuery])

    // icon classes
    const icons = {
        twitter: 'bi bi-twitter-x',
        linkedin: 'bi bi-linkedin',
        github: 'bi bi-github',
    }

    // initial load
    useEffect(() => {
        async function load() {
            try {
                const [{ user: u }, allRepos] = await Promise.all([
                    fetch('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then(r => {
                        if (!r.ok) throw new Error('auth failed')
                        return r.json()
                    }),
                    fetch('/api/repos', {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then(r => {
                        if (!r.ok) throw new Error('repos failed')
                        return r.json()
                    }),
                ])
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
                setRepos(allRepos)
            } catch (err) {
                console.error(err)
                localStorage.removeItem('token')
                navigate('/signin')
            }
        }
        load()
    }, [token, navigate])

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        )
    }

    // logout
    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/signin')
    }

    // save edits
    async function handleSave() {
        try {
            const res = await fetch('/api/auth/me', {
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
            console.error(err)
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
                    {/* — left column — */}
                    <div className="space-y-4">
                        <img
                            src={user.avatarUrl || defaultAvatar}
                            alt={`${user.name} avatar`}
                            className="mx-auto lg:mx-0 h-48 w-48 rounded-full border-2 border-gray-800"
                        />

                        <h1 className="text-2xl font-bold">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Name"
                                    className="w-11/12 mx-auto lg:mx-0 bg-transparent border border-gray-800 rounded px-2 py-1 text-white focus:outline-none"
                                />
                            ) : (
                                user.name
                            )}
                        </h1>

                        <p className="text-gray-300">@{user.username}</p>

                        {isEditing ? (
                            <textarea
                                rows={3}
                                value={formData.bio}
                                onChange={e =>
                                    setFormData({ ...formData, bio: e.target.value })
                                }
                                placeholder="Write a bio..."
                                className="w-11/12 mx-auto lg:mx-0 bg-transparent border border-gray-800 rounded px-2 py-1 text-gray-400 focus:outline-none"
                            />
                        ) : (
                            <p className="mt-4 text-gray-400">{user.bio}</p>
                        )}

                        <div className="flex gap-4 w-11/12 sm:w-full">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-900 text-white font-bold px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-700 text-white font-bold px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
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
                        </div>

                        <ul className="space-y-2 text-gray-400">
                            <li>👥 {user.followers} followers</li>
                            <li>👀 {user.following} following</li>

                            <li className="flex gap-2">
                                🏢{' '}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={e =>
                                            setFormData({ ...formData, company: e.target.value })
                                        }
                                        placeholder="Company"
                                        className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                    />
                                ) : (
                                    user.company || '—'
                                )}
                            </li>

                            <li className="flex gap-2">
                                📍{' '}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e =>
                                            setFormData({ ...formData, location: e.target.value })
                                        }
                                        placeholder="Location"
                                        className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                    />
                                ) : (
                                    user.location || '—'
                                )}
                            </li>

                            <li>
                                🗓 Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                            </li>

                            <li className="flex gap-2">
                                🔗{' '}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={e =>
                                            setFormData({ ...formData, website: e.target.value })
                                        }
                                        placeholder="https://"
                                        className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                    />
                                ) : user.website ? (
                                    <a
                                        href={user.website}
                                        className="text-blue-700 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {user.website}
                                    </a>
                                ) : (
                                    '—'
                                )}
                            </li>

                            {/* social URL inputs */}
                            {isEditing && (
                                <>
                                    <li className="flex gap-2">
                                        <i className="bi bi-twitter-x text-blue-700" />
                                        <input
                                            type="text"
                                            value={formData.twitter}
                                            onChange={e =>
                                                setFormData({ ...formData, twitter: e.target.value })
                                            }
                                            placeholder="https://twitter.com/…"
                                            className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                        />
                                    </li>
                                    <li className="flex gap-2">
                                        <i className="bi bi-linkedin text-blue-700" />
                                        <input
                                            type="text"
                                            value={formData.linkedin}
                                            onChange={e =>
                                                setFormData({ ...formData, linkedin: e.target.value })
                                            }
                                            placeholder="https://linkedin.com/in/…"
                                            className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                        />
                                    </li>
                                    <li className="flex gap-2">
                                        <i className="bi bi-github text-blue-700" />
                                        <input
                                            type="text"
                                            value={formData.github}
                                            onChange={e =>
                                                setFormData({ ...formData, github: e.target.value })
                                            }
                                            placeholder="https://github.com/…"
                                            className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                        />
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* icon bar */}
                        {!isEditing && (
                            <div className="mt-4 flex gap-4 text-2xl text-blue-700">
                                {['twitter', 'linkedin', 'github'].map(key =>
                                    formData[key] ? (
                                        <a
                                            key={key}
                                            href={formData[key]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="duration-500 hover:text-white"
                                        >
                                            <i className={icons[key]} />
                                        </a>
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>

                    {/* — right column — */}
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
                        <section className="pt-4">
                            <div className="text-white font-medium pb-4">
                                <p>Repositories:</p>
                            </div>
                            <div className="border-2 border-gray-400 rounded overflow-y-auto max-h-[60vh]">
                                <div className="flex flex-col gap-8 p-4">
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