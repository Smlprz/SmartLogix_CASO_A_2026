import React, { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Table from '../common/Table'
import Modal from '../common/Modal'
import Input from '../common/Input'
import { useFetch } from '../../hooks/useFetch'
import { useNotification } from '../../hooks/useNotification'
import userService from '../../services/user.service'

const EMPTY_FORM = { username: '', password: '', companyId: '' }

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formError, setFormError] = useState('')
  const [formValues, setFormValues] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)

  const { addNotification } = useNotification()

  const { data: usersData, loading, refetch } = useFetch(() =>
    userService.getAll()
  )
  const users = Array.isArray(usersData) ? usersData : []

  const { data: companiesData } = useFetch(() => userService.getAllCompanies())
  const companies = Array.isArray(companiesData) ? companiesData : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitUser = async () => {
    if (!formValues.username) {
      setFormError('El nombre de usuario es requerido')
      return
    }
    if (!selectedUser && !formValues.password) {
      setFormError('La contraseña es requerida')
      return
    }
    try {
      setFormError('')
      setIsSaving(true)
      // El backend espera company: { idCompany } anidado, no companyId plano
      const companyPayload = formValues.companyId
        ? { idCompany: Number(formValues.companyId) }
        : null

      if (selectedUser) {
        await userService.update(selectedUser.userId, {
          username: formValues.username,
          company: companyPayload,
        })
        addNotification('Usuario actualizado correctamente', 'success')
      } else {
        await userService.create({
          username: formValues.username,
          password: formValues.password,
          company: companyPayload,
        })
        addNotification('Usuario creado correctamente', 'success')
      }
      refetch()
      setShowForm(false)
      setSelectedUser(null)
      setFormValues(EMPTY_FORM)
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al guardar usuario'
      setFormError(msg)
      addNotification(msg, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async () => {
    try {
      await userService.delete(deleteConfirm.userId)
      refetch()
      setDeleteConfirm(null)
      addNotification('Usuario eliminado correctamente', 'success')
    } catch (error) {
      addNotification('Error al eliminar usuario', 'error')
    }
  }

  const openCreate = () => {
    setSelectedUser(null)
    setFormValues(EMPTY_FORM)
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (user) => {
    setSelectedUser(user)
    setFormValues({
      username: user.username || '',
      password: '',
      companyId: user.company?.idCompany || '',
    })
    setFormError('')
    setShowForm(true)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userId?.toString().includes(searchTerm)
  )

  const tableColumns = [
    { key: 'userId', label: 'ID' },
    { key: 'username', label: 'Usuario' },
    {
      key: 'company',
      label: 'Empresa',
      render: (_, user) => user.company?.companyName || 'N/A',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, user) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(user) }}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(user) }}
            className="text-red-600 hover:text-red-900 p-1"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total: {users.length} usuarios
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={20} className="mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search */}
      <Card padding="p-4">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por usuario o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent w-full outline-none"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={tableColumns} data={filteredUsers} loading={loading} />
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        onClose={() => {
          setShowForm(false)
          setSelectedUser(null)
          setFormValues(EMPTY_FORM)
          setFormError('')
        }}
        onConfirm={handleSubmitUser}
        confirmText={selectedUser ? 'Guardar Cambios' : 'Crear Usuario'}
        loading={isSaving}
        size="md"
      >
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {formError}
          </div>
        )}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmitUser() }}
          className="space-y-4"
        >
          <Input
            label="Usuario"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            required
          />

          {!selectedUser && (
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Empresa
            </label>
            <select
              name="companyId"
              value={formValues.companyId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Sin empresa asignada</option>
              {companies.map((c) => (
                <option key={c.idCompany} value={c.idCompany}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        title="Confirmar Eliminación"
        type="danger"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteUser}
        confirmText="Eliminar"
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro que deseas eliminar al usuario{' '}
          <strong>{deleteConfirm?.username}</strong>?
        </p>
      </Modal>
    </div>
  )
}
