// src/components/producto/ProductReviews.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Review } from '@/types/producto'

interface ProductReviewsProps {
  reviews: Review[]
  productoId: string
  puntuacionPromedio?: number
  className?: string
}

export default function ProductReviews({ 
  reviews, 
  productoId, 
  puntuacionPromedio,
  className = "" 
}: ProductReviewsProps) {
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const [filtroEstrellas, setFiltroEstrellas] = useState<number | null>(null)

  // Filtrar reviews
  const reviewsFiltradas = filtroEstrellas 
    ? reviews.filter(review => review.puntuacion === filtroEstrellas)
    : reviews

  const reviewsMostrar = mostrarTodas ? reviewsFiltradas : reviewsFiltradas.slice(0, 5)

  // Calcular distribución de estrellas
  const distribucionEstrellas = [5, 4, 3, 2, 1].map(estrellas => {
    const count = reviews.filter(review => review.puntuacion === estrellas).length
    const porcentaje = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { estrellas, count, porcentaje }
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reseñas de Clientes</span>
          <Badge variant="outline">{reviews.length} reseñas</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Resumen de puntuaciones */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-secondary-200">
            {/* Puntuación general */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {puntuacionPromedio?.toFixed(1) || '0.0'}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= (puntuacionPromedio || 0) 
                        ? 'text-yellow-500' 
                        : 'text-secondary-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-secondary-600">
                Basado en {reviews.length} reseñas
              </p>
            </div>

            {/* Distribución de estrellas */}
            <div className="space-y-2">
              {distribucionEstrellas.map(({ estrellas, count, porcentaje }) => (
                <div key={estrellas} className="flex items-center gap-2">
                  <button
                    onClick={() => setFiltroEstrellas(filtroEstrellas === estrellas ? null : estrellas)}
                    className={`flex items-center gap-1 text-sm hover:text-primary transition-colors ${
                      filtroEstrellas === estrellas ? 'text-primary font-medium' : 'text-secondary-600'
                    }`}
                  >
                    <span>{estrellas}</span>
                    <span className="text-yellow-500">★</span>
                  </button>
                  <div className="flex-1 bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <span className="text-sm text-secondary-600 w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros activos */}
        {filtroEstrellas && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-600">Mostrando:</span>
            <Badge variant="outline" className="flex items-center gap-1">
              {filtroEstrellas} ★
              <button
                onClick={() => setFiltroEstrellas(null)}
                className="ml-1 text-secondary-500 hover:text-secondary-700"
              >
                ✕
              </button>
            </Badge>
          </div>
        )}

        {/* Lista de reseñas */}
        {reviewsMostrar.length > 0 ? (
          <div className="space-y-6">
            {reviewsMostrar.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}

            {/* Botón mostrar más */}
            {reviewsFiltradas.length > 5 && !mostrarTodas && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setMostrarTodas(true)}
                >
                  Ver todas las reseñas ({reviewsFiltradas.length})
                </Button>
              </div>
            )}

            {mostrarTodas && reviewsFiltradas.length > 5 && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setMostrarTodas(false)}
                >
                  Mostrar menos
                </Button>
              </div>
            )}
          </div>
        ) : filtroEstrellas ? (
          <div className="text-center py-8">
            <p className="text-secondary-600">
              No hay reseñas con {filtroEstrellas} estrella{filtroEstrellas > 1 ? 's' : ''}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-secondary-600 mb-4">
              Este producto aún no tiene reseñas
            </p>
            <p className="text-sm text-secondary-500">
              ¡Sé el primero en compartir tu opinión!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente individual de reseña
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-secondary-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
            {(review.usuario?.name?.[0] || 'A').toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-secondary-800">
              {review.usuario?.name || 'Usuario Anónimo'}
            </div>
            <div className="text-sm text-secondary-500">
              {formatDate(new Date(review.createdAt))}
            </div>
          </div>
        </div>
        
        {/* Puntuación */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${
                star <= review.puntuacion 
                  ? 'text-yellow-500' 
                  : 'text-secondary-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Título de la reseña */}
      {review.titulo && (
        <h4 className="font-medium text-secondary-800 mb-2">
          {review.titulo}
        </h4>
      )}

      {/* Comentario */}
      {review.comentario && (
        <p className="text-secondary-700 leading-relaxed mb-3">
          {review.comentario}
        </p>
      )}

      {/* Badges adicionales */}
      <div className="flex items-center gap-2">
        {review.verificada && (
          <Badge variant="success" className="text-xs">
            ✓ Compra verificada
          </Badge>
        )}
      </div>
    </div>
  )
}