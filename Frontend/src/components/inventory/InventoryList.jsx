import React, { useState } from 'react'
import { Plus, Search, Trash2, Edit2 } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Table from '../common/Table'
import EmptyState from '../common/EmptyState'
import Modal from '../common/Modal'
import { useFetch } from '../../hooks/useFetch'
import { useNotification } from '../../hooks/useNotification'
import { formatCurrency } from '../../utils/helpers'
import inventoryService from '../../services/inventory.service'

const EMPTY_FORM = { quantity: 0, value: 0, warehouseId: '', companyId: '', categoryId: '' }

export default function InventoryList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { addNotification } = useNotification()

  const { data: productsData, loading, refetch } = useFetch(() =>
    inventoryService.getAll()
  )
  const products = Array.isArray(productsData) ? productsData : []

  const handleDeleteProduct = async () => {
    try {
      await inventoryService.delete(deleteConfirm.productId)
      refetch()
      setDeleteConfirm(null)
      addNotification('Producto eliminado correctamente', 'success')
    } catch (error) {
      addNotification('Error al eliminar producto', 'error')
    }
  }

  const handleCreateProduct = async () => {
    if (!formData.warehouseId || !formData.companyId || !formData.categoryId) {
      addNotification('Completa todos los campos requeridos', 'warning')
      return
    }
    try {
      setIsSaving(true)
      // productId no se envía — el backend lo genera con MAX+1
      await inventoryService.create({
        quantity: Number(formData.quantity),
        value: Number(formData.value),
        warehouseId: Number(formData.warehouseId) || null,
        companyId: Number(formData.companyId) || null,
        categoryId: Number(formData.categoryId) || null,
      })
      refetch()
      setIsCreating(false)
      setFormData(EMPTY_FORM)
      addNotification('Producto creado correctamente', 'success')
    } catch (error) {
      addNotification(error.response?.data?.message || 'Error al crear producto', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true)
      await inventoryService.update(selectedProduct.productId, {
        quantity: Number(formData.quantity),
        value: Number(formData.value),
        warehouseId: selectedProduct.warehouseId,
        companyId: selectedProduct.companyId,
        categoryId: selectedProduct.categoryId,
      })
      refetch()
      setIsEditing(false)
      setSelectedProduct(null)
      addNotification('Producto actualizado correctamente', 'success')
    } catch (error) {
      addNotification(error.response?.data?.message || 'Error al actualizar producto', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Extraer IDs únicos válidos de los productos existentes en la BD
  const uniqueWarehouseIds = [...new Set(products.map(p => p.warehouseId).filter(Boolean))].sort((a, b) => a - b)
  const uniqueCompanyIds   = [...new Set(products.map(p => p.companyId).filter(Boolean))].sort((a, b) => a - b)
  const uniqueCategoryIds  = [...new Set(products.map(p => p.categoryId).filter(Boolean))].sort((a, b) => a - b)

  const filteredProducts = products.filter((p) =>
    p.productId?.toString().includes(searchTerm) ||
    p.categoryId?.toString().includes(searchTerm) ||
    p.warehouseId?.toString().includes(searchTerm)
  )

  const tableColumns = [
    {
      key: 'productId',
      label: 'ID',
      render: (val) => `#${val}`,
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      render: (val) => (
        <span className={`font-semibold ${val > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
          {val} unidades
        </span>
      ),
    },
    {
      key: 'value',
      label: 'Valor Unitario',
      render: (val) => formatCurrency(val),
    },
    {
      key: 'warehouseId',
      label: 'Bodega',
      render: (val) => `Bodega ${val}`,
    },
    {
      key: 'categoryId',
      label: 'Categoría',
      render: (val) => `Cat. ${val}`,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, product) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedProduct(product)
              setFormData({
                quantity: product.quantity,
                value: product.value,
              })
              setIsEditing(true)
            }}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Editar"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => setDeleteConfirm(product)}
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
          <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total: {products.length} productos
          </p>
        </div>
        <Button onClick={() => { setFormData(EMPTY_FORM); setIsCreating(true) }}>
          <Plus size={20} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Search */}
      <Card padding="p-4">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, categoría o bodega..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Cargando inventario...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="Sin productos"
            description="No hay productos en el inventario. Crea uno nuevo para empezar."
            action={
              <Button variant="primary" size="sm" onClick={() => { setFormData(EMPTY_FORM); setIsCreating(true) }}>
                <Plus size={16} className="mr-2" />
                Crear Producto
              </Button>
            }
          />
        ) : (
          <Table columns={tableColumns} data={filteredProducts} loading={loading} />
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isCreating}
        title="Nuevo Producto"
        onClose={() => { setIsCreating(false); setFormData(EMPTY_FORM) }}
        onConfirm={handleCreateProduct}
        confirmText="Crear Producto"
        loading={isSaving}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitario *</label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                min="0"
                placeholder="Ej: 9990"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bodega *</label>
              {uniqueWarehouseIds.length > 0 ? (
                <select
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Selecciona una bodega...</option>
                  {uniqueWarehouseIds.map(id => (
                    <option key={id} value={id}>Bodega {id}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="ID de bodega"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
              {uniqueCompanyIds.length > 0 ? (
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Selecciona una empresa...</option>
                  {uniqueCompanyIds.map(id => (
                    <option key={id} value={id}>Empresa {id}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="ID de empresa"
                />
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              {uniqueCategoryIds.length > 0 ? (
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Selecciona una categoría...</option>
                  {uniqueCategoryIds.map(id => (
                    <option key={id} value={id}>Categoría {id}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="ID de categoría"
                />
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        title={`Editar Producto #${selectedProduct?.productId}`}
        onClose={() => { setIsEditing(false); setSelectedProduct(null) }}
        onConfirm={handleSaveEdit}
        confirmText="Guardar Cambios"
        loading={isSaving}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Unitario</label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        title="Confirmar Eliminación"
        type="danger"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteProduct}
        confirmText="Eliminar"
      >
        <p>
          ¿Estás seguro que deseas eliminar el producto{' '}
          <strong>#{deleteConfirm?.productId}</strong>?
        </p>
      </Modal>
    </div>
  )
}
