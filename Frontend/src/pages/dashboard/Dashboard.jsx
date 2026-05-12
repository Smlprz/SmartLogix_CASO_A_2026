import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>SmartLogix</span>
        </div>
        <nav className="sidebar-menu">
          <a href="/dashboard" className="menu-item active">Dashboard</a>
        </nav>
        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
      </aside>

      <main className="main-viewport">
        <header className="main-header">
          <div className="header-info">
            <h1>Dashboard</h1>
          </div>
        </header>

        <div className="empty-state">
          <p>Use el nuevo dashboard en /dashboard</p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
