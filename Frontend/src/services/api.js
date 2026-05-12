import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      window.location.href = '/login'
    }

    if (error.response?.status === 403) {
      // Acceso denegado
      console.error('Acceso denegado')
    }

    if (error.response?.status === 404) {
      console.error('Recurso no encontrado')
    }

    if (error.response?.status >= 500) {
      console.error('Error del servidor')
    }

    return Promise.reject(error)
  }
)

export default api
