// src/components/producto/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import { Producto } from '@/types/producto'

interface ProductCardProps {
  producto: Producto
  className?: string
}

export default function ProductCard({ producto, className }: ProductCardProps) {
  // Obtener imagen principal o primera imagen
  const imagenPrincipal = producto.imagenes.find(img => img.principal) || producto.imagenes[0]
  
  // Calcular descuento si hay precio de oferta
  const descuento = producto.precioOferta 
    ? Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100)
    : 0

  const precioMostrar = producto.precioOferta || producto.precio

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      {/* Imagen del producto */}
      <Link href={`/producto/${producto.slug}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-accent-50">
          {imagenPrincipal ? (
            <Image
              src={imagenPrincipal.url}
              alt={imagenPrincipal.altText || producto.nombre}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            // Placeholder si no hay imagen
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
              <span className="text-4xl text-primary">🌹</span>
            </div>
          )}
        </div>

        {/* Badges superpuestos */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {producto.nuevo && (
            <Badge variant="new" className="text-xs">
              ¡Nuevo!
            </Badge>
          )}
          {producto.destacado && (
            <Badge variant="featured" className="text-xs">
              Destacado
            </Badge>
          )}
          {descuento > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{descuento}%
            </Badge>
          )}
        </div>

        {/* Badge de stock */}
        <div className="absolute top-3 right-3">
          {producto.stock > 0 ? (
            <Badge variant="success" className="text-xs">
              En stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              Agotado
            </Badge>
          )}
        </div>
      </Link>

      {/* Contenido del producto */}
      <CardContent className="p-4">
        {/* Nombre y categoría */}
        <div className="mb-3">
          <Link 
            href={`/producto/${producto.slug}`}
            className="block hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-secondary-800 mb-1 line-clamp-2">
              {producto.nombre}
            </h3>
          </Link>
          <p className="text-sm text-secondary-500 capitalize">
            {producto.categoria.nombre}
          </p>
        </div>

        {/* Descripción corta */}
        {producto.descripcionCorta && (
          <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
            {producto.descripcionCorta}
          </p>
        )}

        {/* Tallas disponibles */}
        {producto.tallas.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-secondary-500 mb-1">Tallas disponibles:</p>
            <div className="flex flex-wrap gap-1">
              {producto.tallas.slice(0, 4).map((talla, index) => (
                <Badge key={index} variant="outline" className="text-xs py-0 px-1">
                  {talla}
                </Badge>
              ))}
              {producto.tallas.length > 4 && (
                <Badge variant="outline" className="text-xs py-0 px-1">
                  +{producto.tallas.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Precios */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(precioMostrar)}
            </span>
            {producto.precioOferta && (
              <span className="text-sm text-secondary-500 line-through">
                {formatPrice(producto.precio)}
              </span>
            )}
          </div>
          
          {/* Puntuación si hay reviews */}
          {producto._count?.reviews && producto._count.reviews > 0 && (
            <div className="flex items-center text-sm text-secondary-600">
              <span className="text-yellow-500 mr-1">★</span>
              <span>({producto._count.reviews})</span>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <Button 
          className="w-full" 
          disabled={producto.stock === 0}
          onClick={(e) => {
            e.preventDefault()
            // TODO: Implementar añadir al carrito
            console.log('Añadir al carrito:', producto.id)
          }}
        >
          {producto.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
        </Button>
      </CardContent>
    </Card>
  )
}