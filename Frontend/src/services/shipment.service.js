import axios from 'axios'

// Shipments service - port 8082
const shipmentsApi = axios.create({
  baseURL: 'http://localhost:8082/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

shipmentsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartlogix_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

shipmentsApi.interceptors.response.use(
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

const shipmentService = {
  async getAll() {
    return shipmentsApi.get('/shipments')
  },

  async getById(id) {
    return shipmentsApi.get(`/shipments/${id}`)
  },

  async getByOrderId(orderId) {
    return shipmentsApi.get(`/shipments/order/${orderId}`)
  },

  async getByStatus(status) {
    return shipmentsApi.get(`/shipments/status/${status}`)
  },

  async create(shipmentData) {
    return shipmentsApi.post('/shipments', shipmentData)
  },

  async update(id, shipmentData) {
    return shipmentsApi.put(`/shipments/${id}`, shipmentData)
  },

  async updateStatus(id, status) {
    return shipmentsApi.put(`/shipments/${id}/status?status=${status}`)
  },

  async delete(id) {
    return shipmentsApi.delete(`/shipments/${id}`)
  },
}

export default shipmentService
