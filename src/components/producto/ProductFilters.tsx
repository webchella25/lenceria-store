// src/components/producto/ProductFilters.tsx
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ProductoFiltros } from '@/types/producto'

interface ProductFiltersProps {
  filtros: ProductoFiltros
  onFiltrosChange: (filtros: ProductoFiltros) => void
  categorias?: Array<{ slug: string; nombre: string }>
  loading?: boolean
  className?: string
}

export default function ProductFilters({
  filtros,
  onFiltrosChange,
  categorias = [],
  loading = false,
  className = ""
}: ProductFiltersProps) {
  const [filtrosLocales, setFiltrosLocales] = useState<ProductoFiltros>(filtros)

  // Opciones predefinidas
  const generosDisponibles = [
    { value: 'MUJER', label: 'Para Mujer' },
    { value: 'HOMBRE', label: 'Para Hombre' },
    { value: 'UNISEX', label: 'Unisex' }
  ]

  const tallasDisponibles = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  
  const coloresDisponibles = [
    'Negro', 'Blanco', 'Rosa', 'Rojo', 'Azul', 'Verde',
    'Morado', 'Dorado', 'Plateado', 'Transparente'
  ]

  const opcionesOrdenamiento = [
    { value: 'fecha_desc', label: 'Más recientes' },
    { value: 'precio_asc', label: 'Precio: menor a mayor' },
    { value: 'precio_desc', label: 'Precio: mayor a menor' },
    { value: 'nombre_asc', label: 'Nombre A-Z' },
    { value: 'nombre_desc', label: 'Nombre Z-A' },
    { value: 'popularidad', label: 'Más populares' }
  ]

  // Aplicar filtros cuando cambien
  const aplicarFiltros = () => {
    onFiltrosChange({ ...filtrosLocales, pagina: 1 })
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    const filtrosVacios: ProductoFiltros = {
      ordenarPor: 'fecha_desc',
      limite: filtros.limite || 12
    }
    setFiltrosLocales(filtrosVacios)
    onFiltrosChange(filtrosVacios)
  }

  // Actualizar filtros locales cuando cambien los props
  useEffect(() => {
    setFiltrosLocales(filtros)
  }, [filtros])

  // Contar filtros activos
  const filtrosActivos = Object.keys(filtros).filter(key => {
    const valor = filtros[key as keyof ProductoFiltros]
    return valor !== undefined && valor !== null && valor !== '' && 
           (Array.isArray(valor) ? valor.length > 0 : true)
  }).length - 2 // Excluir ordenarPor y limite

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar productos..."
              value={filtrosLocales.busqueda || ''}
              onChange={(e) => setFiltrosLocales(prev => ({ ...prev, busqueda: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
            />
            <Button onClick={aplicarFiltros} disabled={loading}>
              🔍
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ordenamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ordenar por</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={filtrosLocales.ordenarPor || 'fecha_desc'}
            onChange={(e) => {
              const nuevos = { ...filtrosLocales, ordenarPor: e.target.value as any }
              setFiltrosLocales(nuevos)
              onFiltrosChange(nuevos)
            }}
            className="w-full p-2 border border-secondary-200 rounded-md"
            disabled={loading}
          >
            {opcionesOrdenamiento.map(opcion => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Categorías */}
      {categorias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={!filtrosLocales.categoria ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const nuevos = { ...filtrosLocales, categoria: undefined }
                  setFiltrosLocales(nuevos)
                  onFiltrosChange(nuevos)
                }}
                className="w-full justify-start"
                disabled={loading}
              >
                Todas las categorías
              </Button>
              {categorias.map(categoria => (
                <Button
                  key={categoria.slug}
                  variant={filtrosLocales.categoria === categoria.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const nuevos = { ...filtrosLocales, categoria: categoria.slug }
                    setFiltrosLocales(nuevos)
                    onFiltrosChange(nuevos)
                  }}
                  className="w-full justify-start"
                  disabled={loading}
                >
                  {categoria.nombre}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Género */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Género</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {generosDisponibles.map(genero => (
              <label key={genero.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="genero"
                  value={genero.value}
                  checked={filtrosLocales.genero === genero.value}
                  onChange={(e) => {
                    const nuevos = { ...filtrosLocales, genero: e.target.value as any }
                    setFiltrosLocales(nuevos)
                    onFiltrosChange(nuevos)
                  }}
                  disabled={loading}
                />
                <span className="text-sm">{genero.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Precio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Precio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-secondary-600">Precio mínimo</label>
              <Input
                type="number"
                placeholder="0"
                value={filtrosLocales.precioMin || ''}
                onChange={(e) => setFiltrosLocales(prev => ({ 
                  ...prev, 
                  precioMin: e.target.value ? Number(e.target.value) : undefined 
                }))}
                min="0"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm text-secondary-600">Precio máximo</label>
              <Input
                type="number"
                placeholder="1000"
                value={filtrosLocales.precioMax || ''}
                onChange={(e) => setFiltrosLocales(prev => ({ 
                  ...prev, 
                  precioMax: e.target.value ? Number(e.target.value) : undefined 
                }))}
                min="0"
                disabled={loading}
              />
            </div>
            <Button onClick={aplicarFiltros} size="sm" className="w-full" disabled={loading}>
              Aplicar rango de precio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tallas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tallas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tallasDisponibles.map(talla => (
              <Badge
                key={talla}
                variant={filtrosLocales.tallas?.includes(talla) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const tallasActuales = filtrosLocales.tallas || []
                  const nuevasTallas = tallasActuales.includes(talla)
                    ? tallasActuales.filter(t => t !== talla)
                    : [...tallasActuales, talla]
                  
                  const nuevos = { ...filtrosLocales, tallas: nuevasTallas.length > 0 ? nuevasTallas : undefined }
                  setFiltrosLocales(nuevos)
                  onFiltrosChange(nuevos)
                }}
              >
                {talla}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Colores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Colores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {coloresDisponibles.map(color => (
              <Badge
                key={color}
                variant={filtrosLocales.colores?.includes(color) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const coloresActuales = filtrosLocales.colores || []
                  const nuevosColores = coloresActuales.includes(color)
                    ? coloresActuales.filter(c => c !== color)
                    : [...coloresActuales, color]
                  
                  const nuevos = { ...filtrosLocales, colores: nuevosColores.length > 0 ? nuevosColores : undefined }
                  setFiltrosLocales(nuevos)
                  onFiltrosChange(nuevos)
                }}
              >
                {color}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Características especiales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Características</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtrosLocales.destacados || false}
                onChange={(e) => {
                  const nuevos = { ...filtrosLocales, destacados: e.target.checked || undefined }
                  setFiltrosLocales(nuevos)
                  onFiltrosChange(nuevos)
                }}
                disabled={loading}
              />
              <span className="text-sm">Productos destacados</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtrosLocales.nuevos || false}
                onChange={(e) => {
                  const nuevos = { ...filtrosLocales, nuevos: e.target.checked || undefined }
                  setFiltrosLocales(nuevos)
                  onFiltrosChange(nuevos)
                }}
                disabled={loading}
              />
              <span className="text-sm">Productos nuevos</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtrosLocales.enStock || false}
                onChange={(e) => {
                  const nuevos = { ...filtrosLocales, enStock: e.target.checked || undefined }
                  setFiltrosLocales(nuevos)
                  onFiltrosChange(nuevos)
                }}
                disabled={loading}
              />
              <span className="text-sm">Solo en stock</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="space-y-3">
        <Button onClick={aplicarFiltros} className="w-full" disabled={loading}>
          {loading ? 'Aplicando...' : 'Aplicar filtros'}
        </Button>
        
        {filtrosActivos > 0 && (
          <Button variant="outline" onClick={limpiarFiltros} className="w-full" disabled={loading}>
            Limpiar filtros ({filtrosActivos})
          </Button>
        )}
      </div>
    </div>
  )
}