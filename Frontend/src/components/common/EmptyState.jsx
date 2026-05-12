import React from 'react'
import { AlertCircle } from 'lucide-react'

export default function EmptyState({
  icon: Icon = AlertCircle,
  title = "Sin datos",
  description = "No hay datos disponibles",
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 mb-4">
        <Icon size={48} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 text-center">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}
