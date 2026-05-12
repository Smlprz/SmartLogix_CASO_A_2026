import api from './api'
import { STORAGE_KEYS } from '../utils/constants'

const authService = {
  async login(username, password) {
    // Validar inputs
    if (!username || !password) {
      throw new Error('Usuario y contraseña son requeridos')
    }

    try {
      const response = await api.post('/users/login', { username, password })

      // Validar respuesta
      if (!response.data) {
        throw new Error('Respuesta vacía del servidor')
      }

      if (!response.data.userId) {
        throw new Error(
          response.data.message ||
          'Usuario o contraseña incorrectos'
        )
      }

      const { userId, username: returnedUsername, companyId, companyName } = response.data
      const role = companyId ? 'COMPANY' : 'ADMIN'

      // Guardar token (usamos userId como token simple)
      localStorage.setItem(STORAGE_KEYS.TOKEN, userId.toString())

      // Guardar usuario
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({
          id: userId,
          username: returnedUsername || username,
          company: companyName || 'Default',
          companyId: companyId || null,
          role,
        })
      )

      return response.data
    } catch (error) {
      console.error('Error en login:', error)

      // Mejor manejo de errores HTTP
      if (error.response?.status === 401) {
        throw new Error('Usuario o contraseña incorrectos')
      } else if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado')
      } else if (error.response?.status === 500) {
        throw new Error('Error del servidor. Intenta más tarde')
      } else if (error.message === 'Network Error') {
        throw new Error('Error de conexión. Verifica tu conexión a internet')
      }

      throw error
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  isAuthenticated() {
    return !!this.getToken()
  },
}

export default authService
