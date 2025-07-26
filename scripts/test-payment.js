require('dotenv').config({ path: '.env.local' })

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

async function testPaymentFlow() {
  log('\n💳 TEST DE FLUJO DE PAGO COMPLETO', 'bright')
  log('=' * 40, 'cyan')
  
  if (!process.env.STRIPE_SECRET_KEY) {
    log('❌ STRIPE_SECRET_KEY no configurado', 'red')
    return
  }
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  
  try {
    // Test 1: Crear Payment Intent
    log('\n1️⃣ Creando Payment Intent...', 'blue')
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2295, // €22.95
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        test: 'payment-flow',
        productos: 'Conjunto Sexy Rosa + Medias',
        cliente: 'test@lenceriastore.es'
      }
    })
    
    log(`  ✅ Payment Intent creado: ${paymentIntent.id}`, 'green')
    log(`  💰 Monto: €${(paymentIntent.amount / 100).toFixed(2)}`, 'cyan')
    log(`  🔑 Client Secret: ${paymentIntent.client_secret.substring(0, 30)}...`, 'cyan')
    
    // Test 2: Simular confirmación de pago
    log('\n2️⃣ Simulando confirmación de pago...', 'blue')
    
    const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa' // Método de prueba de Stripe
    })
    
    log(`  ✅ Pago confirmado: ${confirmed.status}`, 'green')
    log(`  📧 Receipt URL: ${confirmed.charges.data[0]?.receipt_url || 'N/A'}`, 'cyan')
    
    // Test 3: Verificar metadata
    log('\n3️⃣ Verificando metadata...', 'blue')
    
    for (const [key, value] of Object.entries(confirmed.metadata)) {
      log(`  📝 ${key}: ${value}`, 'cyan')
    }
    
    // Test 4: Simular webhook
    log('\n4️⃣ Simulando webhook...', 'blue')
    
    log('  📡 Evento: payment_intent.succeeded', 'cyan')
    log('  🎯 Acción: Actualizar pedido en BD', 'cyan')
    log('  📧 Acción: Enviar email confirmación', 'cyan')
    log('  🚚 Acción: Crear pedido en Love Cherry', 'cyan')
    
    log('\n🎉 ¡TEST DE PAGO COMPLETADO EXITOSAMENTE!', 'green')
    log('\n🧪 Tarjetas de prueba recomendadas:', 'bright')
    log('  • Visa: 4242 4242 4242 4242', 'cyan')
    log('  • Mastercard: 5555 5555 5555 4444', 'cyan')
    log('  • Amex: 3782 822463 10005', 'cyan')
    log('  • Fallo: 4000 0000 0000 0002', 'yellow')
    
  } catch (error) {
    log(`❌ Error en test de pago: ${error.message}`, 'red')
    
    if (error.code) {
      log(`  Código: ${error.code}`, 'red')
    }
    if (error.type) {
      log(`  Tipo: ${error.type}`, 'red')
    }
  }
}

testPaymentFlow()