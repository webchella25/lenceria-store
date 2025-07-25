// src/app/(shop)/categoria/[slug]/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/producto/ProductGrid'
import ProductFilters from '@/components/producto/ProductFilters'
import { useProducts } from '@/hooks/useProducts'
import { useCategorias } from '@/hooks/useCategorias'
import { ProductoFiltros } from '@/types/producto'

interface PageProps {
  params: { slug: string }
}

export default function CategoriaPage({ params }: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { categorias } = useCategorias()
  
  // Encontrar la categoría actual
  const categoria = categorias.find(cat => cat.slug === params.slug)
  
  // Construir filtros desde URL
  const [filtros, setFiltros] = useState<ProductoFiltros>(() => ({
    categoria: params.slug,
    genero: searchParams.get('genero') as any,
    precioMin: searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : undefined,
    precioMax: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : undefined,
    tallas: searchParams.get('tallas')?.split(',') || undefined,
    colores: searchParams.get('colores')?.split(',') || undefined,
    destacados: searchParams.get('destacados') === 'true' || undefined,
    nuevos: searchParams.get('nuevos') === 'true' || undefined,
    enStock: searchParams.get('enStock') === 'true' || undefined,
    busqueda: searchParams.get('busqueda') || undefined,
    ordenarPor: searchParams.get('ordenarPor') as any || 'fecha_desc',
    pagina: Number(searchParams.get('pagina')) || 1,
    limite: Number(searchParams.get('limite')) || 12,
  }))

  const { productos, loading, error, total, pagina, totalPaginas, fetchProductos } = useProducts(filtros)

  // Si no encontramos la categoría y ya cargaron las categorías
  if (categorias.length > 0 && !categoria) {
    notFound()
  }

  const handleFiltrosChange = (nuevosFiltros: ProductoFiltros) => {
    setFiltros(nuevosFiltros)
    
    // Actualizar URL
    const params = new URLSearchParams()
    Object.entries(nuevosFiltros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
      }
    })
    
    const newUrl = `/categoria/${params.slug}${params.toString() ? `?${params.toString()}` : ''}`
    router.push(newUrl)
  }

  const handlePageChange = (nuevaPagina: number) => {
    const nuevosFiltros = { ...filtros, pagina: nuevaPagina }
    handleFiltrosChange(nuevosFiltros)
  }

  // Mostrar loading mientras cargan las categorías
  if (categorias.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-secondary-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="h-64 bg-secondary-200 rounded"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-secondary-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header de la categoría */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
            {categoria?.nombre || 'Categoría'}
          </h1>
          {categoria?.descripcion && (
            <p className="text-lg text-secondary-600 max-w-3xl">
              {categoria.descripcion}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ProductFilters
                filtros={filtros}
                onFiltrosChange={handleFiltrosChange}
                categorias={categorias}
                loading={loading}
              />
            </div>
          </div>

          {/* Grid de productos */}
          <div className="lg:col-span-3">
            <ProductGrid
              productos={productos}
              loading={loading}
              error={error}
              total={total}
              pagina={pagina}
              totalPaginas={totalPaginas}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}