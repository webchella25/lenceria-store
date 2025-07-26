import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, formatAmountForStripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, shippingData, total } = body

    // Validar que los items existen y calcular el total
    const productIds = items.map((item: any) => item.productoId)
    const products = await prisma.producto.findMany({
      where: { id: { in: productIds } }
    })

    let calculatedTotal = 0
    const validatedItems = []

    for (const item of items) {
      const product = products.find(p => p.id === item.productoId)
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${item.productoId}` },
          { status: 400 }
        )
      }

      const precio = product.precioOferta || product.precio
      const itemTotal = precio * item.cantidad
      calculatedTotal += itemTotal

      validatedItems.push({
        ...item,
        precio,
        nombre: product.nombre
      })
    }

    // Añadir gastos de envío (ejemplo: gratis si > 50€, sino 4.95€)
    const gastoEnvio = calculatedTotal >= 50 ? 0 : 4.95
    calculatedTotal += gastoEnvio

    // Verificar que el total coincide (tolerancia de 1 céntimo)
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: "El total no coincide con el calculado" },
        { status: 400 }
      )
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(calculatedTotal),
      currency: 'eur',
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email || '',
        itemsCount: items.length.toString(),
        shippingCost: gastoEnvio.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Crear pedido en base de datos con estado PENDIENTE
    const numeroPedido = `LS-${Date.now()}`
    
    const pedido = await prisma.pedido.create({
      data: {
        numero: numeroPedido,
        estado: 'PENDIENTE',
        subtotal: calculatedTotal - gastoEnvio,
        envio: gastoEnvio,
        total: calculatedTotal,
        stripePaymentId: paymentIntent.id,
        usuarioId: session.user.id,
        nombreEnvio: shippingData.nombre,
        emailEnvio: shippingData.email,
        telefonoEnvio: shippingData.telefono || null,
        direccionEnvio: shippingData.direccion,
        ciudadEnvio: shippingData.ciudad,
        cpEnvio: shippingData.codigoPostal,
        provinciaEnvio: shippingData.provincia,
        paisEnvio: shippingData.pais || 'España',
        items: {
          create: validatedItems.map(item => ({
            cantidad: item.cantidad,
            precio: item.precio,
            talla: item.talla || null,
            color: item.color || null,
            productoId: item.productoId,
          }))
        }
      },
      include: {
        items: {
          include: {
            producto: true
          }
        }
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      pedidoId: pedido.id,
      numeroPedido: pedido.numero,
    })

  } catch (error: any) {
    console.error("Error creando payment intent:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}