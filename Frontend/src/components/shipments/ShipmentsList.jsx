import React, { useState } from 'react'
import { Plus, Truck, MapPin, Trash2 } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import Modal from '../common/Modal'
import { useFetch } from '../../hooks/useFetch'
import { useNotification } from '../../hooks/useNotification'
import shipmentService from '../../services/shipment.service'
import orderService from '../../services/order.service'

const STATUS_CONFIG = {
  CREATED:    { bg: 'bg-gray-100',   text: 'text-gray-800',   label: 'Creado' },
  PENDING:    { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
  IN_TRANSIT: { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'En Tránsito' },
  DELIVERED:  { bg: 'bg-green-100',  text: 'text-green-800',  label: 'Entregado' },
  CANCELLED:  { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Cancelado' },
}

const ShipmentStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.CREATED
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

const EMPTY_FORM = { orderId: '', destinationAddress: '', originAddress: '', currentLocation: '' }

export default function ShipmentsList() {
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const { addNotification } = useNotification()

  const { data: shipmentsData, loading, refetch } = useFetch(() =>
    shipmentService.getAll()
  )
  const shipments = Array.isArray(shipmentsData) ? shipmentsData : []

  const { data: ordersData } = useFetch(() => orderService.getAll())
  const orders = Array.isArray(ordersData) ? ordersData : []

  const handleCreateShipment = async () => {
    if (!formData.orderId || !formData.destinationAddress) {
      addNotification('ID de Orden y Dirección de Destino son requeridos', 'warning')
      return
    }
    try {
      setIsSaving(true)
      await shipmentService.create({
        orderId: Number(formData.orderId),
        destinationAddress: formData.destinationAddress,
        originAddress: formData.originAddress || null,
        currentLocation: formData.currentLocation || null,
      })
      refetch()
      setIsCreating(false)
      setFormData(EMPTY_FORM)
      addNotification('Envío creado correctamente', 'success')
    } catch (error) {
      addNotification(error.response?.data?.message || 'Error al crear envío', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteShipment = async () => {
    try {
      await shipmentService.delete(deleteConfirm.shipmentId)
      refetch()
      setDeleteConfirm(null)
      addNotification('Envío eliminado correctamente', 'success')
    } catch (error) {
      addNotification('Error al eliminar envío', 'error')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Envíos</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total: {shipments.length} envíos
          </p>
        </div>
        <Button onClick={() => { setFormData(EMPTY_FORM); setIsCreating(true) }}>
          <Plus size={20} className="mr-2" />
          Nuevo Envío
        </Button>
      </div>

      {/* Shipments Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Cargando envíos...</p>
        </div>
      ) : shipments.length === 0 ? (
        <Card>
          <EmptyState
            icon={Truck}
            title="Sin envíos"
            description="No hay envíos registrados. Crea uno nuevo para comenzar."
            action={
              <Button variant="primary" size="sm" onClick={() => { setFormData(EMPTY_FORM); setIsCreating(true) }}>
                <Plus size={16} className="mr-2" />
                Crear Envío
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <Card key={shipment.shipmentId} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Envío #{shipment.shipmentId}</p>
                    <p className="text-sm font-semibold text-gray-700">Orden #{shipment.orderId}</p>
                  </div>
                  <ShipmentStatusBadge status={shipment.status} />
                </div>

                <div className="space-y-2 text-sm">
                  {shipment.originAddress && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">Desde: {shipment.originAddress}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">Hacia: {shipment.destinationAddress}</span>
                  </div>
                  {shipment.currentLocation && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <Truck size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">Ubicación: {shipment.currentLocation}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {formatDate(shipment.createdDate)}
                  </p>
                  <button
                    onClick={() => setDeleteConfirm(shipment)}
                    className="text-red-500 hover:text-red-700 p-1 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreating}
        title="Nuevo Envío"
        onClose={() => { setIsCreating(false); setFormData(EMPTY_FORM) }}
        onConfirm={handleCreateShipment}
        confirmText="Crear Envío"
        loading={isSaving}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orden *</label>
            <select
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecciona una orden...</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} — {o.customerName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Destino *</label>
            <input
              type="text"
              value={formData.destinationAddress}
              onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ej: Av. Providencia 1234, Santiago"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Origen</label>
            <input
              type="text"
              value={formData.originAddress}
              onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ej: Bodega Central, Maipú (opcional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Actual</label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ej: Centro de distribución (opcional)"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        title="Confirmar Eliminación"
        type="danger"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteShipment}
        confirmText="Eliminar"
      >
        <p>
          ¿Estás seguro que deseas eliminar el envío{' '}
          <strong>#{deleteConfirm?.shipmentId}</strong> (Orden #{deleteConfirm?.orderId})?
        </p>
      </Modal>
    </div>
  )
}
