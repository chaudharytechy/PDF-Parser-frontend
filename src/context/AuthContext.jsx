import React, { createContext, useEffect, useState, useCallback } from 'react'
import authService from '../services/authService.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // The real session lives in the httpOnly "pdfmindtoken" cookie the server sets —
  // we never see or store the token itself. We cache the last-known user object
  // in localStorage purely so the UI doesn't flash empty on refresh, but the
  // source of truth is always GET /user/verify.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pdfparser_user')
    return stored ? JSON.parse(stored) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkSession = useCallback(async () => {
    try {
      await authService.verify()
      // /user/verify only confirms the cookie is valid, it doesn't return the
      // user object — so keep whatever we have cached, or mark authenticated
      // with what little we know.
      setIsAuthenticated(true)
      return true
    } catch {
      localStorage.removeItem('pdfparser_user')
      setUser(null)
      setIsAuthenticated(false)
      return false
    }
  }, [])

  useEffect(() => {
    checkSession().finally(() => setLoading(false))
  }, [checkSession])

  const persistUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem('pdfparser_user', JSON.stringify(nextUser))
    }
    setUser(nextUser)
    setIsAuthenticated(true)
  }

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    // Backend sets the pdfmindtoken cookie itself; we just store the user info
    // it returns alongside the response.
    persistUser(data.user)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload)
    // Whether or not registration logs the user in automatically depends on
    // the backend implementation, so confirm by checking the session.
    const sessionActive = await checkSession()
    if (sessionActive && data.user) {
      persistUser(data.user)
    }
    return { ...data, sessionActive }
  }, [checkSession])

  const signOut = useCallback(() => {
    // No logout endpoint exists on the backend — the pdfmindtoken cookie is
    // httpOnly so JavaScript can't clear it. This resets local UI state only;
    // the server session (cookie) remains valid until it expires. Add a
    // POST /user/logout route on the backend (clearing the cookie) to make
    // this a real sign-out.
    localStorage.removeItem('pdfparser_user')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    signOut,
    checkSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
