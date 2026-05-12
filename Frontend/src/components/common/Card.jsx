import React from 'react'
import clsx from 'clsx'

export default function Card({
  children,
  title,
  subtitle,
  className = '',
  padding = 'p-6',
  ...props
}) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md border border-gray-200',
        padding,
        className
      )}
      {...props}
    >
      {title && (
        <div className="mb-4 pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
