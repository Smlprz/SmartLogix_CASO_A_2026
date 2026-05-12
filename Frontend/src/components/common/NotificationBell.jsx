import React, { useState } from 'react'
import { Bell, X } from 'lucide-react'
import { useNotification } from '../../hooks/useNotification'

export default function NotificationBell() {
  const { notifications, removeNotification } = useNotification()
  const [isOpen, setIsOpen] = useState(false)

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500 text-green-700'
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500 text-red-700'
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700'
      default:
        return 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
    }
  }

  const unreadCount = notifications.length

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <button onClick={() => { notifications.forEach(n => removeNotification(n.id)); setIsOpen(false) }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Limpiar todo
              </button>
            )}
          </div>

          {unreadCount === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No hay notificaciones</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded text-sm flex justify-between items-start ${getTypeColor(notification.type)}`}>
                  <div className="flex-1">
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(notification.id).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                  <button onClick={() => removeNotification(notification.id)} className="ml-2 hover:opacity-75 transition">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
