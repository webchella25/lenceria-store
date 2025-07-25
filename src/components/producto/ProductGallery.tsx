// src/components/producto/ProductGallery.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { ProductoImagen } from '@/types/producto'

interface ProductGalleryProps {
  imagenes: ProductoImagen[]
  nombreProducto: string
  className?: string
}

export default function ProductGallery({ 
  imagenes, 
  nombreProducto, 
  className = "" 
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className={`aspect-square bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-6xl text-primary">🌹</span>
      </div>
    )
  }

  const imagenActual = imagenes[selectedIndex]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % imagenes.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Imagen principal */}
      <div className="relative group">
        <div 
          className={`aspect-square overflow-hidden rounded-lg bg-accent-50 relative cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}`}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <Image
            src={imagenActual.url}
            alt={imagenActual.altText || `${nombreProducto} - Imagen ${selectedIndex + 1}`}
            fill
            className={`object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={isZoomed ? {
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
            } : undefined}
            priority={selectedIndex === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Overlay de zoom */}
          {!isZoomed && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                <span className="text-lg">🔍</span>
              </div>
            </div>
          )}

          {/* Navegación con flechas */}
          {imagenes.length > 1 && !isZoomed && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                ←
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                →
              </Button>
            </>
          )}

          {/* Indicador de imagen actual */}
          {imagenes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {imagenes.length}
            </div>
          )}
        </div>
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {imagenes.map((imagen, index) => (
            <button
              key={imagen.id}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedIndex === index 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-secondary-200 hover:border-secondary-300'
              }`}
            >
              <Image
                src={imagen.url}
                alt={imagen.altText || `${nombreProducto} miniatura ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Instrucciones de zoom */}
      <div className="text-center text-sm text-secondary-500">
        {isZoomed ? (
          <p>Mueve el cursor para explorar • Haz clic para cerrar zoom</p>
        ) : (
          <p>Haz clic en la imagen para hacer zoom</p>
        )}
      </div>
    </div>
  )
}