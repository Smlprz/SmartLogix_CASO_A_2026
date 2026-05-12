
import React, { createContext, useState, useEffect } from 'react'
import authService from '../services/auth.service'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = authService.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  // user puede venir del localStorage (tiene role) o de la API fresca (tiene companyId)
  const companyId = user?.companyId ?? null
  const role = user?.role || (companyId ? 'COMPANY' : (user?.userId || user?.id ? 'ADMIN' : null))

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        role,
        companyId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
