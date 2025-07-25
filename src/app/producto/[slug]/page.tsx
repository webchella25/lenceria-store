// src/app/producto/[slug]/page.tsx (ACTUALIZACIÓN)
"use client"

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import AddToCartButton from '@/components/carrito/AddToCartButton'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import type { Producto } from '@prisma/client'

// Datos mock - En producción vendría de la API
const getProducto = async (slug: string) => {
  // Simular datos de producto
  return {
    id: "1",
    slug: "conjunto-encaje-rojo",
    nombre: "Conjunto de Encaje Rojo Pasión",
    descripcion: "Elegante conjunto de lencería de encaje en color rojo pasión. Incluye sujetador con copa soft y braguita a juego. Diseño sensual y cómodo para ocasiones especiales.",
    precio: 45.00,
    precioOferta: 32.99,
    stock: 15,
    activo: true,
    destacado: true,
    nuevo: true,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Rojo", "Negro", "Blanco"],
    materiales: ["90% Polyamida", "10% Elastano"],
    cuidados: "Lavado a mano en agua fría. No usar lejía. Secar a la sombra.",
    peso: 0.2,
    imagenes: [
      {
        url: "https://images.unsplash.com/photo-1571513722275-4b9cfe847c80?w=500",
        altText: "Conjunto de encaje rojo - vista frontal"
      },
      {
        url: "https://images.unsplash.com/photo-1571513722275-4b9cfe847c80?w=500",
        altText: "Conjunto de encaje rojo - vista posterior"
      }
    ],
    categoria: {
      nombre: "Conjuntos",
      slug: "conjuntos"
    }
  }
}

export default function ProductoPage({ params }: { params: { slug: string } }) {
  const [producto, setProducto] = useState<any>(null)
  const [selectedTalla, setSelectedTalla] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await getProducto(params.slug)
        if (!data) {
          notFound()
        }
        setProducto(data)
        setSelectedTalla(data.tallas[0] || "")
        setSelectedColor(data.colores[0] || "")
      } catch (error) {
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-secondary-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-secondary-200 rounded"></div>
              <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
              <div className="h-6 bg-secondary-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!producto) {
    notFound()
  }

  const precioFinal = producto.precioOferta || producto.precio
  const descuento = producto.precioOferta 
    ? calculateDiscount(producto.precio, producto.precioOferta)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square overflow-hidden rounded-lg bg-secondary-100">
              <img
                src={producto.imagenes[selectedImage]?.url || '/placeholder.jpg'}
                alt={producto.imagenes[selectedImage]?.altText || producto.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {producto.imagenes.length > 1 && (
              <div className="flex gap-2">
                {producto.imagenes.map((imagen: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <img
                      src={imagen.url}
                      alt={imagen.altText || `${producto.nombre} - imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {producto.nuevo && (
                <Badge variant="success">NUEVO</Badge>
              )}
              {descuento > 0 && (
                <Badge variant="primary">-{descuento}% DESCUENTO</Badge>
              )}
              {producto.stock <= 5 && producto.stock > 0 && (
                <Badge variant="warning">¡Últimas {producto.stock} unidades!</Badge>
              )}
            </div>

            {/* Título y precio */}
            <div>
              <h1 className="text-3xl font-bold text-secondary-800 mb-2">
                {producto.nombre}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(precioFinal)}
                </span>
                {producto.precioOferta && (
                  <span className="text-xl text-secondary-500 line-through">
                    {formatPrice(producto.precio)}
                  </span>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <p className="text-secondary-700 leading-relaxed">
                {producto.descripcion}
              </p>
            </div>

            {/* Selector de talla */}
            {producto.tallas.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Talla:</h3>
                <div className="flex gap-2">
                  {producto.tallas.map((talla: string) => (
                    <button
                      key={talla}
                      onClick={() => setSelectedTalla(talla)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedTalla === talla
                          ? 'border-primary bg-primary text-white'
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de color */}
            {producto.colores.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color:</h3>
                <div className="flex gap-2">
                  {producto.colores.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-white'
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón añadir al carrito */}
            <div className="space-y-3">
              <AddToCartButton
                producto={producto}
                selectedTalla={selectedTalla}
                selectedColor={selectedColor}
                className="w-full py-4 text-lg font-semibold"
              />
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  ♡ Lista de Deseos
                </Button>
                <Button variant="outline">
                  📤 Compartir
                </Button>
              </div>
            </div>

            {/* Información adicional */}
            <Card className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span>🚚</span>
                  <span>Envío discreto en 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↩️</span>
                  <span>Devoluciones hasta 30 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>Atención al cliente especializada</span>
                </div>
              </div>
            </Card>

            {/* Detalles del producto */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Detalles del Producto</h3>
              
              {producto.materiales.length > 0 && (
                <div>
                  <h4 className="font-medium mb-1">Materiales:</h4>
                  <p className="text-sm text-secondary-700">
                    {producto.materiales.join(", ")}
                  </p>
                </div>
              )}

              {producto.cuidados && (
                <div>
                  <h4 className="font-medium mb-1">Cuidados:</h4>
                  <p className="text-sm text-secondary-700">
                    {producto.cuidados}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-1">Stock disponible:</h4>
                <p className="text-sm text-secondary-700">
                  {producto.stock} unidades
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}