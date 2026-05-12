// OrdersApp.jsx
import { useState, useEffect } from 'react'
import './Order.css'
import logo from '../../Images/Logo_SmartLogix.png'

function OrdersApp() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    product: '',
    quantity: 1,
    price: 0,
    status: 'pending',
    shippingAddress: ''
  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Simular carga de datos (conectar con tu API)
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // Reemplazar con tu endpoint real
      // const response = await fetch('http://localhost:8080/api/orders')
      // const data = await response.json()
      
      setOrders(mockData)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newOrder = {
      ...formData,
      id: editingOrder ? editingOrder.id : Date.now(),
      createdAt: editingOrder ? editingOrder.createdAt : new Date().toISOString()
    }

    try {
      if (editingOrder) {
        // Actualizar pedido existente
        // await fetch(`http://localhost:8080/api/orders/${editingOrder.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newOrder)
        // })
        setOrders(orders.map(order => order.id === editingOrder.id ? newOrder : order))
      } else {
        // Crear nuevo pedido
        // await fetch('http://localhost:8080/api/orders', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newOrder)
        // })
        setOrders([newOrder, ...orders])
      }
      closeModal()
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        // await fetch(`http://localhost:8080/api/orders/${id}`, {
        //   method: 'DELETE'
        // })
        setOrders(orders.filter(order => order.id !== id))
      } catch (error) {
        console.error('Error deleting order:', error)
      }
    }
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setFormData({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      product: order.product,
      quantity: order.quantity,
      price: order.price,
      status: order.status,
      shippingAddress: order.shippingAddress
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingOrder(null)
    setFormData({
      customerName: '',
      customerEmail: '',
      product: '',
      quantity: 1,
      price: 0,
      status: 'pending',
      shippingAddress: ''
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', class: 'status-pending' },
      processing: { label: 'Procesando', class: 'status-processing' },
      completed: { label: 'Completado', class: 'status-completed' },
      cancelled: { label: 'Cancelado', class: 'status-cancelled' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTotalValue = () => {
    return filteredOrders.reduce((total, order) => total + (order.price * order.quantity), 0)
  }

  return (
    <div className="orders-app">
      {/* Header */}
      <header className="orders-header">
        <div className="container">
          <div className="header-content">
            <img src={logo} alt="SmartLogix" className="logo" />
            <h1>Gestión de Pedidos</h1>
            <button className="btn-new-order" onClick={() => setShowModal(true)}>
              + Nuevo Pedido
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Pedidos</h3>
            <p className="stat-number">{filteredOrders.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Valor Total</h3>
            <p className="stat-number">${getTotalValue().toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pendientes</h3>
            <p className="stat-number">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </button>
          <button 
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Procesando
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completados
          </button>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por cliente o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        {loading ? (
          <div className="loading">Cargando pedidos...</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.customerName}</strong>
                      <small>{order.customerEmail}</small>
                    </div>
                  </td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>${order.price.toFixed(2)}</td>
                  <td>${(order.price * order.quantity).toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEdit(order)}>
                      ✏️
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(order.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
              <button className="close-modal" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email del Cliente *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Producto *</label>
                  <input
                    type="text"
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Cantidad *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio Unitario *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">Procesando</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Dirección de Envío *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingOrder ? 'Actualizar' : 'Crear'} Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersApp