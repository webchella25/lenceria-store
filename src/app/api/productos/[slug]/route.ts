// src/app/api/productos/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug del producto requerido' },
        { status: 400 }
      )
    }

    // Buscar producto por slug
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
          take: 10 // Limitamos a 10 reviews más recientes
        },
        _count: {
          select: { 
            reviews: { where: { activa: true } }
          }
        }
      }
    })

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Calcular puntuación promedio de reviews
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

    // Obtener productos relacionados de la misma categoría
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

    // Preparar respuesta
    const productoConExtras = {
      ...producto,
      puntuacionPromedio: Math.round(puntuacionPromedio * 10) / 10,
      productosRelacionados
    }

    return NextResponse.json(productoConExtras)

  } catch (error) {
    console.error('Error al obtener producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Aquí iría la lógica para actualizar un producto
    // Por ahora devolvemos método no implementado
    return NextResponse.json(
      { error: 'Método no implementado aún' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Aquí iría la lógica para eliminar un producto
    // Por ahora devolvemos método no implementado
    return NextResponse.json(
      { error: 'Método no implementado aún' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}