import React, { useState } from 'react'
import { Plus, Eye, Trash2, Search } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Table from '../common/Table'
import Modal from '../common/Modal'
import { useFetch } from '../../hooks/useFetch'
import { useNotification } from '../../hooks/useNotification'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/constants'
import orderService from '../../services/order.service'

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ORDER_STATUS_COLORS[status]}`}>
    {ORDER_STATUS_LABELS[status] || status}
  </span>
)

const EMPTY_ORDER = {
  customerName: '',
  productName: '',
  quantity: 1,
  unitPrice: 1,
}

export default function OrdersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newOrder, setNewOrder] = useState(EMPTY_ORDER)

  const { addNotification } = useNotification()

  const { data: ordersData, loading, refetch } = useFetch(() =>
    orderService.getAll()
  )
  const orders = Array.isArray(ordersData) ? ordersData : []

  const handleDeleteOrder = async () => {
    try {
      await orderService.delete(deleteConfirm.id)
      refetch()
      setDeleteConfirm(null)
      addNotification('Pedido eliminado correctamente', 'success')
    } catch (error) {
      addNotification('Error al eliminar pedido', 'error')
    }
  }

  const handleCreateOrder = async () => {
    if (!newOrder.customerName || !newOrder.productName) {
      addNotification('Completa todos los campos requeridos', 'warning')
      return
    }
    if (Number(newOrder.quantity) < 1) {
      addNotification('La cantidad debe ser al menos 1', 'warning')
      return
    }
    if (Number(newOrder.unitPrice) <= 0) {
      addNotification('El precio unitario debe ser mayor a 0', 'warning')
      return
    }
    try {
      setIsSaving(true)
      const autoCustomerId = 'CLI-' + Date.now().toString().slice(-6)
      await orderService.create({
        customerId: autoCustomerId,
        customerName: newOrder.customerName,
        items: [
          {
            productName: newOrder.productName,
            quantity: Number(newOrder.quantity),
            unitPrice: Number(newOrder.unitPrice),
          },
        ],
      })
      refetch()
      setIsCreating(false)
      setNewOrder(EMPTY_ORDER)
      addNotification('Pedido creado correctamente', 'success')
    } catch (error) {
      addNotification(error.response?.data?.message || 'Error al crear pedido', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Filtro por estado en frontend (el backend no tiene endpoint /status/{status})
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerId?.toString().includes(searchTerm) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    const orderStatus = o.status || 'PENDING'
    const matchesStatus = statusFilter ? orderStatus === statusFilter : true
    return matchesSearch && matchesStatus
  })

  const tableColumns = [
    { key: 'id', label: 'ID', render: (val) => `#${val}` },
    {
      key: 'customerName',
      label: 'Cliente',
      render: (_, order) => (
        <div>
          <p className="font-medium">{order.customerName}</p>
          <p className="text-xs text-gray-500">{order.customerId}</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Monto',
      render: (val) => formatCurrency(val),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'orderDate',
      label: 'Fecha',
      render: (date) => formatDate(date),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, order) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Ver detalles"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(order) }}
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
          <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total: {orders.length} pedidos
          </p>
        </div>
        <Button onClick={() => { setNewOrder(EMPTY_ORDER); setIsCreating(true) }}>
          <Plus size={20} className="mr-2" />
          Nuevo Pedido
        </Button>
      </div>

      {/* Filters */}
      <Card padding="p-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="PROCESSED">Procesado</option>
            <option value="SHIPPED">Enviado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={tableColumns} data={filteredOrders} loading={loading} />
      </Card>

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreating}
        title="Nuevo Pedido"
        onClose={() => { setIsCreating(false); setNewOrder(EMPTY_ORDER) }}
        onConfirm={handleCreateOrder}
        confirmText="Crear Pedido"
        loading={isSaving}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Datos del Cliente</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente *</label>
            <input
              type="text"
              value={newOrder.customerName}
              onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide pt-2">Producto</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Producto *</label>
              <input
                type="text"
                value={newOrder.productName}
                onChange={(e) => setNewOrder({ ...newOrder, productName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ej: Laptop Dell"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
              <input
                type="number"
                min="1"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newOrder.unitPrice}
                onChange={(e) => setNewOrder({ ...newOrder, unitPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ej: 299990"
                min="1"
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Total estimado:</span>
            <span className="font-bold text-blue-600">
              {formatCurrency(Number(newOrder.quantity) * Number(newOrder.unitPrice))}
            </span>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        title="Detalles del Pedido"
        onClose={() => setSelectedOrder(null)}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID Pedido</p>
                <p className="text-lg font-semibold">#{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="text-lg font-semibold">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Cliente</p>
                <p className="text-lg font-semibold">{selectedOrder.customerId}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Productos</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <p className="font-semibold">Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(selectedOrder.totalAmount)}
              </p>
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
        onConfirm={handleDeleteOrder}
        confirmText="Eliminar"
      >
        <p>
          ¿Estás seguro que deseas eliminar el pedido{' '}
          <strong>#{deleteConfirm?.id}</strong>?
        </p>
      </Modal>
    </div>
  )
}
