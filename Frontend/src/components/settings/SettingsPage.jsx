import React, { useState } from 'react'
import { Save, Lock, Bell, Users, Database, LogOut } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    company: user?.company || '',
    email: user?.email || 'admin@smartlogix.com',
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [savedMessage, setSavedMessage] = useState('')

  const handleSaveProfile = () => {
    setSavedMessage('Cambios guardados exitosamente')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleChangePassword = () => {
    alert('Función de cambio de contraseña no disponible en demostración')
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout()
      navigate('/login')
    }
  }

  const SettingTab = ({ id, label, icon: Icon, onClick, active }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition ${
        active
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 text-sm mt-1">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card padding="p-2" className="sticky top-20">
            <div className="space-y-1">
              <SettingTab
                id="profile"
                label="Perfil"
                icon={Users}
                onClick={() => setActiveTab('profile')}
                active={activeTab === 'profile'}
              />
              <SettingTab
                id="security"
                label="Seguridad"
                icon={Lock}
                onClick={() => setActiveTab('security')}
                active={activeTab === 'security'}
              />
              <SettingTab
                id="notifications"
                label="Notificaciones"
                icon={Bell}
                onClick={() => setActiveTab('notifications')}
                active={activeTab === 'notifications'}
              />
              <SettingTab
                id="system"
                label="Sistema"
                icon={Database}
                onClick={() => setActiveTab('system')}
                active={activeTab === 'system'}
              />
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card title="Información del Perfil">
              <div className="space-y-4">
                {savedMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                    ✓ {savedMessage}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({ ...profileData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData({ ...profileData, company: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-4">
                  <Button variant="primary" onClick={handleSaveProfile}>
                    <Save size={18} className="mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card title="Seguridad">
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Administra tu contraseña y opciones de seguridad
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-3">
                    <strong>Contraseña Actual:</strong> Protegida con encriptación
                  </p>
                  <Button variant="outline" onClick={handleChangePassword}>
                    <Lock size={18} className="mr-2" />
                    Cambiar Contraseña
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3">Sesiones Activas</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📱 Navegador Chrome - Este dispositivo</p>
                    <p>⏰ Última actividad: Ahora</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card title="Notificaciones">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Órdenes Nuevas</p>
                    <p className="text-sm text-gray-600">Notificaciones cuando llegan pedidos</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Envíos Completados</p>
                    <p className="text-sm text-gray-600">Notificaciones de entregas</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Alertas de Stock</p>
                    <p className="text-sm text-gray-600">Cuando el inventario es bajo</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
                </div>
              </div>
            </Card>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <Card title="Sistema">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Versión</p>
                    <p className="text-lg font-semibold text-gray-800">1.0.0</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Estado</p>
                    <p className="text-lg font-semibold text-green-600">En Línea</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Información del Servidor</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>📡 API: localhost:8080 ✓</p>
                    <p>📦 Pedidos: localhost:8081 ✓</p>
                    <p>📊 Inventario: localhost:8083 ✓</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Base de datos: PostgreSQL Insforge
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Logout Section */}
          <Card title="Sesión" className="border-red-200">
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Cerrar sesión y volver a la pantalla de login
              </p>
              <Button variant="danger" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
