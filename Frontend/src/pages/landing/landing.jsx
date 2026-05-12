import { Link } from 'react-router-dom'
import logo from '../../Images/Logo_SmartLogix.png'
import './landing.css'

function Landing() {
  return (
    <div className="landing-wrapper">
      <nav className="landing-nav">
        <div className="container nav-content">
          <div className="logo-brand">
            <img src={logo} alt="SmartLogix" />
            <span>SmartLogix</span>
          </div>
          <div className="nav-links">
            <a href="#solucion">Solución</a>
            <a href="#tecnologia">Tecnología</a>
            <Link to="/login" className="btn-nav-login">Acceso Clientes</Link>
          </div>
        </div>
      </nav>

      <header className="landing-hero">
        <div className="container">
          <h1>La nueva era de la <span className="text-blue">logística inteligente</span></h1>
          <p>Potenciamos a las PYMEs de eCommerce con una plataforma de microservicios diseñada para escalar sin límites.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn-main">Empezar ahora</Link>
            <a href="#solucion" className="btn-sec">Saber más</a>
          </div>
        </div>
      </header>

      <section id="solucion" className="landing-section">
        <div className="container">
          <h2 className="section-title">Nuestra Propuesta</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon">🚀</div>
              <h3>Escalabilidad Real</h3>
              <p>Adiós a los sistemas monolíticos lentos. Nuestra arquitectura crece con tu volumen de ventas.</p>
            </div>
            <div className="feature-card">
              <div className="icon">📡</div>
              <h3>Sincronización Total</h3>
              <p>Inventarios actualizados en tiempo real entre todas tus bodegas y canales de venta.</p>
            </div>
            <div className="feature-card">
              <div className="icon">🛡️</div>
              <h3>Seguridad B2B</h3>
              <p>Datos protegidos y procesos automatizados para reducir el error humano al mínimo.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tecnologia" className="landing-tech">
        <div className="container">
          <div className="tech-content">
            <h2>Tecnología de Vanguardia</h2>
            <p>
              SmartLogix no es solo un software; es un ecosistema basado en 
              <strong> microservicios</strong>. Esto nos permite ofrecer una plataforma 
              flexible, donde cada módulo (Inventario, Pedidos, Envíos) funciona de 
              manera independiente y eficiente.
            </p>
            <ul className="tech-list">
              <li>✦ Backend escalable con arquitectura de microservicios</li>
              <li>✦ Frontend moderno y responsivo para gestión en tiempo real</li>
              <li>✦ Integración nativa con operadores logísticos</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>© 2026 SmartLogix – Soluciones Logísticas Inteligentes para el eCommerce moderno.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing