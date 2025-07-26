"use client"

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import PaymentForm from '@/components/checkout/PaymentForm'
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
  const { items, summary, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState<ShippingData>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    provincia: '',
    pais: 'Espa?a'
  })

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">??</div>
          <h1 className="text-3xl font-bold mb-4">Tu carrito est¨¢ vac¨ªo</h1>
          <p className="text-secondary-600 mb-8">
            A?ade algunos productos antes de proceder al checkout
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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    const requiredFields: (keyof ShippingData)[] = [
      'nombre', 'apellidos', 'email', 'direccion', 'ciudad', 'codigoPostal', 'provincia'
    ]
    
    const hasEmptyFields = requiredFields.some(field => !shippingData[field].trim())
    
    if (hasEmptyFields) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    // Avanzar al paso de pago
    setCurrentStep(2)
  }

  const handleInputChange = (field: keyof ShippingData, value: string) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentSuccess = (pedidoId: string) => {
    // Limpiar carrito despu¨¦s del pago exitoso
    clearCart()
    // El componente PaymentForm maneja la redirecci¨®n
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header con pasos */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Finalizar Compra</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-secondary-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Env¨ªo</span>
            </div>
            <div className="flex-1 h-1 bg-secondary-200">
              <div className={`h-full bg-primary-600 transition-all duration-300 ${
                currentStep >= 2 ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-secondary-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Pago</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario principal */}
          <div>
            {currentStep === 1 ? (
              /* Paso 1: Informaci¨®n de env¨ªo */
              <form onSubmit={handleShippingSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Informaci¨®n de Env¨ªo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nombre *"
                        placeholder="Tu nombre"
                        value={shippingData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        required
                      />
                      <Input
                        label="Apellidos *"
                        placeholder="Tus apellidos"
                        value={shippingData.apellidos}
                        onChange={(e) => handleInputChange('apellidos', e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="Email *"
                      type="email"
                      placeholder="tu@email.com"
                      value={shippingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    <Input
                      label="Tel¨¦fono"
                      placeholder="+34 600 000 000"
                      value={shippingData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                    />
                    <Input
                      label="Direcci¨®n *"
                      placeholder="Calle, n¨²mero"
                      value={shippingData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Ciudad *"
                        placeholder="Tu ciudad"
                        value={shippingData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        required
                      />
                      <Input
                        label="C¨®digo Postal *"
                        placeholder="28001"
                        value={shippingData.codigoPostal}
                        onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="Provincia *"
                      placeholder="Madrid"
                      value={shippingData.provincia}
                      onChange={(e) => handleInputChange('provincia', e.target.value)}
                      required
                    />

                    <div className="pt-4">
                      <Button type="submit" className="w-full" size="lg">
                        Continuar al Pago
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            ) : (
              /* Paso 2: Pago */
              <div>
                {/* Resumen de env¨ªo */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Informaci¨®n de Env¨ªo
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                      >
                        Editar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-secondary-600 space-y-1">
                      <p className="font-medium text-secondary-900">
                        {shippingData.nombre} {shippingData.apellidos}
                      </p>
                      <p>{shippingData.direccion}</p>
                      <p>{shippingData.ciudad}, {shippingData.codigoPostal}</p>
                      <p>{shippingData.provincia}, {shippingData.pais}</p>
                      <p>{shippingData.email}</p>
                      {shippingData.telefono && <p>{shippingData.telefono}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Formulario de pago */}
                <PaymentForm
                  total={summary.total}
                  items={items}
                  shippingData={shippingData}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}
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
                          {item.talla && <span>Talla: {item.talla} ? </span>}
                          {item.color && <span>Color: {item.color} ? </span>}
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
                    <span>Subtotal ({summary.itemsCount} art¨ªculos):</span>
                    <span>€{summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Env¨ªo:</span>
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

                {/* Informaci¨®n de seguridad */}
                <div className="text-xs text-secondary-600 space-y-1">
                  <p>? Env¨ªo discreto garantizado</p>
                  <p>? Devoluciones hasta 30 d¨ªas</p>
                  <p>? Pago 100% seguro con Stripe</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}