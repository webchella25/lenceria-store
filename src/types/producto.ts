// src/types/producto.ts
export interface Producto {
  id: string
  nombre: string
  slug: string
  descripcion?: string
  descripcionCorta?: string
  precio: number
  precioOferta?: number
  sku?: string
  codigoLoveCherry?: string
  stock: number
  activo: boolean
  destacado: boolean
  nuevo: boolean
  genero: 'MUJER' | 'HOMBRE' | 'UNISEX'
  tallas: string[]
  colores: string[]
  materiales: string[]
  cuidados?: string
  peso?: number
  dimensiones?: string
  createdAt: Date
  updatedAt: Date
  categoriaId: string
  categoria: Categoria
  imagenes: ProductoImagen[]
  reviews?: Review[]
  _count?: {
    reviews: number
  }
}

export interface Categoria {
  id: string
  nombre: string
  slug: string
  descripcion?: string
  imagen?: string
  activa: boolean
  orden: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductoImagen {
  id: string
  url: string
  altText?: string
  orden: number
  principal: boolean
  productoId: string
}

export interface Review {
  id: string
  puntuacion: number
  titulo?: string
  comentario?: string
  verificada: boolean
  activa: boolean
  createdAt: Date
  updatedAt: Date
  usuarioId: string
  productoId: string
}

export interface ProductoFiltros {
  categoria?: string
  genero?: 'MUJER' | 'HOMBRE' | 'UNISEX'
  precioMin?: number
  precioMax?: number
  tallas?: string[]
  colores?: string[]
  destacados?: boolean
  nuevos?: boolean
  enStock?: boolean
  busqueda?: string
  ordenarPor?: 'precio_asc' | 'precio_desc' | 'nombre_asc' | 'nombre_desc' | 'fecha_desc' | 'popularidad'
  pagina?: number
  limite?: number
}

export interface ProductosResponse {
  productos: Producto[]
  total: number
  pagina: number
  totalPaginas: number
  limite: number
}