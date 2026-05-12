import axios from 'axios'

// Create API instance for Orders service (port 8081, context-path /api)
const ordersApi = axios.create({
  baseURL: 'http://localhost:8081/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
ordersApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartlogix_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
ordersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartlogix_token')
      localStorage.removeItem('smartlogix_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const orderService = {
  async getAll() {
    return ordersApi.get('/orders')
  },

  async getById(id) {
    return ordersApi.get(`/orders/${id}`)
  },

  async create(orderData) {
    return ordersApi.post('/orders', orderData)
  },

  async updateStatus(id, status) {
    return ordersApi.put(`/orders/${id}/status`, { status })
  },

  async delete(id) {
    return ordersApi.delete(`/orders/${id}`)
  },

  async getByCustomer(customerId) {
    return ordersApi.get(`/orders/customer/${customerId}`)
  },

  async getByStatus(status) {
    return ordersApi.get(`/orders/status/${status}`)
  },

  async getByDateRange(startDate, endDate) {
    return ordersApi.get('/orders/date-range', {
      params: { start: startDate, end: endDate },
    })
  },
}

export default orderService
