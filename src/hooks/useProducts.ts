// src/hooks/useProducts.ts
import { useState, useEffect } from 'react'
import { Producto, ProductoFiltros, ProductosResponse } from '@/types/producto'

interface UseProductsResult {
  productos: Producto[]
  loading: boolean
  error: string | null
  total: number
  pagina: number
  totalPaginas: number
  fetchProductos: (filtros?: ProductoFiltros) => Promise<void>
  refetch: () => Promise<void>
}

export function useProducts(filtrosIniciales?: ProductoFiltros): UseProductsResult {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [filtrosActuales, setFiltrosActuales] = useState<ProductoFiltros>(filtrosIniciales || {})

  const fetchProductos = async (filtros?: ProductoFiltros) => {
    try {
      setLoading(true)
      setError(null)

      const filtrosAUsar = filtros || filtrosActuales
      setFiltrosActuales(filtrosAUsar)

      // Construir query params
      const params = new URLSearchParams()
      
      if (filtrosAUsar.categoria) params.append('categoria', filtrosAUsar.categoria)
      if (filtrosAUsar.genero) params.append('genero', filtrosAUsar.genero)
      if (filtrosAUsar.precioMin) params.append('precioMin', filtrosAUsar.precioMin.toString())
      if (filtrosAUsar.precioMax) params.append('precioMax', filtrosAUsar.precioMax.toString())
      if (filtrosAUsar.tallas) params.append('tallas', filtrosAUsar.tallas.join(','))
      if (filtrosAUsar.colores) params.append('colores', filtrosAUsar.colores.join(','))
      if (filtrosAUsar.destacados) params.append('destacados', 'true')
      if (filtrosAUsar.nuevos) params.append('nuevos', 'true')
      if (filtrosAUsar.enStock) params.append('enStock', 'true')
      if (filtrosAUsar.busqueda) params.append('busqueda', filtrosAUsar.busqueda)
      if (filtrosAUsar.ordenarPor) params.append('ordenarPor', filtrosAUsar.ordenarPor)
      if (filtrosAUsar.pagina) params.append('pagina', filtrosAUsar.pagina.toString())
      if (filtrosAUsar.limite) params.append('limite', filtrosAUsar.limite.toString())

      const response = await fetch(`/api/productos?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: ProductosResponse = await response.json()
      
      setProductos(data.productos)
      setTotal(data.total)
      setPagina(data.pagina)
      setTotalPaginas(data.totalPaginas)
      
    } catch (err) {
      console.error('Error al cargar productos:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setProductos([])
      setTotal(0)
      setPagina(1)
      setTotalPaginas(0)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => fetchProductos(filtrosActuales)

  // Cargar productos inicialmente
  useEffect(() => {
    fetchProductos()
  }, []) // Solo se ejecuta una vez al montar

  return {
    productos,
    loading,
    error,
    total,
    pagina,
    totalPaginas,
    fetchProductos,
    refetch
  }
}

// Hook para obtener un producto individual
export function useProducto(slug: string) {
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchProducto = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/productos/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado')
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setProducto(data)
        
      } catch (err) {
        console.error('Error al cargar producto:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setProducto(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [slug])

  return { producto, loading, error }
}