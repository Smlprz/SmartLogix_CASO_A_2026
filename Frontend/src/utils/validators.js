export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 20
}

export const validatePhoneNumber = (phone) => {
  const regex = /^[0-9]{9,}$/
  return regex.test(phone.replace(/\D/g, ''))
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

export const validateMinLength = (value, min) => {
  return value && value.length >= min
}

export const validateMaxLength = (value, max) => {
  return value && value.length <= max
}

export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0
}