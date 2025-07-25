// src/components/carrito/AddToCartButton.tsx
"use client"

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import type { Producto } from '@prisma/client'

interface AddToCartButtonProps {
  producto: Producto & {
    imagenes: { url: string; altText: string | null }[]
  }
  selectedTalla?: string
  selectedColor?: string
  className?: string
}

export default function AddToCartButton({ 
  producto, 
  selectedTalla, 
  selectedColor,
  className 
}: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity, canAddMore } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const itemInCart = isInCart(producto.id, selectedTalla, selectedColor)
  const currentQuantity = getItemQuantity(producto.id, selectedTalla, selectedColor)
  const canAdd = canAddMore(producto.id, selectedTalla, selectedColor)

  const handleAddToCart = async () => {
    if (!canAdd) return

    setIsAdding(true)
    
    try {
      addToCart({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        precioOferta: producto.precioOferta || undefined,
        imagen: producto.imagenes[0]?.url || '/placeholder.jpg',
        talla: selectedTalla,
        color: selectedColor,
        stock: producto.stock,
        peso: producto.peso || undefined
      })

      // Pequeña pausa para feedback visual
      await new Promise(resolve => setTimeout(resolve, 300))
    } finally {
      setIsAdding(false)
    }
  }

  // Si no hay stock
  if (producto.stock <= 0) {
    return (
      <Button disabled className={className}>
        Sin Stock
      </Button>
    )
  }

  // Si no puede añadir más (máximo stock alcanzado)
  if (itemInCart && !canAdd) {
    return (
      <Button disabled className={className}>
        Máximo en Carrito ({currentQuantity})
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={className}
    >
      {isAdding ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Añadiendo...
        </>
      ) : itemInCart ? (
        `Añadir Más (${currentQuantity} en carrito)`
      ) : (
        'Añadir al Carrito'
      )}
    </Button>
  )
}