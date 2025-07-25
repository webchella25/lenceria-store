// src/components/producto/ProductCard.tsx (ACTUALIZACIÓN)
"use client"

import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import AddToCartButton from "@/components/carrito/AddToCartButton"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import type { Producto } from "@prisma/client"

interface ProductCardProps {
  producto: Producto & {
    imagenes: { url: string; altText: string | null }[]
    categoria: { nombre: string; slug: string }
  }
}

export default function ProductCard({ producto }: ProductCardProps) {
  const precioFinal = producto.precioOferta || producto.precio
  const descuento = producto.precioOferta 
    ? calculateDiscount(producto.precio, producto.precioOferta)
    : 0

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Link envuelve solo la imagen y título */}
        <Link href={`/producto/${producto.slug}`}>
          <div className="aspect-[3/4] overflow-hidden bg-secondary-100">
            <img
              src={producto.imagenes[0]?.url || '/placeholder.jpg'}
              alt={producto.imagenes[0]?.altText || producto.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {producto.nuevo && (
            <Badge variant="success" className="text-xs">
              NUEVO
            </Badge>
          )}
          {descuento > 0 && (
            <Badge variant="primary" className="text-xs">
              -{descuento}%
            </Badge>
          )}
          {producto.stock <= 3 && producto.stock > 0 && (
            <Badge variant="warning" className="text-xs">
              ¡Últimas {producto.stock}!
            </Badge>
          )}
          {producto.stock === 0 && (
            <Badge variant="secondary" className="text-xs">
              SIN STOCK
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <span className="text-primary">♡</span>
        </button>
      </div>

      <div className="p-4">
        {/* Categoría */}
        <Link 
          href={`/categoria/${producto.categoria.slug}`}
          className="text-xs text-primary hover:underline"
        >
          {producto.categoria.nombre}
        </Link>

        {/* Título */}
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="font-medium text-secondary-800 mt-1 mb-2 hover:text-primary transition-colors line-clamp-2">
            {producto.nombre}
          </h3>
        </Link>

        {/* Precios */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-secondary-800">
            {formatPrice(precioFinal)}
          </span>
          {producto.precioOferta && (
            <span className="text-sm text-secondary-500 line-through">
              {formatPrice(producto.precio)}
            </span>
          )}
        </div>

        {/* Tallas disponibles (preview) */}
        {producto.tallas.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-secondary-600 mb-1">Tallas disponibles:</p>
            <div className="flex gap-1">
              {producto.tallas.slice(0, 4).map((talla) => (
                <span
                  key={talla}
                  className="text-xs px-2 py-1 bg-secondary-100 rounded"
                >
                  {talla}
                </span>
              ))}
              {producto.tallas.length > 4 && (
                <span className="text-xs px-2 py-1 bg-secondary-100 rounded">
                  +{producto.tallas.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Botón añadir al carrito */}
        <AddToCartButton
          producto={producto}
          className="w-full"
          selectedTalla={producto.tallas[0]} // Talla por defecto para vista de catálogo
        />
      </div>
    </Card>
  )
}