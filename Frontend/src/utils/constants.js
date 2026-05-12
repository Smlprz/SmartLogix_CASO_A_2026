// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

// App Config
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SmartLogix'

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  SHIPPED: 'SHIPPED',
  CANCELLED: 'CANCELLED',
}

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pendiente',
  PROCESSED: 'Procesado',
  SHIPPED: 'Enviado',
  CANCELLED: 'Cancelado',
}

export const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

// Pagination
export const ITEMS_PER_PAGE = 10

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'smartlogix_token',
  USER: 'smartlogix_user',
  THEME: 'smartlogix_theme',
}
