import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import Logo from '../../Images/Logo_SmartLogix.png'
import axios from 'axios'

const MenuItem = ({ icon: Icon, label, path, isActive, badge }) => (
  <Link
    to={path}
    className={clsx(
      'flex items-center justify-between px-4 py-3 rounded-lg transition-all',
      isActive
        ? 'bg-blue-600 text-white font-semibold shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
    )}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </Link>
)

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const [pendingOrders, setPendingOrders] = useState(0)

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/orders')
        const orders = Array.isArray(res.data) ? res.data : []
        const pending = orders.filter(o =>
          (o.status || 'PENDING') === 'PENDING'
        ).length
        setPendingOrders(pending)
      } catch {
        // Si el servicio no responde, no muestra badge
        setPendingOrders(0)
      }
    }

    fetchPendingOrders()

    // Refresca cada 60 segundos
    const interval = setInterval(fetchPendingOrders, 60000)
    return () => clearInterval(interval)
  }, [location.pathname])

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard' },
    { icon: Users,           label: 'Usuarios',   path: '/users' },
    { icon: Package,         label: 'Inventario', path: '/inventory' },
    { icon: ShoppingCart,    label: 'Pedidos',    path: '/orders', badge: pendingOrders },
    { icon: Truck,           label: 'Envíos',     path: '/shipments' },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none z-50 lg:z-0 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header móvil */}
        <div className="flex justify-between items-center p-6 border-b lg:hidden">
          <h2 className="text-xl font-bold text-blue-600">SmartLogix</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden lg:flex items-center justify-center p-6 border-b bg-gray-900 rounded-b-lg">
          <img src={Logo} alt="SmartLogix" className="h-12 w-auto" />
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t space-y-2 bg-white">
          <MenuItem
            icon={Settings}
            label="Configuración"
            path="/settings"
            isActive={location.pathname === '/settings'}
          />
          <div className="text-xs text-gray-500 px-4 py-2">
            © 2026 SmartLogix v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
