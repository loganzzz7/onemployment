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
            if (!res.ok) throw new Error()
            const { user } = await res.json()
            setUser(user)
        } catch {
            setUser(null)
            localStorage.removeItem('token')
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