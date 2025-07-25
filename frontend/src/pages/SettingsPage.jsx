import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import defaultAvatar from '../assets/logo.png'
import { AuthContext } from '../contexts/AuthContext'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


const API = import.meta.env.VITE_API_BASE

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

    useEffect(() => {
        const mql = window.matchMedia(query)
        const handler = e => setMatches(e.matches)
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [query])

    return matches
}

const SettingsPage = () => {
    const { user: currentUser, setUser: setAuthUser, logout } = useContext(AuthContext)
    const { username } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem('token')

    const isOwner = currentUser?.username === username
    const isAuthenticated = Boolean(currentUser)

    const isMobile = useMediaQuery('(max-width: 640px)')

    const [user, setUser] = useState(null)
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

    // email-tab state
    const [newEmail, setNewEmail] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // pwd-tab state
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    //pp tab pfp update
    const fileInputRef = useRef(null)
    async function handleAvatarChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        const body = new FormData()
        body.append('avatar', file)
        try {
            const res = await fetch(`${API}/auth/me/avatar`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            })
            if (!res.ok) throw new Error('Upload failed')
            const { user: updated } = await res.json()
            // sync both local and context
            setUser(updated)
            setAuthUser(cu => ({ ...cu, avatarUrl: updated.avatarUrl }))
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
    }


    // error & succ text disappear after 5sec:
    // clear error after 5s
    useEffect(() => {
        if (!error) return
        const t = setTimeout(() => setError(''), 1000)
        return () => clearTimeout(t)
    }, [error])

    // clear succ after 5s
    useEffect(() => {
        if (!success) return
        const t = setTimeout(() => setSuccess(''), 1000)
        return () => clearTimeout(t)
    }, [success])

    // update pwd
    async function handlePasswordSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (newPassword !== confirmNewPassword) {
            setError("New passwords don't match")
            return
        }

        try {
            const res = await fetch(`${API}/auth/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: confirmPassword,
                    newPassword,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Password change failed')

            setSuccess('Password changed successfully')
            setNewPassword('')
            setConfirmNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            setError(err.message)
        }
    }

    // fetch the user's profile on mount
    useEffect(() => {
        if (!isAuthenticated) {
            return navigate('/', { replace: true, state: { from: location.pathname } })
        }
        if (!isOwner) {
            // not your settings -> back to profile
            return navigate(`/profile/${username}`, { replace: true })
        }
        ; (async () => {
            try {
                const res = await fetch(`${API}/repos/user/${username}`)
                if (!res.ok) throw new Error()
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
                // couldn't load -> bounce home
                navigate('/', { replace: true })
            }
        })()
    }, [API, username, isAuthenticated, isOwner, navigate, location.pathname])

    // save profile edits
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
            setAuthUser(cu => ({ ...cu, name: data.user.name })) // keep context in sync
            setIsEditing(false)
        } catch (err) {
            alert(err.message)
        }
    }

    // cancel edits & reset form
    function handleCancel() {
        if (!user) return
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

    // logout helper
    function handleLogout() {
        logout()
        navigate('/signin', { replace: true })
    }

    // tab logic
    const tabs = [
        { id: 'publicprofile', label: 'Public Profile' },
        { id: 'email', label: 'Email' },
        { id: 'password', label: 'Password' },
    ]
    const [, , , activeTab = 'publicprofile'] = location.pathname.split('/')

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading…
            </div>
        )
    }

    async function handleEmailSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API}/auth/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: newEmail,
                    password: passwordConfirm,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Update failed')

            setUser(u => ({ ...u, email: newEmail }))
            setAuthUser(cu => ({ ...cu, email: newEmail }))

            setSuccess('Email changed successfully')
            setNewEmail('')
            setPasswordConfirm('')
        } catch (err) {
            setError(err.message)
        }
    }

    const avatarSrc = user.avatarUrl
        ?
        user.avatarUrl.startsWith('http')
            ? user.avatarUrl
            : `${API}${user.avatarUrl}`
        : defaultAvatar

    return (
        <main className="font-mono bg-black min-h-screen text-white">
            <div className="px-24 py-8 grid grid-cols-1 md:grid-cols-3 gap-16">

                {/* sidebar tabs */}
                <aside className="flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => navigate(`/settings/${username}/${tab.id}`)}
                            className={
                                `block w-full text-left px-4 py-2 rounded font-semibold
                 ${activeTab === tab.id
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 duration-500 hover:bg-gray-800'}`
                            }
                        >
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* right side */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                />

                <section className="md:col-span-2">

                    {activeTab === 'publicprofile' && (
                        <div className="space-y-4">

                            {/* avatar */}
                            <Menu>
                                <MenuButton className="group items-center rounded-full focus:outline-none">
                                    <img
                                        src={avatarSrc}
                                        alt={`${user.name} avatar`}
                                        className="h-48 w-48 rounded-full border-2 border-gray-800 duration-500 group-hover:border-white"
                                    />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    anchor={isMobile ? 'bottom start' : 'right mid'}
                                    className="ml-2 w-35 rounded-xl border-2 border-gray-800 bg-gray-900 p-1 text-sm/6 text-white transition duration-300 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                                >
                                    <MenuItem>
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 duration-500 data-focus:bg-white/10">
                                            Edit
                                            <kbd className="ml-auto hidden text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
                                        </button>
                                    </MenuItem>
                                    <div className="my-1 h-px bg-gray-800" />
                                    <MenuItem>
                                        <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 duration-500 data-focus:bg-white/10">
                                            Delete
                                            <kbd className="ml-auto hidden text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>

                            {/* name */}
                            <h1 className="text-2xl font-bold">
                                {isEditing
                                    ? <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-transparent border border-gray-800 rounded px-2 py-1 text-white focus:outline-none"
                                    />
                                    : user.name
                                }
                            </h1>

                            {/* username */}
                            <p className="text-gray-300">@{user.username}</p>

                            {/* bio */}
                            {isEditing
                                ? <textarea
                                    rows={3}
                                    maxLength={200}
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-transparent border border-gray-800 rounded px-2 py-1 text-gray-400 focus:outline-none"
                                />
                                : <p className="mt-4 text-gray-400">{user.bio}</p>
                            }

                            {/* Edit / Save / Cancel / Logout */}
                            <div className="flex gap-4 w-11/12 sm:w-full">
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
                                        className="w-full bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                                    >Edit Profile</button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-red-700"
                                >
                                    <i className="bi bi-box-arrow-right" /> Log Out
                                </button>
                            </div>

                            {/* stats & socials */}
                            <ul className="space-y-2 text-gray-400">
                                <li>👥 {Array.isArray(user.followers) ? user.followers.length : 0} followers</li>
                                <li>👀 {Array.isArray(user.following) ? user.following.length : 0} following</li>

                                {isEditing
                                    ? <li className="flex gap-2">
                                        🏢 <input
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                        />
                                    </li>
                                    : user.company && <li>🏢 {user.company}</li>
                                }

                                {isEditing
                                    ? <li className="flex gap-2">
                                        📍 <input
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                        />
                                    </li>
                                    : user.location && <li>📍 {user.location}</li>
                                }

                                <li>🗓 Joined {format(new Date(user.createdAt), 'MMM yyyy')}</li>

                                {isEditing
                                    ? <li className="flex gap-2">
                                        🔗 <input
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full bg-transparent border-b border-gray-600 text-white focus:outline-none"
                                        />
                                    </li>
                                    : user.website && (
                                        <li className="flex gap-2">
                                            🔗{' '}
                                            <a
                                                href={user.website}
                                                className="text-blue-700 hover:underline flex flex-wrap break-all"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {user.website}
                                            </a>
                                        </li>
                                    )
                                }
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
                    )}

                    {activeTab === 'email' && (
                        <section className="bg-gray-800 border-2 border-gray-600 rounded p-8 flex flex-col max-w-lg mx-auto">
                            <div className="flex gap-2 items-baseline mb-4">
                                <h1 className="text-xl font-bold">Current Email:</h1>
                                {currentUser.email}
                            </div>
                            <h2 className="text-xl font-bold mb-4">Change Email</h2>
                            {error && <p className="text-red-400 mb-4">{error}</p>}
                            {success && <p className="text-green-400 mb-4">{success}</p>}
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold">New Email:</label>
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        required
                                        className="w-full bg-gray-700 rounded p-2 text-white focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold">Type Password to Confirm:</label>
                                    <input
                                        type="password"
                                        value={passwordConfirm}
                                        onChange={e => setPasswordConfirm(e.target.value)}
                                        required
                                        className="w-full bg-gray-700 rounded p-2 text-white focus:outline-none"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-900 px-6 py-2 rounded font-bold duration-500 hover:bg-blue-700"
                                    >
                                        Update Email
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {activeTab === 'password' && (
                        <section className="bg-gray-800 border-2 border-gray-600 rounded p-8 flex flex-col max-w-lg mx-auto">
                            <h2 className="text-xl font-bold mb-4">Change Password</h2>
                            {error && <p className="text-red-400 mb-4">{error}</p>}
                            {success && <p className="text-green-400 mb-4">{success}</p>}
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold">New Password:</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        className="w-full bg-gray-700 rounded p-2 text-white focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold">Type New Password Again:</label>
                                    <input
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={e => setConfirmNewPassword(e.target.value)}
                                        required
                                        className="w-full bg-gray-700 rounded p-2 text-white focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold">Type Current Password to Confirm:</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-gray-700 rounded p-2 text-white focus:outline-none"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-900 px-6 py-2 rounded font-bold duration-500 hover:bg-blue-700"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                </section>
            </div>
        </main>
    )
}

export default SettingsPage