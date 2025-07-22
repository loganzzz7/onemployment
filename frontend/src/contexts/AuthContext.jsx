import React, { createContext, useState, useEffect, useCallback } from 'react'
const API = import.meta.env.VITE_API_BASE;



export const AuthContext = createContext({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    setUser: () => { }
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // fix for render's freetier sleep after 15 mins
    const fetchMe = useCallback(async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }
        try {
            const res = await fetch(`${API}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.status === 401) {
                localStorage.removeItem('token')
                setUser(null)
            } else if (res.ok) {
                const { user } = await res.json()
                setUser(user)
            }
            // if it’s a 5smt or network error, just leave the token and user alone
        } catch (err) {
            console.error('Network/server error in fetchMe', err)
            // don’t log the user out on sleep
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMe()
    }, [fetchMe])

    const login = (token, user) => {
        localStorage.setItem('token', token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}