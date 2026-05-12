import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../common/Card'
import Modal from '../common/Modal'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../hooks/useNotification'
import shipmentService from '../../services/shipment.service'

export default function Dashboard() {
  const { user } = useAuth()
  const { addNotification } = useNotification()

  const [data, setData] = useState({
    orders: [],
    users: [],
    products: [],
    shipments: [],
    companies: []
  })

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalShipments: 0,
    shipmentsDelivered: 0,
    shipmentsInTransit: 0
  })

  const [loading, setLoading] = useState(true)

  const [modals, setModals] = useState({
    shipment: false,
    order: false,
    user: false,
    product: false
  })

  const [editingId, setEditingId] = useState(null)

  const [forms, setForms] = useState({
    shipment: {
      orderId: '',
      originAddress: '',
      destinationAddress: '',
      currentLocation: '',
      shipmentWarehouse: '',
      shipmentWarehouseStartLocation: '',
      shipmentFinalDestination: '',
      status: 'CREATED'
    },
    order: {
      customerName: '',
      productName: '',
      quantity: 1,
      unitPrice: 1
    },
    user: {
      username: '',
      email: '',
      password: '',
      companyId: ''
    },
    product: {
      quantity: '',
      value: '',
      warehouseId: '',
      companyId: '',
      categoryId: ''
    }
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [ordersRes, usersRes, productsRes, shipmentsRes, companiesRes] = await Promise.all([
        axios.get('http://localhost:8081/api/orders').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/users').catch(() => ({ data: [] })),
        axios.get('http://localhost:8083/api/inventory/products').catch(() => ({ data: [] })),
        axios.get('http://localhost:8082/api/shipments').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/companies').catch(() => ({ data: [] }))
      ])

      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : []
      const users = Array.isArray(usersRes.data) ? usersRes.data : []
      const products = Array.isArray(productsRes.data) ? productsRes.data : []
      const shipments = Array.isArray(shipmentsRes.data) ? shipmentsRes.data : []
      const companies = Array.isArray(companiesRes.data) ? companiesRes.data : []

      setData({ orders, users, products, shipments, companies })

      const shipmentsDelivered = shipments.filter(s => s.status === 'DELIVERED').length
      const shipmentsInTransit = shipments.filter(s => s.status === 'IN_TRANSIT').length

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalShipments: shipments.length,
        shipmentsDelivered,
        shipmentsInTransit
      })
    } catch (err) {
      console.error('Error:', err)
      addNotification('Error al cargar los datos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleShipmentSubmit = async () => {
    if (!forms.shipment.orderId) {
      addNotification('Debes seleccionar una orden', 'warning')
      return
    }
    if (!forms.shipment.destinationAddress?.trim()) {
      addNotification('La dirección de destino es requerida', 'warning')
      return
    }
    try {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      const payload = {
        orderId: Number(forms.shipment.orderId),
        destinationAddress: forms.shipment.destinationAddress.trim(),
        originAddress: forms.shipment.originAddress?.trim() || null,
        currentLocation: forms.shipment.currentLocation?.trim() || null,
        shipmentWarehouse: forms.shipment.shipmentWarehouse ? Number(forms.shipment.shipmentWarehouse) : null,
        shipmentWarehouseStartLocation: forms.shipment.shipmentWarehouseStartLocation ? Number(forms.shipment.shipmentWarehouseStartLocation) : null,
        shipmentFinalDestination: forms.shipment.shipmentFinalDestination ? Number(forms.shipment.shipmentFinalDestination) : null,
      }
      if (editingId) {
        await shipmentService.update(editingId, payload)
        addNotification(`Envío #${editingId} actualizado a las ${now}`, 'success')
      } else {
        await shipmentService.create(payload)
        addNotification(`Nuevo envío creado a las ${now}`, 'success')
      }
      closeModal('shipment')
      fetchData()
    } catch (err) {
      console.error('Error envío:', err)
      const msg = err.response?.data?.message
        || (typeof err.response?.data === 'string' ? err.response.data : null)
        || `Error ${err.response?.status || 'de conexión'}: no se pudo guardar el envío`
      addNotification(msg, 'error')
    }
  }

  const handleDeleteShipment = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este envío?')) {
      try {
        await axios.delete(`http://localhost:8082/api/shipments/${id}`)
        const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        addNotification(`Envío eliminado a las ${now}`, 'success')
        fetchData()
      } catch (err) {
        addNotification('Error al eliminar el envío', 'error')
      }
    }
  }

  const handleChangeShipmentStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8082/api/shipments/${id}/status?status=${newStatus}`)
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      const statusText = newStatus === 'DELIVERED' ? 'entregado' : newStatus === 'IN_TRANSIT' ? 'en tránsito' : 'creado'
      addNotification(`Envío marcado como ${statusText} a las ${now}`, 'success')
      fetchData()
    } catch (err) {
      addNotification('Error al cambiar el estado', 'error')
    }
  }

  const handleOrderSubmit = async () => {
    try {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      if (editingId) {
        await axios.put(`http://localhost:8081/api/orders/${editingId}`, forms.order)
        addNotification(`Orden #${editingId} editada a las ${now}`, 'success')
      } else {
        const autoCustomerId = 'CLI-' + Date.now().toString().slice(-6)
        await axios.post('http://localhost:8081/api/orders', {
          customerId: autoCustomerId,
          customerName: forms.order.customerName,
          items: [{
            productName: forms.order.productName,
            quantity: Number(forms.order.quantity),
            unitPrice: Number(forms.order.unitPrice),
          }],
        })
        addNotification(`Nueva orden creada a las ${now}`, 'success')
      }
      closeModal('order')
      fetchData()
    } catch (err) {
      console.error('Error:', err)
      addNotification(err.response?.data?.message || 'Error al guardar la orden', 'error')
    }
  }

  const handleDeleteOrder = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta orden?')) {
      try {
        await axios.delete(`http://localhost:8081/api/orders/${id}`)
        const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        addNotification(`Orden eliminada a las ${now}`, 'success')
        fetchData()
      } catch (err) {
        addNotification('Error al eliminar la orden', 'error')
      }
    }
  }

  const handleUserSubmit = async () => {
    if (!forms.user.username || !forms.user.email) {
      addNotification('Usuario y email son requeridos', 'warning')
      return
    }
    try {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      const payload = {
        username: forms.user.username,
        email: forms.user.email,
        password: forms.user.password || undefined,
        company: forms.user.companyId ? { idCompany: Number(forms.user.companyId) } : null
      }
      if (editingId) {
        await axios.put(`http://localhost:8080/api/users/${editingId}`, payload)
        addNotification(`Usuario ${forms.user.username} editado a las ${now}`, 'success')
      } else {
        await axios.post('http://localhost:8080/api/users', payload)
        addNotification(`Nuevo usuario ${forms.user.username} creado a las ${now}`, 'success')
      }
      closeModal('user')
      fetchData()
    } catch (err) {
      console.error('Error:', err)
      addNotification(err.response?.data?.message || 'Error al guardar el usuario', 'error')
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`)
        const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        addNotification(`Usuario eliminado a las ${now}`, 'success')
        fetchData()
      } catch (err) {
        addNotification('Error al eliminar el usuario', 'error')
      }
    }
  }

  const handleProductSubmit = async () => {
    try {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      // productId no se envía en creación — el backend lo genera con MAX+1
      const payload = {
        quantity: Number(forms.product.quantity),
        value: Number(forms.product.value),
        warehouseId: Number(forms.product.warehouseId) || null,
        companyId: Number(forms.product.companyId) || null,
        categoryId: Number(forms.product.categoryId) || null,
      }
      if (editingId) {
        await axios.put(`http://localhost:8083/api/inventory/products/${editingId}`, payload)
        addNotification(`Producto actualizado a las ${now}`, 'success')
      } else {
        await axios.post('http://localhost:8083/api/inventory/products', payload)
        addNotification(`Nuevo producto creado a las ${now}`, 'success')
      }
      closeModal('product')
      fetchData()
    } catch (err) {
      console.error('Error:', err)
      addNotification(err.response?.data?.message || 'Error al guardar el producto', 'error')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:8083/api/inventory/products/${id}`)
        const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        addNotification(`Producto eliminado a las ${now}`, 'success')
        fetchData()
      } catch (err) {
        addNotification('Error al eliminar el producto', 'error')
      }
    }
  }

  const openModal = (type, item = null) => {
    if (item) {
      setEditingId(item.shipmentId || item.id || item.userId || item.productId)
      if (type === 'user') {
        setForms(prev => ({
          ...prev,
          user: {
            username: item.username || '',
            email: item.email || '',
            password: '',
            companyId: item.company?.idCompany ? String(item.company.idCompany) : ''
          }
        }))
      } else {
        setForms(prev => ({ ...prev, [type]: item }))
      }
    } else {
      setEditingId(null)
      const defaultForms = {
        shipment: { orderId: '', originAddress: '', destinationAddress: '', currentLocation: '', status: 'CREATED' },
        order: { customerName: '', productName: '', quantity: 1, unitPrice: 1 },
        user: { username: '', email: '', password: '', companyId: '' },
        product: { quantity: '', value: '', warehouseId: '', companyId: '', categoryId: '' }
      }
      setForms(prev => ({ ...prev, [type]: defaultForms[type] }))
    }
    setModals(prev => ({ ...prev, [type]: true }))
  }

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }))
    setEditingId(null)
  }

  const handleFormChange = (e, type) => {
    const { name, value } = e.target
    setForms(prev => ({ ...prev, [type]: { ...prev[type], [name]: value } }))
  }

  const StatCard = ({ label, value, color = 'blue' }) => {
    const colorClass = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200'
    }[color]

    return (
      <Card className={`text-center border ${colorClass}`}>
        <p className="text-gray-600 text-sm mb-2">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </Card>
    )
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12"><p className="text-gray-600">Cargando...</p></div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido, {user?.username}</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition">
          ↻ Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <StatCard label="Órdenes" value={stats.totalOrders} color="green" />
          <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">OPERATIVO</span>
        </div>
        <div className="relative">
          <StatCard label="Productos" value={stats.totalProducts} color="blue" />
          <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">OPERATIVO</span>
        </div>
        <div className="relative">
          <StatCard label="Usuarios" value={stats.totalUsers} color="orange" />
          <span className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">OPERATIVO</span>
        </div>
        <div className="relative">
          <StatCard label="Envíos" value={stats.totalShipments} color="purple" />
          <span className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">OPERATIVO</span>
        </div>
      </div>

      <Card title="Órdenes" subtitle={`Total: ${data.orders.length}`}>
        <button onClick={() => openModal('order')} className="mb-4 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 font-medium">
          + Nueva Orden
        </button>
        {data.orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No hay órdenes registradas aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Cliente</th>
                  <th className="px-4 py-2 text-left font-semibold">Monto</th>
                  <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{order.id}</td>
                    <td className="px-4 py-2">{order.customerName}</td>
                    <td className="px-4 py-2">${parseFloat(order.totalAmount).toFixed(2)}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => openModal('order', order)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</button>
                      <button onClick={() => handleDeleteOrder(order.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Productos" subtitle={`Total: ${data.products.length}`}>
        <button onClick={() => openModal('product')} className="mb-4 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium">
          + Nuevo Producto
        </button>
        {data.products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No hay productos registrados aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-2 text-left font-semibold">Cantidad</th>
                  <th className="px-4 py-2 text-left font-semibold">Valor</th>
                  <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product.productId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{product.productId}</td>
                    <td className="px-4 py-2">{product.productName}</td>
                    <td className="px-4 py-2">{product.quantity}</td>
                    <td className="px-4 py-2">${parseFloat(product.value).toFixed(2)}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => openModal('product', product)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</button>
                      <button onClick={() => handleDeleteProduct(product.productId)} className="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Usuarios" subtitle={`Total: ${data.users.length}`}>
        <button onClick={() => openModal('user')} className="mb-4 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 font-medium">
          + Nuevo Usuario
        </button>
        {data.users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No hay usuarios registrados aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Usuario</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Empresa</th>
                  <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((usuario) => (
                  <tr key={usuario.userId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{usuario.username}</td>
                    <td className="px-4 py-2 text-xs">{usuario.email}</td>
                    <td className="px-4 py-2 text-xs">{usuario.company?.companyName || '-'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => openModal('user', usuario)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</button>
                      <button onClick={() => handleDeleteUser(usuario.userId)} className="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Envíos" subtitle={`Total: ${data.shipments.length}`}>
        <button onClick={() => openModal('shipment')} className="mb-4 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 font-medium">
          + Nuevo Envío
        </button>
        {data.shipments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No hay envíos registrados aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Orden</th>
                  <th className="px-4 py-2 text-left font-semibold">Estado</th>
                  <th className="px-4 py-2 text-left font-semibold">Destino</th>
                  <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.shipments.map((shipment) => (
                  <tr key={shipment.shipmentId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{shipment.shipmentId}</td>
                    <td className="px-4 py-2">#{shipment.orderId}</td>
                    <td className="px-4 py-2">
                      <select value={shipment.status} onChange={(e) => handleChangeShipmentStatus(shipment.shipmentId, e.target.value)} className="text-xs px-2 py-1 border rounded bg-white">
                        <option value="CREATED">Creado</option>
                        <option value="IN_TRANSIT">En Tránsito</option>
                        <option value="DELIVERED">Entregado</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-xs">{shipment.destinationAddress}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => openModal('shipment', shipment)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</button>
                      <button onClick={() => handleDeleteShipment(shipment.shipmentId)} className="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={modals.shipment} onClose={() => closeModal('shipment')} title={editingId ? 'Editar Envío' : 'Nuevo Envío'} confirmText={editingId ? 'Guardar' : 'Crear'} onConfirm={handleShipmentSubmit}>
        {(() => {
          const regiones = [
            'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
            'Valparaíso', 'Metropolitana de Santiago', "O'Higgins",
            'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos',
            'Los Lagos', 'Aysén', 'Magallanes'
          ]
          const cls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white'
          const lbl = 'block text-xs font-semibold text-gray-600 mb-1'
          const selOrder = data.orders.find(o => String(o.id) === String(forms.shipment.orderId))
          const warehouseIds = [...new Set(data.products.map(p => p.warehouseId).filter(Boolean))].sort((a, b) => a - b)

          return (
            <div className="space-y-3">

              {/* Orden */}
              <div>
                <label className={lbl}>Orden *</label>
                <select name="orderId" value={forms.shipment.orderId} onChange={(e) => handleFormChange(e, 'shipment')} className={cls}>
                  <option value="">Selecciona una orden</option>
                  {data.orders.map((o) => (
                    <option key={o.id} value={o.id}>#{o.id} — {o.customerName}</option>
                  ))}
                </select>
                {selOrder && <p className="text-xs text-purple-600 mt-1">Cliente: {selOrder.customerName}</p>}
              </div>

              {/* Bodega de despacho */}
              <div>
                <label className={lbl}>Bodega de despacho</label>
                {warehouseIds.length > 0 ? (
                  <select name="shipmentWarehouse" value={forms.shipment.shipmentWarehouse} onChange={(e) => handleFormChange(e, 'shipment')} className={cls}>
                    <option value="">Selecciona una bodega</option>
                    {warehouseIds.map(id => <option key={id} value={id}>Bodega {id}</option>)}
                  </select>
                ) : (
                  <input type="number" name="shipmentWarehouse" placeholder="ID de bodega" value={forms.shipment.shipmentWarehouse} onChange={(e) => handleFormChange(e, 'shipment')} className={cls} />
                )}
              </div>

              {/* Origen y Destino */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Región origen</label>
                  <select value={forms.shipment._originRegion || ''} onChange={(e) => {
                    const region = e.target.value
                    const detail = forms.shipment._originDetail || ''
                    setForms(prev => ({ ...prev, shipment: { ...prev.shipment, _originRegion: region, originAddress: detail ? `${detail}, ${region}` : region } }))
                  }} className={cls}>
                    <option value="">— Selecciona —</option>
                    {regiones.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Región destino *</label>
                  <select value={forms.shipment._destRegion || ''} onChange={(e) => {
                    const region = e.target.value
                    const detail = forms.shipment._destDetail || ''
                    setForms(prev => ({ ...prev, shipment: { ...prev.shipment, _destRegion: region, destinationAddress: detail ? `${detail}, ${region}` : region } }))
                  }} className={cls}>
                    <option value="">— Selecciona —</option>
                    {regiones.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Calle y número (origen)</label>
                  <input type="text" placeholder="Ej: Av. Central 123" value={forms.shipment._originDetail || ''} onChange={(e) => {
                    const detail = e.target.value
                    const region = forms.shipment._originRegion || ''
                    setForms(prev => ({ ...prev, shipment: { ...prev.shipment, _originDetail: detail, originAddress: detail ? `${detail}, ${region}` : region } }))
                  }} className={cls} />
                </div>
                <div>
                  <label className={lbl}>Calle y número (destino)</label>
                  <input type="text" placeholder="Ej: Calle Los Pinos 45" value={forms.shipment._destDetail || ''} onChange={(e) => {
                    const detail = e.target.value
                    const region = forms.shipment._destRegion || ''
                    setForms(prev => ({ ...prev, shipment: { ...prev.shipment, _destDetail: detail, destinationAddress: detail ? `${detail}, ${region}` : region } }))
                  }} className={cls} />
                </div>
              </div>

              {/* Ubicación actual */}
              <div>
                <label className={lbl}>Ubicación actual (opcional)</label>
                <select value={forms.shipment.currentLocation || ''} onChange={(e) => setForms(prev => ({ ...prev, shipment: { ...prev.shipment, currentLocation: e.target.value } }))} className={cls}>
                  <option value="">¿Dónde está el paquete ahora?</option>
                  {regiones.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

            </div>
          )
        })()}
      </Modal>

      <Modal isOpen={modals.order} onClose={() => closeModal('order')} title={editingId ? 'Editar Orden' : 'Nueva Orden'} confirmText={editingId ? 'Guardar Cambios' : 'Crear Orden'} onConfirm={handleOrderSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nombre del Cliente <span className="text-red-500">*</span></label>
            <input type="text" name="customerName" placeholder="Ej: Juan Pérez" value={forms.order.customerName} onChange={(e) => handleFormChange(e, 'order')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nombre del Producto <span className="text-red-500">*</span></label>
            <input type="text" name="productName" placeholder="Ej: Bolainas Premium" value={forms.order.productName} onChange={(e) => handleFormChange(e, 'order')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Cantidad</label>
              <input type="number" name="quantity" min="1" value={forms.order.quantity} onChange={(e) => handleFormChange(e, 'order')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Precio Unitario</label>
              <input type="number" name="unitPrice" min="0" step="0.01" value={forms.order.unitPrice} onChange={(e) => handleFormChange(e, 'order')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">Total estimado</span>
            <span className="text-xl font-bold text-green-700">${(Number(forms.order.quantity) * Number(forms.order.unitPrice)).toFixed(2)}</span>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.user} onClose={() => closeModal('user')} title={editingId ? 'Editar Usuario' : 'Crear Usuario'} confirmText={editingId ? 'Guardar' : 'Crear'} onConfirm={handleUserSubmit}>
        <form className="space-y-4">
          <input type="text" name="username" placeholder="Usuario *" value={forms.user.username} onChange={(e) => handleFormChange(e, 'user')} className="w-full px-3 py-2 border rounded text-sm" required />
          <input type="email" name="email" placeholder="Email *" value={forms.user.email} onChange={(e) => handleFormChange(e, 'user')} className="w-full px-3 py-2 border rounded text-sm" required />
          {!editingId && <input type="password" name="password" placeholder="Contraseña" value={forms.user.password} onChange={(e) => handleFormChange(e, 'user')} className="w-full px-3 py-2 border rounded text-sm" />}
          <select
            name="companyId"
            value={forms.user.companyId}
            onChange={(e) => handleFormChange(e, 'user')}
            className="w-full px-3 py-2 border rounded text-sm"
          >
            <option value="">Sin empresa (opcional)</option>
            {data.companies.map(c => (
              <option key={c.idCompany} value={c.idCompany}>
                {c.companyName} (ID: {c.idCompany})
              </option>
            ))}
          </select>
        </form>
      </Modal>

      <Modal isOpen={modals.product} onClose={() => closeModal('product')} title={editingId ? 'Editar Producto' : 'Crear Producto'} confirmText={editingId ? 'Guardar' : 'Crear'} onConfirm={handleProductSubmit}>
        {(() => {
          const warehouseIds = [...new Set(data.products.map(p => p.warehouseId).filter(Boolean))].sort((a, b) => a - b)
          const companyIds   = [...new Set(data.products.map(p => p.companyId).filter(Boolean))].sort((a, b) => a - b)
          const categoryIds  = [...new Set(data.products.map(p => p.categoryId).filter(Boolean))].sort((a, b) => a - b)
          const selectClass  = "w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          const inputClass   = selectClass
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" name="quantity" placeholder="Cantidad *" value={forms.product.quantity} onChange={(e) => handleFormChange(e, 'product')} className={inputClass} />
                <input type="number" name="value" placeholder="Valor Unitario *" step="0.01" value={forms.product.value} onChange={(e) => handleFormChange(e, 'product')} className={inputClass} />
              </div>
              {warehouseIds.length > 0 ? (
                <select name="warehouseId" value={forms.product.warehouseId} onChange={(e) => handleFormChange(e, 'product')} className={selectClass}>
                  <option value="">Selecciona bodega *</option>
                  {warehouseIds.map(id => <option key={id} value={id}>Bodega {id}</option>)}
                </select>
              ) : (
                <input type="number" name="warehouseId" placeholder="ID Bodega *" value={forms.product.warehouseId} onChange={(e) => handleFormChange(e, 'product')} className={inputClass} />
              )}
              {companyIds.length > 0 ? (
                <select name="companyId" value={forms.product.companyId} onChange={(e) => handleFormChange(e, 'product')} className={selectClass}>
                  <option value="">Selecciona empresa *</option>
                  {companyIds.map(id => <option key={id} value={id}>Empresa {id}</option>)}
                </select>
              ) : (
                <input type="number" name="companyId" placeholder="ID Empresa *" value={forms.product.companyId} onChange={(e) => handleFormChange(e, 'product')} className={inputClass} />
              )}
              {categoryIds.length > 0 ? (
                <select name="categoryId" value={forms.product.categoryId} onChange={(e) => handleFormChange(e, 'product')} className={selectClass}>
                  <option value="">Selecciona categoría *</option>
                  {categoryIds.map(id => <option key={id} value={id}>Categoría {id}</option>)}
                </select>
              ) : (
                <input type="number" name="categoryId" placeholder="ID Categoría *" value={forms.product.categoryId} onChange={(e) => handleFormChange(e, 'product')} className={inputClass} />
              )}
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
