// src/hooks/useCategorias.ts
import { useState, useEffect } from 'react'
import type { Categoria } from '@/types/producto'

interface UseCategoriasResult {
  categorias: Categoria[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCategorias(includeProductCount = false): UseCategoriasResult {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (includeProductCount) {
        params.append('includeProductCount', 'true')
      }

      const response = await fetch(`/api/categorias?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setCategorias(data)
      
    } catch (err) {
      console.error('Error al cargar categorías:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setCategorias([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategorias()
  }, [includeProductCount])

  return {
    categorias,
    loading,
    error,
    refetch: fetchCategorias
  }
}