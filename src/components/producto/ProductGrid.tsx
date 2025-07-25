// src/components/producto/ProductGrid.tsx
import { Producto, ProductoFiltros } from '@/types/producto'
import ProductCard from './ProductCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface ProductGridProps {
  productos: Producto[]
  loading?: boolean
  error?: string | null
  total?: number
  pagina?: number
  totalPaginas?: number
  limite?: number
  onLoadMore?: () => void
  onPageChange?: (pagina: number) => void
  className?: string
}

export default function ProductGrid({
  productos,
  loading = false,
  error = null,
  total = 0,
  pagina = 1,
  totalPaginas = 0,
  limite = 12,
  onLoadMore,
  onPageChange,
  className = ""
}: ProductGridProps) {

  // Loading skeleton
  if (loading && productos.length === 0) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: limite }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <span className="text-6xl mb-4 block">😔</span>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">
            Error al cargar productos
          </h3>
          <p className="text-secondary-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  // Empty state
  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-secondary-600 mb-4">
            Intenta ajustar los filtros o buscar algo diferente
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Información de resultados */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-secondary-600">
          Mostrando {((pagina - 1) * limite) + 1} - {Math.min(pagina * limite, total)} de {total} productos
        </div>
        <Badge variant="outline" className="text-xs">
          Página {pagina} de {totalPaginas}
        </Badge>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {productos.map((producto) => (
          <ProductCard 
            key={producto.id} 
            producto={producto}
            className="h-full"
          />
        ))}
        
        {/* Loading skeletons durante load more */}
        {loading && productos.length > 0 && (
          Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={`loading-${index}`} />
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4">
          {/* Paginación con números */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagina - 1)}
              disabled={pagina <= 1 || loading}
            >
              Anterior
            </Button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {getPaginationNumbers(pagina, totalPaginas).map((numero, index) => (
                numero === '...' ? (
                  <span key={index} className="px-2 text-secondary-500">...</span>
                ) : (
                  <Button
                    key={index}
                    variant={numero === pagina ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange?.(numero as number)}
                    disabled={loading}
                    className="min-w-[40px]"
                  >
                    {numero}
                  </Button>
                )
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagina + 1)}
              disabled={pagina >= totalPaginas || loading}
            >
              Siguiente
            </Button>
          </div>

          {/* Botón "Cargar más" alternativo */}
          {onLoadMore && pagina < totalPaginas && (
            <Button
              variant="secondary"
              onClick={onLoadMore}
              disabled={loading}
              className="ml-4"
            >
              {loading ? 'Cargando...' : 'Cargar más productos'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Componente skeleton para loading
function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-square bg-secondary-200"></div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
          <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
          <div className="h-3 bg-secondary-200 rounded w-full"></div>
          <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
          <div className="flex justify-between items-center">
            <div className="h-5 bg-secondary-200 rounded w-1/3"></div>
            <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
          </div>
          <div className="h-9 bg-secondary-200 rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Función para generar números de paginación
function getPaginationNumbers(paginaActual: number, totalPaginas: number): (number | string)[] {
  const delta = 2 // Número de páginas a mostrar a cada lado
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, paginaActual - delta); i <= Math.min(totalPaginas - 1, paginaActual + delta); i++) {
    range.push(i)
  }

  if (paginaActual - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (paginaActual + delta < totalPaginas - 1) {
    rangeWithDots.push('...', totalPaginas)
  } else if (totalPaginas > 1) {
    rangeWithDots.push(totalPaginas)
  }

  return rangeWithDots
}