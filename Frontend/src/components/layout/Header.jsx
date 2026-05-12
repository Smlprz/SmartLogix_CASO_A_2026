import React from 'react'
import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/helpers'
import NotificationBell from '../common/NotificationBell'

export default function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left Side - solo botón menú móvil */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-blue-600 lg:hidden">SmartLogix</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-6 border-l">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.company}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {getInitials(user?.username || 'U')}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
