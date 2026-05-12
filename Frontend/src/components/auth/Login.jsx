import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import Logo from '../../Images/Logo_SmartLogix.png'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()

    // Validar campos
    if (!username) {
      setErrorMsg('Por favor ingresa tu usuario')
      return
    }
    if (!password) {
      setErrorMsg('Por favor ingresa tu contraseña')
      return
    }

    setIsLoading(true)

    try {
      // Llamada directa a la API sin servicio
      const response = await axios.post(
        'http://localhost:8080/api/users/login',
        { username, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      )

      console.log('Login exitoso:', response.data)

      // Guardar datos
      const userData = response.data
      localStorage.setItem('smartlogix_token', userData.userId.toString())
      localStorage.setItem(
        'smartlogix_user',
        JSON.stringify({
          id: userData.userId,
          username: userData.username,
          company: userData.company?.companyName || 'Default'
        })
      )

      // Enriquecer con role y redirigir según empresa
      const role = userData.companyId ? 'COMPANY' : 'ADMIN'
      login({ ...userData, role })
      navigate(role === 'COMPANY' ? '/company/dashboard' : '/dashboard')
    } catch (error) {
      console.error('Error en login:', error)

      // Mensajes de error específicos
      if (error.response?.status === 401) {
        setErrorMsg('Usuario o contraseña incorrectos')
      } else if (error.response?.status === 404) {
        setErrorMsg('Usuario no encontrado')
      } else if (error.code === 'ECONNABORTED') {
        setErrorMsg('Timeout - El servidor no responde')
      } else if (error.message === 'Network Error') {
        setErrorMsg('Error de conexión - Verifica que el servidor esté activo')
      } else {
        setErrorMsg(
          error.response?.data?.message ||
          error.message ||
          'Error desconocido'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Limpiar error cuando el usuario escribe
  const handleUsernameChange = (value) => {
    setUsername(value)
    if (errorMsg) setErrorMsg('')
  }

  const handlePasswordChange = (value) => {
    setPassword(value)
    if (errorMsg) setErrorMsg('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-900 p-3 rounded-lg">
              <img src={Logo} alt="SmartLogix" className="h-12 w-auto" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">SmartLogix</h1>
          <p className="text-gray-500 text-sm">Inicia sesión en tu cuenta</p>
        </div>

        {/* ERROR */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded text-sm">
            <p>{errorMsg}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Usuario"
            type="text"
            placeholder="SmartLogixAdmin"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="SmartLogix321"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* CREDENCIALES */}
        <div className="mt-6 p-3 bg-gray-50 rounded border border-gray-300">
          <p className="text-xs font-semibold text-gray-700 mb-2">Credenciales válidas:</p>
          <p className="text-xs text-gray-600">
            <span className="font-mono">SmartLogixAdmin</span>
            <span className="text-gray-400"> / </span>
            <span className="font-mono">SmartLogix321</span>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/company-login" className="text-sm text-blue-600 hover:text-blue-800">
            ¿Eres una empresa? Ingresa aquí →
          </Link>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          SmartLogix 2026
        </p>
      </Card>
    </div>
  )
}
