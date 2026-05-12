import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Truck, LogOut, X, Menu } from 'lucide-react'
import clsx from 'clsx'
import Logo from '../../Images/Logo_SmartLogix.png'
import { useAuth } from '../../hooks/useAuth'

const MenuItem = ({ icon: Icon, label, path, isActive }) => (
  <Link
    to={path}
    className={clsx(
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
      isActive
        ? 'bg-blue-600 text-white font-semibold shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
    )}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
)

function CompanySidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Inicio',     path: '/company/dashboard' },
    { icon: Package,         label: 'Inventario', path: '/company/inventory' },
    { icon: ShoppingCart,    label: 'Pedidos',    path: '/company/orders' },
    { icon: Truck,           label: 'Envíos',     path: '/company/shipments' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/company-login')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40" onClick={onClose} />
      )}

      <aside className={clsx(
        'fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none z-50 lg:z-0 transition-transform duration-300 flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Mobile close */}
        <div className="flex justify-between items-center p-6 border-b lg:hidden">
          <h2 className="text-xl font-bold text-blue-600">SmartLogix</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden lg:flex flex-col items-center justify-center p-5 border-b bg-blue-700 rounded-b-lg">
          <img src={Logo} alt="SmartLogix" className="h-10 w-auto mb-2" />
          <span className="text-white text-xs font-semibold tracking-wide uppercase">Portal Empresas</span>
        </div>

        {/* Empresa info */}
        <div className="mx-4 mt-4 mb-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Empresa</p>
          <p className="text-sm font-semibold text-blue-900 truncate">{user?.company || 'Mi Empresa'}</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 p-4 flex-1">
          {menuItems.map((item) => (
            <MenuItem key={item.path} {...item} isActive={location.pathname === item.path} />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar sesión</span>
          </button>
          <div className="text-xs text-gray-400 px-4 py-2">© 2026 SmartLogix v1.0</div>
        </div>
      </aside>
    </>
  )
}

export default function CompanyLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-gray-100">
      <CompanySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
              <p className="text-xs text-blue-600">{user?.company}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() || 'E'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
