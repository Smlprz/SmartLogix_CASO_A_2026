import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import Logo from '../../Images/Logo_SmartLogix.png'

export default function CompanyLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username) { setErrorMsg('Por favor ingresa tu usuario'); return }
    if (!password) { setErrorMsg('Por favor ingresa tu contraseña'); return }

    setIsLoading(true)
    try {
      const response = await axios.post(
        'http://localhost:8080/api/users/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
      )

      const userData = response.data

      if (!userData.userId) {
        setErrorMsg(userData.message || 'Usuario o contraseña incorrectos')
        return
      }

      // Solo permitir usuarios con empresa asignada
      if (!userData.companyId) {
        setErrorMsg('Esta cuenta no corresponde a una empresa. Usa el acceso de administrador.')
        return
      }

      const role = 'COMPANY'
      localStorage.setItem('smartlogix_token', userData.userId.toString())
      localStorage.setItem('smartlogix_user', JSON.stringify({
        id: userData.userId,
        username: userData.username,
        company: userData.companyName || 'Empresa',
        companyId: userData.companyId,
        role,
      }))

      // Enriquecer con role para que AuthContext lo lea correctamente
      login({ ...userData, role: 'COMPANY' })
      navigate('/company/dashboard')
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg('Usuario o contraseña incorrectos')
      } else if (error.code === 'ECONNABORTED') {
        setErrorMsg('Timeout - El servidor no responde')
      } else if (error.message === 'Network Error') {
        setErrorMsg('Error de conexión - Verifica que el servidor esté activo')
      } else {
        setErrorMsg(error.response?.data?.message || error.message || 'Error desconocido')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-700 p-3 rounded-lg">
              <img src={Logo} alt="SmartLogix" className="h-12 w-auto" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Portal Empresas</h1>
          <p className="text-gray-500 text-sm">Acceso exclusivo para empresas registradas</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded text-sm">
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Usuario de empresa"
            type="text"
            placeholder="usuario_empresa"
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (errorMsg) setErrorMsg('') }}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (errorMsg) setErrorMsg('') }}
            required
          />
          <Button type="submit" variant="primary" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver al acceso de administrador
          </Link>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">SmartLogix 2026</p>
      </Card>
    </div>
  )
}
