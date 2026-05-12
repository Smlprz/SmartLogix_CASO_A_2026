import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'
import logo from '../../Images/Logo_SmartLogix.png'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Log para depuración: Ver qué estamos enviando
    console.log('Intentando login con:', { username, password });

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          username: username, // Debe coincidir con LoginRequest.java
          password: password 
        })
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas o error en el servidor');
      }

      // Validar que recibimos los datos necesarios antes de guardar
      if (data && data.userId) {
        const userData = {
          username: data.username,
          companyId: data.companyId
          // Añade aquí token si usas JWT en el futuro
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('Login exitoso, redirigiendo...');
        navigate('/dashboard')
      } else {
        throw new Error('El servidor no devolvió los datos del usuario correctamente');
      }
      
    } catch (err) {
      setError(err.message)
      console.error('Error detallado de login:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <Link to="/">
          <img src={logo} alt="SmartLogix" className="login-logo" />
        </Link>
        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus credenciales para acceder</p>
        
        {error && (
          <div className="error-message" style={{
            color: 'white', 
            backgroundColor: '#ef4444', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input 
              type="text" 
              placeholder="nombre_usuario" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <span>¿No tienes cuenta?</span>
          <a href="#">Empieza gratis</a>
        </div>
      </div>
    </div>
  )
}

export default Login