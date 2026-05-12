import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Package, ShoppingCart, Truck, TrendingUp } from 'lucide-react'
import Card from '../common/Card'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency } from '../../utils/helpers'

const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
  }
  const c = colors[color] || colors.blue
  return (
    <div className={`rounded-xl border p-5 flex items-center gap-4 ${c.bg} ${c.border}`}>
      <div className={`p-3 rounded-lg bg-white shadow-sm ${c.icon}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function CompanyDashboard() {
  const { user, companyId } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders]     = useState([])
  const [shipments, setShipments] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, ordersRes, shipRes] = await Promise.all([
        axios.get('http://localhost:8083/api/inventory/products').catch(() => ({ data: [] })),
        axios.get('http://localhost:8081/api/orders').catch(() => ({ data: [] })),
        axios.get('http://localhost:8082/api/shipments').catch(() => ({ data: [] })),
      ])

      const allProducts = Array.isArray(prodRes.data) ? prodRes.data : []
      // Filtrar inventario por empresa del usuario
      const myProducts = companyId
        ? allProducts.filter(p => String(p.companyId) === String(companyId))
        : allProducts

      setProducts(myProducts)
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
      setShipments(Array.isArray(shipRes.data) ? shipRes.data : [])
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const totalStock    = products.reduce((sum, p) => sum + (p.quantity || 0), 0)
  const totalValue    = products.reduce((sum, p) => sum + ((p.value || 0) * (p.quantity || 0)), 0)
  const activeShipments = shipments.filter(s => s.status === 'IN_TRANSIT').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {user?.username}</h1>
          <p className="text-gray-500 mt-1">{user?.company} — resumen de operaciones</p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition font-medium"
        >
          ↻ Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package}     label="Productos en stock" value={products.length}   sub={`${totalStock} unidades totales`} color="blue" />
        <StatCard icon={TrendingUp}  label="Valor del inventario" value={formatCurrency(totalValue)} color="green" />
        <StatCard icon={ShoppingCart} label="Pedidos totales"    value={orders.length}    sub="en el sistema"                    color="orange" />
        <StatCard icon={Truck}       label="Envíos en tránsito"  value={activeShipments}  sub={`${shipments.length} envíos totales`} color="purple" />
      </div>

      {/* Mi inventario */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Mi Inventario</h2>
          <span className="text-sm text-gray-500">{products.length} productos</span>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Package size={40} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay productos registrados para tu empresa</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Categoría</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Cantidad</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Valor Unit.</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Bodega</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-700">#{p.productId}</td>
                    <td className="px-4 py-2 text-gray-600">Cat. {p.categoryId}</td>
                    <td className="px-4 py-2">
                      <span className={`font-semibold ${p.quantity > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {p.quantity} uds.
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(p.value)}</td>
                    <td className="px-4 py-2 text-gray-600">Bodega {p.warehouseId}</td>
                    <td className="px-4 py-2 font-semibold text-blue-700">{formatCurrency((p.value || 0) * (p.quantity || 0))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-right font-semibold text-gray-700">Total inventario:</td>
                  <td className="px-4 py-2 font-bold text-blue-700">{formatCurrency(totalValue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {/* Últimos pedidos */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Pedidos Recientes</h2>
          <span className="text-sm text-gray-500">{orders.length} pedidos</span>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay pedidos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Cliente</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Monto</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{o.id}</td>
                    <td className="px-4 py-2">{o.customerName}</td>
                    <td className="px-4 py-2 font-semibold">{formatCurrency(o.totalAmount)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        o.status === 'SHIPPED'    ? 'bg-blue-100 text-blue-800' :
                        o.status === 'DELIVERED'  ? 'bg-green-100 text-green-800' :
                        o.status === 'CANCELLED'  ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                      }`}>
                        {o.status === 'PENDING'   ? 'Pendiente' :
                         o.status === 'PROCESSED' ? 'Procesado' :
                         o.status === 'SHIPPED'   ? 'Enviado'   :
                         o.status === 'DELIVERED' ? 'Entregado' :
                         o.status === 'CANCELLED' ? 'Cancelado' : o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
