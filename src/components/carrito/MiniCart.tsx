// src/components/carrito/MiniCart.tsx
"use client"

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default function MiniCart() {
  const { items, summary, isOpen, toggleCart, removeItem } = useCart()

  return (
    <div className="relative">
      {/* Botón del carrito */}
      <Button
        variant="ghost"
        onClick={toggleCart}
        className="relative p-2"
        aria-label={`Carrito con ${summary.itemsCount} artículos`}
      >
        <span className="text-xl">🛒</span>
        {summary.itemsCount > 0 && (
          <Badge 
            variant="primary" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
          >
            {summary.itemsCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown del carrito */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/20" 
            onClick={toggleCart}
          />
          
          {/* Contenido del carrito */}
          <div className="absolute right-0 top-full z-50 mt-2 w-80 bg-white rounded-lg shadow-xl border border-secondary-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Tu Carrito</h3>
                <button
                  onClick={toggleCart}
                  className="text-secondary-400 hover:text-secondary-600"
                  aria-label="Cerrar carrito"
                >
                  ✕
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-secondary-600 mb-4">Tu carrito está vacío</p>
                  <Link href="/productos">
                    <Button onClick={toggleCart}>
                      Explorar Productos
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Items del carrito */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 border border-secondary-100 rounded">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.nombre}</h4>
                          <div className="text-xs text-secondary-600 space-y-1">
                            {item.talla && <p>Talla: {item.talla}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                            <p>Cantidad: {item.cantidad}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            €{((item.precioOferta || item.precio) * item.cantidad).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen */}
                  <div className="border-t border-secondary-200 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>€{summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío:</span>
                      <span>
                        {summary.envio === 0 ? 'GRATIS' : `€${summary.envio.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>€{summary.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-2 mt-4">
                    <Link href="/carrito" className="block">
                      <Button variant="outline" className="w-full" onClick={toggleCart}>
                        Ver Carrito
                      </Button>
                    </Link>
                    <Link href="/checkout" className="block">
                      <Button className="w-full" onClick={toggleCart}>
                        Finalizar Compra
                      </Button>
                    </Link>
                  </div>

                  {/* Envío gratis reminder */}
                  {summary.subtotal < 50 && (
                    <div className="mt-3 p-2 bg-primary-50 rounded text-xs text-center">
                      🚚 Añade €{(50 - summary.subtotal).toFixed(2)} más para envío gratuito
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}