"use client"

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

interface ShippingData {
  nombre: string
  apellidos: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  codigoPostal: string
  provincia: string
  pais: string
}

export default function CheckoutPage() {
  const { items, summary } = useCart()
  const [shippingData, setShippingData] = useState<ShippingData>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    provincia: '',
    pais: 'España'
  })

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

  const handleInputChange = (field: keyof ShippingData, value: string) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    placeholder="Tu nombre"
                    value={shippingData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                  />
                  <Input
                    label="Apellidos"
                    placeholder="Tus apellidos"
                    value={shippingData.apellidos}
                    onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  value={shippingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <Input
                  label="Teléfono"
                  placeholder="+34 600 000 000"
                  value={shippingData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                />
                <Input
                  label="Dirección"
                  placeholder="Calle, número"
                  value={shippingData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    placeholder="Tu ciudad"
                    value={shippingData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                  />
                  <Input
                    label="Código Postal"
                    placeholder="28001"
                    value={shippingData.codigoPostal}
                    onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                  />
                </div>
                <Input
                  label="Provincia"
                  placeholder="Madrid"
                  value={shippingData.provincia}
                  onChange={(e) => handleInputChange('provincia', e.target.value)}
                />
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

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
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

                <div className="space-y-2 mb-6 border-t border-secondary-200 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({summary.itemsCount} artículos):</span>
                    <span>€{summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>
                      {summary.envio === 0 ? 'GRATIS' : `€${summary.envio.toFixed(2)}`}
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

                <div className="mt-6 text-xs text-secondary-600 space-y-1">
                  <p>✓ Envío discreto garantizado</p>
                  <p>✓ Devoluciones hasta 30 días</p>
                  <p>✓ Pago 100% seguro</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}