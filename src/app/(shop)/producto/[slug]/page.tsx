// src/app/(shop)/producto/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProductDetail from '@/components/producto/ProductDetail'
import { prisma } from '@/lib/db'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProducto(slug: string) {
  try {
    const producto = await prisma.producto.findUnique({
      where: {
        slug: slug,
        activo: true
      },
      include: {
        categoria: true,
        imagenes: {
          orderBy: { orden: 'asc' }
        },
        reviews: {
          where: { activa: true },
          include: {
            usuario: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { 
            reviews: { where: { activa: true } }
          }
        }
      }
    })

    if (!producto) {
      return null
    }

    // Calcular puntuación promedio
    const reviewsActivas = await prisma.review.findMany({
      where: {
        productoId: producto.id,
        activa: true
      },
      select: { puntuacion: true }
    })

    const puntuacionPromedio = reviewsActivas.length > 0
      ? reviewsActivas.reduce((sum, review) => sum + review.puntuacion, 0) / reviewsActivas.length
      : 0

    // Obtener productos relacionados
    const productosRelacionados = await prisma.producto.findMany({
      where: {
        categoriaId: producto.categoriaId,
        activo: true,
        NOT: { id: producto.id }
      },
      include: {
        categoria: true,
        imagenes: {
          orderBy: { orden: 'asc' }
        },
        _count: {
          select: { reviews: true }
        }
      },
      take: 4,
      orderBy: [
        { destacado: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return {
      ...producto,
      puntuacionPromedio: Math.round(puntuacionPromedio * 10) / 10,
      productosRelacionados
    }
  } catch (error) {
    console.error('Error al obtener producto:', error)
    return null
  }
}

export default async function ProductoPage({ params }: PageProps) {
  // Await de los parámetros (Next.js 15+)
  const { slug } = await params
  
  const producto = await getProducto(slug)

  if (!producto) {
    notFound()
  }

  return <ProductDetail producto={producto} />
}

// Generar metadata dinámicamente
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  const producto = await prisma.producto.findUnique({
    where: { slug, activo: true },
    include: { categoria: true }
  })

  if (!producto) {
    return {
      title: 'Producto no encontrado - Lencería Store',
    }
  }

  const precio = producto.precioOferta || producto.precio

  return {
    title: `${producto.nombre} - ${producto.categoria.nombre} | Lencería Store`,
    description: producto.descripcionCorta || `${producto.nombre} - ${producto.categoria.nombre}. Lencería premium con envío discreto en 24h. Precio: €${precio}`,
    keywords: `${producto.nombre}, ${producto.categoria.nombre}, lencería, ${producto.slug}`,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcionCorta || '',
      images: producto.imagenes?.[0]?.url ? [producto.imagenes[0].url] : [],
    },
  }
}