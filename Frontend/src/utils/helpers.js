export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formatTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(value || 0)
}

export const formatNumber = (value) => {
  return new Intl.NumberFormat('es-ES').format(value || 0)
}

export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? `${text.substring(0, length)}...` : text
}

export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
