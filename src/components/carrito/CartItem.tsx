// src/components/carrito/CartItem.tsx
"use client"

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import type { CartItem as CartItemType } from '@/types/carrito'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const precioUnitario = item.precioOferta || item.precio
  const precioTotal = precioUnitario * item.cantidad

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, Math.min(newQuantity, item.stock))
    }
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Imagen del producto */}
        <div className="flex-shrink-0">
          <img
            src={item.imagen}
            alt={item.nombre}
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
          />
        </div>

        {/* Información del producto */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-lg">{item.nombre}</h3>
              <div className="text-sm text-secondary-600 space-y-1">
                {item.talla && <p>Talla: <span className="font-medium">{item.talla}</span></p>}
                {item.color && <p>Color: <span className="font-medium">{item.color}</span></p>}
              </div>
            </div>
            
            {/* Precio */}
            <div className="text-right">
              <div className="font-semibold text-lg">
                €{precioTotal.toFixed(2)}
              </div>
              {item.precioOferta && (
                <div className="text-sm text-secondary-500">
                  <span className="line-through">€{(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              )}
              <div className="text-xs text-secondary-600">
                €{precioUnitario.toFixed(2)} / unidad
              </div>
            </div>
          </div>

          {/* Controles de cantidad y acciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Selector de cantidad */}
              <div className="flex items-center border border-secondary-300 rounded">
                <button
                  onClick={() => handleQuantityChange(item.cantidad - 1)}
                  className="px-2 py-1 hover:bg-secondary-100 text-secondary-600"
                  disabled={item.cantidad <= 1}
                >
                  −
                </button>
                <span className="px-3 py-1 min-w-[3rem] text-center">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.cantidad + 1)}
                  className="px-2 py-1 hover:bg-secondary-100 text-secondary-600"
                  disabled={item.cantidad >= item.stock}
                >
                  +
                </button>
              </div>

              {/* Stock disponible */}
              <span className="text-xs text-secondary-500">
                ({item.stock} disponibles)
              </span>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Eliminar
            </button>
          </div>

          {/* Advertencia de stock bajo */}
          {item.stock <= 3 && item.stock > 0 && (
            <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              ⚠️ ¡Solo quedan {item.stock} unidades!
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}