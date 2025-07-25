import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

async function getCategoriaYProductos(categoriaSlug: string) {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { slug: categoriaSlug, activa: true }
    })

    if (!categoria) {
      return null
    }

    const productos = await prisma.producto.findMany({
      where: { 
        categoriaId: categoria.id,
        activo: true 
      },
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

    return { categoria, productos }
  } catch (error) {
    console.error('Error fetching categoria y productos:', error)
    return null
  }
}

export default async function CategoriaPage({ params }: PageProps) {
  const data = await getCategoriaYProductos(params.slug)

  if (!data) {
    notFound()
  }

  const { categoria, productos } = data

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header de categoría */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-800 mb-4">
          {categoria.nombre}
        </h1>
        {categoria.descripcion && (
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            {categoria.descripcion}
          </p>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <span>›</span>
        <Link href="/productos" className="hover:text-primary">Productos</Link>
        <span>›</span>
        <span className="text-secondary-800 font-medium">{categoria.nombre}</span>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Link href="/productos">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
            Todos
          </Badge>
        </Link>
        <Badge variant="default" className="cursor-pointer">
          {categoria.nombre}
        </Badge>
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
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🌹
                </div>
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {producto.nuevo && <Badge variant="new">¡Nuevo!</Badge>}
                  {producto.destacado && <Badge variant="featured">Destacado</Badge>}
                  {producto.precioOferta && <Badge variant="destructive">¡Oferta!</Badge>}
                </div>

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="shadow-lg">Vista rápida</Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-secondary-800 mb-2 line-clamp-2">
                  {producto.nombre}
                </h3>

                {producto.descripcionCorta && (
                  <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                    {producto.descripcionCorta}
                  </p>
                )}

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
                  </div>
                )}

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
                  
                  <Badge 
                    variant={producto.stock > 0 ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                  </Badge>
                </div>

                <Link href={`/producto/${producto.slug}`}>
                  <Button className="w-full" disabled={producto.stock === 0}>
                    {producto.stock > 0 ? 'Ver producto' : 'Agotado'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌹</div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">
            No hay productos en esta categoría
          </h3>
          <p className="text-secondary-600 mb-6">
            Estamos preparando productos para {categoria.nombre.toLowerCase()}. ¡Vuelve pronto!
          </p>
          <Link href="/productos">
            <Button>Ver todos los productos</Button>
          </Link>
        </div>
      )}
    </div>
  )
}