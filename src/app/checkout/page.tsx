// src/app/checkout/page.tsx
"use client"

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, summary } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-secondary-600 mb-8">
            Añade algunos productos antes de proceder al checkout
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de envío */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nombre" placeholder="Tu nombre" />
                  <Input label="Apellidos" placeholder="Tus apellidos" />
                </div>
                <Input label="Email" type="email" placeholder="tu@email.com" />
                <Input label="Teléfono" placeholder="+34 600 000 000" />
                <Input label="Dirección" placeholder="Calle, número" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Ciudad" placeholder="Tu ciudad" />
                  <Input label="Código Postal" placeholder="28001" />
                </div>
                <Input label="Provincia" placeholder="Madrid" />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Información de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-secondary-600 mb-4">
                    🚧 Integración de pagos en desarrollo
                  </p>
                  <p className="text-sm text-secondary-500">
                    Próximamente: Stripe, PayPal, y más opciones
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 border border-secondary-100 rounded">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.nombre}</h4>
                        <div className="text-xs text-secondary-600">
                          {item.talla && <span>Talla: {item.talla} • </span>}
                          {item.color && <span>Color: {item.color} • </span>}
                          <span>Cantidad: {item.cantidad}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          €{((item.precioOferta || item.precio) * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="space-y-2 mb-6 border-t border-secondary-200 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({summary.itemsCount} artículos):</span>
                    <span>€{summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>
                      {summary.envio === 0 ? 'Gratis' : `€${summary.envio.toFixed(2)}`}
                    </span>
                  </div>
                  {summary.descuento > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-€{summary.descuento.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-secondary-200 pt-2">
                    <span>Total:</span>
                    <span>€{summary.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled
                  >
                    🚧 Procesar Pago (Próximamente)
                  </Button>
                  <Link href="/carrito">
                    <Button variant="outline" className="w-full">
                      ← Volver al Carrito
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}