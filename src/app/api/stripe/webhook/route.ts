import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        
        // Actualizar pedido como confirmado
        const pedido = await prisma.pedido.update({
          where: { 
            stripePaymentId: paymentIntent.id 
          },
          data: {
            estado: 'CONFIRMADO',
            metodoPago: 'Tarjeta de crédito',
            updatedAt: new Date()
          },
          include: {
            items: {
              include: {
                producto: true
              }
            }
          }
        })

        if (pedido) {
          console.log(`Pedido ${pedido.numero} confirmado exitosamente`)
          
          // TODO: Enviar email de confirmación
          // await sendOrderConfirmationEmail(pedido)
          
          // TODO: Crear pedido automático en Love Cherry
          // await createLoveCherryOrder(pedido)
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        
        // Marcar pedido como cancelado
        await prisma.pedido.update({
          where: { 
            stripePaymentId: failedPayment.id 
          },
          data: {
            estado: 'CANCELADO',
            updatedAt: new Date()
          }
        })
        
        console.log(`Pago fallido para pedido con payment_intent: ${failedPayment.id}`)
        break

      default:
        console.log(`Evento no manejado: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error(`Error procesando webhook:`, error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}