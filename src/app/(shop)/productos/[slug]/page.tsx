"use client"

import { useState, useEffect } from "react"
import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/carrito/AddToCartButton"

interface PageProps {
  params: {
    slug: string
  }
}

async function getProducto(slug: string) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { slug, activo: true },
      include: {
        categoria: true,
        imagenes: {
          orderBy: { orden: "asc" }
        }
      }
    })

    return producto
  } catch (error) {
    console.error("Error fetching producto:", error)
    return null
  }
}

export default async function ProductoPage({ params }: PageProps) {
  const producto = await getProducto(params.slug)

  if (!producto) {
    notFound()
  }

  return <ProductoPageClient producto={producto} />
}

function ProductoPageClient({ producto }: { producto: any }) {
  const [selectedTalla, setSelectedTalla] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  useEffect(() => {
    if (producto) {
      setSelectedTalla(producto.tallas[0] || "")
      setSelectedColor(producto.colores[0] || "")
    }
  }, [producto])

  const descuentoPorcentaje = producto.precioOferta 
    ? Math.round((1 - producto.precioOferta / producto.precio) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <span>›</span>
        <Link href="/productos" className="hover:text-primary">Productos</Link>
        <span>›</span>
        <Link href={`/categoria/${producto.categoria.slug}`} className="hover:text-primary">
          {producto.categoria.nombre}
        </Link>
        <span>›</span>
        <span className="text-secondary-800 font-medium">{producto.nombre}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg overflow-hidden relative">
            <div className="w-full h-full flex items-center justify-center text-8xl">
              🌹
            </div>
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {producto.nuevo && <Badge variant="new">¡Nuevo!</Badge>}
              {producto.destacado && <Badge variant="featured">Destacado</Badge>}
              {producto.precioOferta && <Badge variant="destructive">-{descuentoPorcentaje}%</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="aspect-square bg-accent-100 rounded-md flex items-center justify-center text-2xl cursor-pointer hover:bg-accent-200 transition-colors"
              >
                🌹
              </div>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-secondary-500 uppercase tracking-wide mb-2">
              {producto.categoria.nombre}
            </p>
            <h1 className="text-3xl font-bold text-secondary-800 mb-4">
              {producto.nombre}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              {producto.precioOferta ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(producto.precioOferta)}
                  </span>
                  <span className="text-xl text-secondary-500 line-through">
                    {formatPrice(producto.precio)}
                  </span>
                  <Badge variant="destructive">
                    Ahorras {formatPrice(producto.precio - producto.precioOferta)}
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-secondary-800">
                  {formatPrice(producto.precio)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Badge variant={producto.stock > 0 ? "success" : "destructive"}>
                {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
              </Badge>
              {producto.stock > 0 && producto.stock <= 5 && (
                <span className="text-sm text-yellow-600">
                  ¡Quedan pocas unidades!
                </span>
              )}
            </div>
          </div>

          {producto.descripcionCorta && (
            <div>
              <p className="text-lg text-secondary-700">
                {producto.descripcionCorta}
              </p>
            </div>
          )}

          {producto.tallas.length > 0 && (
            <div>
              <h3 className="font-semibold text-secondary-800 mb-3">Talla</h3>
              <div className="grid grid-cols-4 gap-2">
                {producto.tallas.map((talla: string) => (
                  <button
                    key={talla}
                    onClick={() => setSelectedTalla(talla)}
                    className={`border py-2 px-3 rounded-md text-center font-medium transition-colors ${
                      selectedTalla === talla
                        ? "border-primary text-primary bg-primary-50"
                        : "border-secondary-300 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>
          )}

          {producto.colores.length > 0 && (
            <div>
              <h3 className="font-semibold text-secondary-800 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {producto.colores.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`border py-2 px-4 rounded-md font-medium transition-colors ${
                      selectedColor === color
                        ? "border-primary text-primary bg-primary-50"
                        : "border-secondary-300 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <AddToCartButton
              producto={producto}
              selectedTalla={selectedTalla}
              selectedColor={selectedColor}
              className="w-full text-lg py-3"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                💝 Lista de deseos
              </Button>
              <Button variant="outline" className="w-full">
                📧 Notificarme
              </Button>
            </div>
          </div>

          <Card className="border-accent-200 bg-accent-50">
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>📦</span>
                <span>Envío gratis en 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>Packaging 100% discreto</span>
              </div>
              <div className="flex items-center gap-2">
                <span>↩️</span>
                <span>Devolución en 30 días</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {producto.descripcion && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">Descripción</h2>
          <div className="prose max-w-none">
            <p className="text-secondary-700 leading-relaxed whitespace-pre-line">
              {producto.descripcion}
            </p>
          </div>
        </div>
      )}

      {/* Detalles del producto */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Materiales */}
        {producto.materiales.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-secondary-800 mb-4">Materiales</h3>
              <ul className="space-y-2">
                {producto.materiales.map((material: string) => (
                  <li key={material} className="text-secondary-600">
                    • {material}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Cuidados */}
        {producto.cuidados && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-secondary-800 mb-4">Cuidados</h3>
              <p className="text-secondary-600 whitespace-pre-line">
                {producto.cuidados}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dimensiones */}
        {(producto.peso || producto.dimensiones) && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-secondary-800 mb-4">Especificaciones</h3>
              <div className="space-y-2 text-secondary-600">
                {producto.peso && (
                  <div>Peso: {producto.peso}g</div>
                )}
                {producto.dimensiones && (
                  <div>Dimensiones: {producto.dimensiones}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}