import React from 'react'
import clsx from 'clsx'

export default function Input({
  label,
  error,
  touched,
  className = '',
  required = false,
  ...props
}) {
  const hasError = touched && error

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-3 py-2 border rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-gray-600 focus:border-transparent',
          className
        )}
        {...props}
      />
      {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
