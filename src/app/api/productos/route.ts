// src/app/api/productos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ProductoFiltros } from '@/types/producto'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extraer parámetros de filtros
    const filtros: ProductoFiltros = {
      categoria: searchParams.get('categoria') || undefined,
      genero: searchParams.get('genero') as 'MUJER' | 'HOMBRE' | 'UNISEX' || undefined,
      precioMin: searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : undefined,
      precioMax: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : undefined,
      tallas: searchParams.get('tallas')?.split(',') || undefined,
      colores: searchParams.get('colores')?.split(',') || undefined,
      destacados: searchParams.get('destacados') === 'true' || undefined,
      nuevos: searchParams.get('nuevos') === 'true' || undefined,
      enStock: searchParams.get('enStock') === 'true' || undefined,
      busqueda: searchParams.get('busqueda') || undefined,
      ordenarPor: searchParams.get('ordenarPor') as any || 'fecha_desc',
      pagina: Number(searchParams.get('pagina')) || 1,
      limite: Number(searchParams.get('limite')) || 12,
    }

    // Construir condiciones WHERE de Prisma
    const whereConditions: any = {
      activo: true,
    }

    // Filtro por categoría
    if (filtros.categoria) {
      whereConditions.categoria = {
        slug: filtros.categoria
      }
    }

    // Filtro por género
    if (filtros.genero) {
      whereConditions.genero = filtros.genero
    }

    // Filtro por precio
    if (filtros.precioMin || filtros.precioMax) {
      whereConditions.precio = {}
      if (filtros.precioMin) whereConditions.precio.gte = filtros.precioMin
      if (filtros.precioMax) whereConditions.precio.lte = filtros.precioMax
    }

    // Filtro por tallas
    if (filtros.tallas && filtros.tallas.length > 0) {
      whereConditions.tallas = {
        hasSome: filtros.tallas
      }
    }

    // Filtro por colores
    if (filtros.colores && filtros.colores.length > 0) {
      whereConditions.colores = {
        hasSome: filtros.colores
      }
    }

    // Filtro destacados
    if (filtros.destacados) {
      whereConditions.destacado = true
    }

    // Filtro nuevos
    if (filtros.nuevos) {
      whereConditions.nuevo = true
    }

    // Filtro en stock
    if (filtros.enStock) {
      whereConditions.stock = {
        gt: 0
      }
    }

    // Filtro por búsqueda
    if (filtros.busqueda) {
      whereConditions.OR = [
        {
          nombre: {
            contains: filtros.busqueda,
            mode: 'insensitive'
          }
        },
        {
          descripcion: {
            contains: filtros.busqueda,
            mode: 'insensitive'
          }
        },
        {
          descripcionCorta: {
            contains: filtros.busqueda,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Construir ordenamiento
    let orderBy: any = {}
    switch (filtros.ordenarPor) {
      case 'precio_asc':
        orderBy = { precio: 'asc' }
        break
      case 'precio_desc':
        orderBy = { precio: 'desc' }
        break
      case 'nombre_asc':
        orderBy = { nombre: 'asc' }
        break
      case 'nombre_desc':
        orderBy = { nombre: 'desc' }
        break
      case 'popularidad':
        orderBy = { destacado: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Calcular skip para paginación
    const skip = (filtros.pagina! - 1) * filtros.limite!

    // Ejecutar consultas en paralelo
    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where: whereConditions,
        orderBy,
        skip,
        take: filtros.limite,
        include: {
          categoria: true,
          imagenes: {
            orderBy: { orden: 'asc' }
          },
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.producto.count({
        where: whereConditions
      })
    ])

    // Calcular metadatos de paginación
    const totalPaginas = Math.ceil(total / filtros.limite!)

    return NextResponse.json({
      productos,
      total,
      pagina: filtros.pagina,
      totalPaginas,
      limite: filtros.limite
    })

  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Aquí iría la lógica para crear un producto
    // Por ahora devolvemos método no permitido
    return NextResponse.json(
      { error: 'Método no implementado aún' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}