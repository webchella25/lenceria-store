"use client"

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const elementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      '::placeholder': {
        color: '#9CA3AF',
      },
    },
  },
}

interface PaymentFormProps {
  total: number
  items: any[]
  shippingData: any
  onSuccess: (pedidoId: string) => void
}

function CheckoutForm({ total, items, shippingData, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Crear payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingData,
          total,
        }),
      })

      const { clientSecret, pedidoId, numeroPedido, error: apiError } = await response.json()

      if (apiError) {
        setError(apiError)
        return
      }

      // Confirmar pago
      const cardElement = elements.getElement(CardNumberElement)!
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingData.nombre,
              email: shippingData.email,
              address: {
                line1: shippingData.direccion,
                city: shippingData.ciudad,
                postal_code: shippingData.codigoPostal,
                state: shippingData.provincia,
                country: 'ES',
              },
            },
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message || 'Error en el pago')
        return
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success('¡Pago completado exitosamente!')
        onSuccess(pedidoId)
        router.push(`/pedido-confirmado/${numeroPedido}`)
      }

    } catch (err: any) {
      setError(err.message || 'Error procesando el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Número de tarjeta */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Número de tarjeta
            </label>
            <div className="p-3 border border-secondary-300 rounded-lg bg-white">
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          {/* Fecha y CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Fecha de vencimiento
              </label>
              <div className="p-3 border border-secondary-300 rounded-lg bg-white">
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                CVC
              </label>
              <div className="p-3 border border-secondary-300 rounded-lg bg-white">
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botón de pago */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!stripe || loading}
          >
            {loading ? 'Procesando...' : `Pagar €${total.toFixed(2)}`}
          </Button>

          {/* Información de seguridad */}
          <div className="text-xs text-secondary-500 text-center">
            <p>🔒 Pago seguro procesado por Stripe</p>
            <p>No guardamos información de tu tarjeta</p>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}