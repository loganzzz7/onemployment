import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import RepoCard from '../components/RepoCard'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import defaultAvatar from '../assets/logo.png'
import { AuthContext } from '../contexts/AuthContext'
const API = import.meta.env.VITE_API_BASE;



const ProfilePage = () => {
    const { user: currentUser, setUser: setAuthUser, logout } = useContext(AuthContext)
    const { username } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem('token')
    const isOwner = currentUser?.username === username
    const isAuthenticated = !!currentUser

    const [user, setUser] = useState(null)
    const [repos, setRepos] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)
    

    useEffect(() => {
        if (!isOwner && currentUser && user) {
            const followingList = currentUser.following || []
            setIsFollowing(
                followingList.map(id => id.toString()).includes(user._id.toString())
            )
        }
    }, [currentUser, user, isOwner])

    async function handleFollow() {
        const res = await fetch(`/${API}/users/${username}/follow`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return

        setUser(u => ({
            ...u,
            followers: Array.isArray(u.followers)
                ? [...u.followers, currentUser._id]
                : [(currentUser._id)]
        }))

        setAuthUser(cu => ({
            ...cu,
            following: Array.isArray(cu.following)
                ? [...cu.following, user._id]
                : [user._id]
        }))

        setIsFollowing(true)
    }

    async function handleUnfollow() {
        const res = await fetch(`/${API}/users/${username}/follow`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return

        setUser(u => ({
            ...u,
            followers: Array.isArray(u.followers)
                ? u.followers.filter(id => id.toString() !== currentUser._id.toString())
                : []
        }))

        setAuthUser(cu => ({
            ...cu,
            following: Array.isArray(cu.following)
                ? cu.following.filter(id => id.toString() !== user._id.toString())
                : []
        }))

        setIsFollowing(false)
    }

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

    const icons = {
        twitter: 'bi bi-twitter-x',
        linkedin: 'bi bi-linkedin',
        github: 'bi bi-github',
    }

    // fetch profile
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`/${API}/repos/user/${username}`)
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
            } catch (err) {
                console.error(err)
                navigate('/', { replace: true })
            }
        }
        fetchProfile()
    }, [username, navigate])

    // fetch that user’s public repos
    useEffect(() => {
        async function fetchRepos() {
            try {
                const res = await fetch(`/${API}/repos/all?user=${username}`)
                if (!res.ok) throw new Error('Failed to load repos')
                const data = await res.json()
                setRepos(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchRepos()
    }, [username])

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        )
    }

    const pinnedRepos = repos.filter(r => r.isPinned && r.user.username === username)
    const contribCount = {}
    repos.forEach(r =>
        (r.commits || []).forEach(c => {
            const d = c.createdAt.split('T')[0]
            contribCount[d] = (contribCount[d] || 0) + 1
        })
    )
    const endDate = new Date()
    const startDate = subDays(endDate, 364)
    const contributionData = Object.entries(contribCount).map(([date, count]) => ({ date, count }))

    // only runs if it’s _your_ profile
    async function handleSave() {
        try {
            const res = await fetch('/${API}/auth/me', {
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

    function handleLogout() {
        logout()
        navigate('/signin', { replace: true })
    }

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
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                                maxLength={200}
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full mx-auto lg:mx-0 bg-transparent border border-gray-800 rounded px-2 py-1 text-gray-400 focus:outline-none"
                            />
                        ) : (
                            <p className="mt-4 text-gray-400">{user.bio}</p>
                        )}

                        {/* Edit / Save / Cancel / Logout  OR  Follow/Unfollow */}
                        <div className="flex gap-4 w-11/12 sm:w-full">
                            {isOwner ? (
                                // edit logout
                                <>
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="bg-gray-600 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-red-700"
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
                                    🔗{' '}
                                    <a
                                        href={user.website}
                                        className="text-blue-700 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {user.website}
                                    </a>
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
                    <div className="w-full md:col-span-2 space-y-8">
                        {pinnedRepos.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Pinned Repositories</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pinnedRepos.map(r => (
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
                            </div>
                        )}

                        <section className="mb-8 p-4 bg-gray-900 rounded-lg shadow border-2 border-gray-600">
                            <h2 className="text-xl font-semibold mb-4">
                                Contributions in the last year
                            </h2>
                            <CalendarHeatmap
                                startDate={startDate}
                                endDate={endDate}
                                values={contributionData}
                                gutterSize={3}
                                transformDayElement={(rect, value) =>
                                    React.cloneElement(rect, { rx: 2.5, ry: 2.5 })
                                }
                                classForValue={v => {
                                    if (!v || v.count === 0) return 'color-empty'
                                    if (v.count < 2) return 'color-scale-1'
                                    if (v.count < 4) return 'color-scale-2'
                                    if (v.count < 8) return 'color-scale-3'
                                    return 'color-scale-4'
                                }}
                                showWeekdayLabels
                            />
                        </section>

                        <Link
                            to={`/profile/${user.username}/repos`}
                            className="w-full block text-center font-semibold"
                        >
                            <p className="py-6 my-6 bg-gray-800 rounded hover:bg-gray-300 hover:text-black duration-500">
                                Repositories <i className="bi bi-arrow-right-square"></i>
                            </p>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ProfilePage