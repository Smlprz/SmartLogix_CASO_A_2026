import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export default function Table({
  columns,
  data,
  loading = false,
  emptyMessage = 'Sin datos para mostrar',
  onRowClick,
  selectable = false,
  onSelectChange,
  selectedRows = [],
}) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin">⏳</div>
        <p className="text-gray-600 mt-2">Cargando...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {selectable && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectChange?.(data.map((_, i) => i))
                    } else {
                      onSelectChange?.([])
                    }
                  }}
                  checked={selectedRows.length === data.length}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rowIndex)}
                    onChange={(e) => {
                      e.stopPropagation()
                      if (e.target.checked) {
                        onSelectChange?.([...selectedRows, rowIndex])
                      } else {
                        onSelectChange?.(selectedRows.filter((i) => i !== rowIndex))
                      }
                    }}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-gray-800">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
