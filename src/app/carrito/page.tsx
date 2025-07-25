// src/app/carrito/page.tsx
"use client"

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import CartItem from '@/components/carrito/CartItem'

export default function CarritoPage() {
  const { items, summary, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-secondary-600 mb-8">
            ¡Explora nuestra colección y encuentra algo especial!
          </p>
          <Link href="/productos">
            <Button size="lg">
              Explorar Productos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Tu Carrito</h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            Vaciar Carrito
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({summary.itemsCount} artículos):</span>
                  <span>€{summary.subtotal.toFixed(2)}</span>
                </div>
                
                {summary.descuento > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span>-€{summary.descuento.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>
                    {summary.envio === 0 ? (
                      <span className="text-green-600 font-medium">GRATIS</span>
                    ) : (
                      `€${summary.envio.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>€{summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Envío gratis info */}
              {summary.subtotal < 50 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-primary-700">
                    🚚 <strong>¡Envío gratis!</strong> Añade €{(50 - summary.subtotal).toFixed(2)} más
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Finalizar Compra
                  </Button>
                </Link>
                
                <Link href="/productos" className="block">
                  <Button variant="outline" className="w-full">
                    Seguir Comprando
                  </Button>
                </Link>
              </div>

              {/* Información adicional */}
              <div className="mt-6 text-xs text-secondary-600 space-y-1">
                <p>✓ Envío discreto garantizado</p>
                <p>✓ Devoluciones hasta 30 días</p>
                <p>✓ Pago 100% seguro</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}