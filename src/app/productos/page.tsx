import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import AddToCartButton from "@/components/carrito/AddToCartButton"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

async function getProductos() {
  try {
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      include: {
        categoria: true,
        imagenes: {
          orderBy: { orden: 'asc' },
          take: 1
        }
      },
      orderBy: [
        { destacado: 'desc' },
        { nuevo: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    return productos
  } catch (error) {
    console.error('Error fetching productos:', error)
    return []
  }
}

export default async function ProductosPage() {
  const productos = await getProductos()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-800 mb-4">
          Nuestra Colección
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Descubre nuestra selección exclusiva de lencería premium. 
          Cada pieza está cuidadosamente seleccionada para ofrecerte la máxima calidad y elegancia.
        </p>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Link href="/productos">
          <Badge variant="default" className="cursor-pointer">
            Todos
          </Badge>
        </Link>
        <Link href="/categoria/conjuntos">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
            Conjuntos
          </Badge>
        </Link>
        <Link href="/categoria/bodies">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
            Bodies
          </Badge>
        </Link>
        <Link href="/categoria/babydolls">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
            Babydolls
          </Badge>
        </Link>
        <Link href="/categoria/para-el">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
            Para Él
          </Badge>
        </Link>
      </div>

      {/* Grid de productos */}
      {productos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <Card key={producto.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-square bg-gradient-to-br from-accent-50 to-accent-100">
                {/* Placeholder para imagen */}
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🌹
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {producto.nuevo && (
                    <Badge variant="new">¡Nuevo!</Badge>
                  )}
                  {producto.destacado && (
                    <Badge variant="featured">Destacado</Badge>
                  )}
                  {producto.precioOferta && (
                    <Badge variant="destructive">¡Oferta!</Badge>
                  )}
                </div>

                {/* Botón rápido - aparece en hover */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="shadow-lg">
                    Vista rápida
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                {/* Categoría */}
                <p className="text-xs text-secondary-500 uppercase tracking-wide mb-1">
                  {producto.categoria.nombre}
                </p>

                {/* Nombre del producto */}
                <h3 className="font-semibold text-secondary-800 mb-2 line-clamp-2">
                  {producto.nombre}
                </h3>

                {/* Descripción corta */}
                {producto.descripcionCorta && (
                  <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                    {producto.descripcionCorta}
                  </p>
                )}

                {/* Tallas disponibles */}
                {producto.tallas.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {producto.tallas.slice(0, 4).map((talla) => (
                      <span 
                        key={talla}
                        className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded"
                      >
                        {talla}
                      </span>
                    ))}
                    {producto.tallas.length > 4 && (
                      <span className="text-xs text-secondary-500">
                        +{producto.tallas.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Precios */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {producto.precioOferta ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(producto.precioOferta)}
                        </span>
                        <span className="text-sm text-secondary-500 line-through">
                          {formatPrice(producto.precio)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-secondary-800">
                        {formatPrice(producto.precio)}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock */}
                  <Badge 
                    variant={producto.stock > 0 ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                  </Badge>
                </div>

                {/* Botón de acción */}
                <div className="space-y-2">
  <AddToCartButton
    producto={producto}
    selectedTalla={producto.tallas[0]} // Talla por defecto
    className="w-full"
  />
  <Link href={`/producto/${producto.slug}`}>
    <Button variant="outline" className="w-full text-sm">
      Ver detalles
    </Button>
  </Link>
</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌹</div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-secondary-600 mb-6">
            Estamos preparando nuestra colección. ¡Vuelve pronto!
          </p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      )}

      {/* Info adicional */}
      {productos.length > 0 && (
        <div className="mt-16 text-center bg-accent-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">
            ¿Necesitas ayuda con las tallas?
          </h3>
          <p className="text-secondary-600 mb-6">
            Consulta nuestra guía de tallas para encontrar el ajuste perfecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ayuda/tallas">
              <Button variant="outline">Guía de tallas</Button>
            </Link>
            <Link href="/ayuda/contacto">
              <Button variant="outline">Contactar asesor</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}