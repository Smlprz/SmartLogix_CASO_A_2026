import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import Login from './components/auth/Login'
import CompanyLogin from './components/auth/CompanyLogin'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CompanyProtectedRoute from './components/auth/CompanyProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import CompanyLayout from './components/layout/CompanyLayout'
import Dashboard from './components/dashboard/Dashboard'
import CompanyDashboard from './components/company/CompanyDashboard'
import UsersList from './components/users/UsersList'
import OrdersList from './components/orders/OrdersList'
import InventoryList from './components/inventory/InventoryList'
import ShipmentsList from './components/shipments/ShipmentsList'
import SettingsPage from './components/settings/SettingsPage'

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login"         element={<Login />} />
          <Route path="/company-login" element={<CompanyLogin />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/"          element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/users"     element={<MainLayout><UsersList /></MainLayout>} />
            <Route path="/orders"    element={<MainLayout><OrdersList /></MainLayout>} />
            <Route path="/inventory" element={<MainLayout><InventoryList /></MainLayout>} />
            <Route path="/shipments" element={<MainLayout><ShipmentsList /></MainLayout>} />
            <Route path="/settings"  element={<MainLayout><SettingsPage /></MainLayout>} />
          </Route>

          {/* Company Routes */}
          <Route element={<CompanyProtectedRoute />}>
            <Route path="/company/dashboard" element={<CompanyLayout><CompanyDashboard /></CompanyLayout>} />
            <Route path="/company/inventory" element={<CompanyLayout><InventoryList /></CompanyLayout>} />
            <Route path="/company/orders"    element={<CompanyLayout><OrdersList /></CompanyLayout>} />
            <Route path="/company/shipments" element={<CompanyLayout><ShipmentsList /></CompanyLayout>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </NotificationProvider>
  )
}
