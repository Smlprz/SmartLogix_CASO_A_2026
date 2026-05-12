
import api from './api'

const userService = {
  // Usuarios
  async getAll() {
    return api.get('/users')
  },

  async getById(id) {
    return api.get(`/users/${id}`)
  },

  async getByUsername(username) {
    return api.get(`/users/username/${username}`)
  },

  async create(userData) {
    return api.post('/users', userData)
  },

  async update(id, userData) {
    return api.put(`/users/${id}`, userData)
  },

  async delete(id) {
    return api.delete(`/users/${id}`)
  },

  // Empresas
  async getAllCompanies() {
    return api.get('/companies')
  },

  async getCompanyById(id) {
    return api.get(`/companies/${id}`)
  },

  async createCompany(companyData) {
    return api.post('/companies', companyData)
  },

  async updateCompany(id, companyData) {
    return api.put(`/companies/${id}`, companyData)
  },

  async deleteCompany(id) {
    return api.delete(`/companies/${id}`)
  },
}

export default userService
