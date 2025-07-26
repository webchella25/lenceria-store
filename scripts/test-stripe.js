require('dotenv').config({ path: '.env.local' })

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

async function testStripeConnection() {
  try {
    console.log('🧪 Probando conexión con Stripe...')
    
    // Test 1: Verificar claves
    console.log('✅ Clave secreta configurada')
    console.log('✅ Clave pública configurada:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Sí' : 'No')
    
    // Test 2: Crear un payment intent de prueba
    const testPayment = await stripe.paymentIntents.create({
      amount: 100, // 1€
      currency: 'eur',
      metadata: { test: 'true' }
    })
    
    console.log('✅ Payment Intent de prueba creado:', testPayment.id)
    
    // Test 3: Cancelar el payment intent
    await stripe.paymentIntents.cancel(testPayment.id)
    console.log('✅ Payment Intent cancelado correctamente')
    
    console.log('🎉 ¡Stripe está configurado correctamente!')
    
  } catch (error) {
    console.error('❌ Error en la configuración de Stripe:', error.message)
  }
}

testStripeConnection()