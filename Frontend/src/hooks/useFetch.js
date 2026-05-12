import { useState, useEffect } from 'react'

export function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchFunction()
      setData(response.data || response)
    } catch (err) {
      setError(err.message || 'Error al cargar datos')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  const refetch = () => fetchData()

  return { data, loading, error, refetch }
}
