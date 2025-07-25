// src/components/producto/ProductDetail.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/carrito/AddToCartButton'
import ProductReviews from './ProductReviews'
import type { Producto } from '@/types/producto'

interface ProductDetailProps {
  producto: Producto & {
    puntuacionPromedio?: number
    productosRelacionados?: Producto[]
  }
}

export default function ProductDetail({ producto }: ProductDetailProps) {
  const [selectedTalla, setSelectedTalla] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Calcular descuento si hay precio de oferta
  const descuento = producto.precioOferta 
    ? Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100)
    : 0

  const precioMostrar = producto.precioOferta || producto.precio
  const imagenPrincipal = producto.imagenes[selectedImageIndex] || producto.imagenes[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square overflow-hidden rounded-lg bg-accent-50 relative">
              {imagenPrincipal ? (
                <Image
                  src={imagenPrincipal.url}
                  alt={imagenPrincipal.altText || producto.nombre}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
                  <span className="text-6xl text-primary">🌹</span>
                </div>
              )}

              {/* Badges superpuestos */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {producto.nuevo && (
                  <Badge variant="new">¡Nuevo!</Badge>
                )}
                {producto.destacado && (
                  <Badge variant="featured">Destacado</Badge>
                )}
                {descuento > 0 && (
                  <Badge variant="destructive">-{descuento}%</Badge>
                )}
              </div>

              {/* Badge de stock */}
              <div className="absolute top-4 right-4">
                {producto.stock > 0 ? (
                  <Badge variant="success">En stock</Badge>
                ) : (
                  <Badge variant="destructive">Agotado</Badge>
                )}
              </div>
            </div>

            {/* Miniaturas */}
            {producto.imagenes.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {producto.imagenes.map((imagen, index) => (
                  <button
                    key={imagen.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <Image
                      src={imagen.url}
                      alt={imagen.altText || `${producto.nombre} ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {producto.categoria.nombre}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {producto.genero.toLowerCase()}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-3">
                {producto.nombre}
              </h1>

              {/* Puntuación y reviews */}
              {producto.puntuacionPromedio && producto._count?.reviews && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= producto.puntuacionPromedio! 
                            ? 'text-yellow-500' 
                            : 'text-secondary-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-secondary-600">
                    {producto.puntuacionPromedio.toFixed(1)} ({producto._count.reviews} reseñas)
                  </span>
                </div>
              )}
            </div>

            {/* Descripción */}
            {producto.descripcionCorta && (
              <p className="text-lg text-secondary-600 leading-relaxed">
                {producto.descripcionCorta}
              </p>
            )}

            {/* Precios */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(precioMostrar)}
                </span>
                {producto.precioOferta && (
                  <span className="text-xl text-secondary-500 line-through">
                    {formatPrice(producto.precio)}
                  </span>
                )}
              </div>
              {descuento > 0 && (
                <p className="text-green-600 font-medium">
                  ¡Ahorras {formatPrice(producto.precio - producto.precioOferta!)}! ({descuento}% de descuento)
                </p>
              )}
            </div>

            {/* Selección de tallas */}
            {producto.tallas.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-secondary-800">Talla:</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.tallas.map((talla) => (
                    <Button
                      key={talla}
                      variant={selectedTalla === talla ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTalla(talla)}
                      className="min-w-[50px]"
                    >
                      {talla}
                    </Button>
                  ))}
                </div>
                {producto.tallas.length > 0 && !selectedTalla && (
                  <p className="text-sm text-secondary-500">
                    Selecciona una talla para continuar
                  </p>
                )}
              </div>
            )}

            {/* Selección de colores */}
            {producto.colores.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-secondary-800">Color:</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.colores.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
                {producto.colores.length > 0 && !selectedColor && (
                  <p className="text-sm text-secondary-500">
                    Selecciona un color para continuar
                  </p>
                )}
              </div>
            )}

            {/* Información de stock */}
            <div className="bg-accent-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Disponibilidad:</span>
                <Badge variant={producto.stock > 0 ? "success" : "destructive"}>
                  {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                </Badge>
              </div>
              {producto.stock > 0 && producto.stock <= 5 && (
                <p className="text-sm text-orange-600">
                  ⚠️ ¡Últimas unidades disponibles!
                </p>
              )}
            </div>

            {/* Botón añadir al carrito */}
            <AddToCartButton
              producto={producto}
              selectedTalla={selectedTalla}
              selectedColor={selectedColor}
              className="w-full h-12 text-lg"
            />

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Envío gratis a partir de €50</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Entrega en 24-48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Pago 100% seguro</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>↩️</span>
                  <span>Devolución gratuita 30 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>Atención al cliente 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎁</span>
                  <span>Packaging discreto</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de detalles expandida */}
        <div className="mt-16 space-y-8">
          {/* Descripción completa */}
          {producto.descripcion && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                <div className="prose max-w-none text-secondary-700">
                  {producto.descripcion.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Especificaciones */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Especificaciones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-secondary-100 pb-2">
                    <span className="font-medium">SKU:</span>
                    <span>{producto.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-secondary-100 pb-2">
                    <span className="font-medium">Género:</span>
                    <span className="capitalize">{producto.genero.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between border-b border-secondary-100 pb-2">
                    <span className="font-medium">Categoría:</span>
                    <span>{producto.categoria.nombre}</span>
                  </div>
                  {producto.peso && (
                    <div className="flex justify-between border-b border-secondary-100 pb-2">
                      <span className="font-medium">Peso:</span>
                      <span>{producto.peso}g</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {producto.materiales.length > 0 && (
                    <div className="flex justify-between border-b border-secondary-100 pb-2">
                      <span className="font-medium">Materiales:</span>
                      <span>{producto.materiales.join(', ')}</span>
                    </div>
                  )}
                  {producto.dimensiones && (
                    <div className="flex justify-between border-b border-secondary-100 pb-2">
                      <span className="font-medium">Dimensiones:</span>
                      <span>{producto.dimensiones}</span>
                    </div>
                  )}
                  {producto.cuidados && (
                    <div className="flex justify-between border-b border-secondary-100 pb-2">
                      <span className="font-medium">Cuidados:</span>
                      <span>{producto.cuidados}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reseñas */}
          {producto.reviews && (
            <ProductReviews 
              reviews={producto.reviews} 
              productoId={producto.id}
              puntuacionPromedio={producto.puntuacionPromedio}
            />
          )}

          {/* Productos relacionados */}
          {producto.productosRelacionados && producto.productosRelacionados.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {producto.productosRelacionados.map((productoRelacionado) => (
                  <ProductCard 
                    key={productoRelacionado.id} 
                    producto={productoRelacionado} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}