import axios from 'axios'

// Create API instance for Inventory service (port 8083)
const inventoryApi = axios.create({
  baseURL: 'http://localhost:8083',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
inventoryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartlogix_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
inventoryApi.interceptors.response.use(
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

const inventoryService = {
  async getAll() {
    return inventoryApi.get('/api/inventory/products')
  },

  async getById(id) {
    return inventoryApi.get(`/api/inventory/products/${id}`)
  },

  async create(productData) {
    return inventoryApi.post('/api/inventory/products', productData)
  },

  async update(id, productData) {
    return inventoryApi.put(`/api/inventory/products/${id}`, productData)
  },

  async delete(id) {
    return inventoryApi.delete(`/api/inventory/products/${id}`)
  },
}

export default inventoryService
