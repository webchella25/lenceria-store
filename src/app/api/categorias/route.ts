// src/app/api/categorias/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProductCount = searchParams.get('includeProductCount') === 'true'

    // Obtener categorías activas
    const categorias = await prisma.categoria.findMany({
      where: {
        activa: true
      },
      orderBy: [
        { orden: 'asc' },
        { nombre: 'asc' }
      ],
      include: includeProductCount ? {
        _count: {
          select: {
            productos: {
              where: {
                activo: true
              }
            }
          }
        }
      } : undefined
    })

    return NextResponse.json(categorias)

  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validación básica
    if (!body.nombre || !body.slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el slug no exista
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { slug: body.slug }
    })

    if (categoriaExistente) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con este slug' },
        { status: 409 }
      )
    }

    // Crear categoría
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion || null,
        imagen: body.imagen || null,
        activa: body.activa ?? true,
        orden: body.orden ?? 0
      }
    })

    return NextResponse.json(nuevaCategoria, { status: 201 })

  } catch (error) {
    console.error('Error al crear categoría:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}