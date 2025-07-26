require('dotenv').config({ path: '.env.local' })
const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(colors.cyan + prompt + colors.reset, resolve)
  })
}

async function updateEnvFile(key, value) {
  const envPath = path.join(process.cwd(), '.env.local')
  let envContent = ''
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8')
  } catch (error) {
    log('Creando archivo .env.local...', 'yellow')
  }
  
  const lines = envContent.split('\n')
  const keyIndex = lines.findIndex(line => line.startsWith(`${key}=`))
  
  if (keyIndex !== -1) {
    lines[keyIndex] = `${key}="${value}"`
    log(`✅ Actualizado ${key}`, 'green')
  } else {
    lines.push(`${key}="${value}"`)
    log(`✅ Añadido ${key}`, 'green')
  }
  
  fs.writeFileSync(envPath, lines.join('\n'))
}

async function testStripeConnection(secretKey) {
  try {
    const stripe = require('stripe')(secretKey)
    const testPayment = await stripe.paymentIntents.create({
      amount: 100,
      currency: 'eur',
      metadata: { test: 'setup-script' }
    })
    await stripe.paymentIntents.cancel(testPayment.id)
    return true
  } catch (error) {
    log(`❌ Error probando Stripe: ${error.message}`, 'red')
    return false
  }
}

async function createWebhookEndpoint(secretKey, webhookUrl) {
  try {
    const stripe = require('stripe')(secretKey)
    
    log('🔗 Creando webhook endpoint...', 'blue')
    
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'payment_intent.canceled'
      ],
      description: 'Lencería Store - Webhook para confirmación de pagos'
    })
    
    log(`✅ Webhook creado exitosamente: ${webhook.id}`, 'green')
    log(`📝 Secret del webhook: ${webhook.secret}`, 'yellow')
    
    return webhook.secret
  } catch (error) {
    log(`❌ Error creando webhook: ${error.message}`, 'red')
    return null
  }
}

async function setupStripe() {
  log('\n🚀 SETUP AUTOMÁTICO DE STRIPE PARA LENCERÍA STORE', 'bright')
  log('=' * 55, 'cyan')
  
  log('\n📋 Este script te ayudará a configurar Stripe paso a paso:', 'blue')
  log('  1. Configurar claves de API', 'blue')
  log('  2. Crear webhook automáticamente', 'blue')
  log('  3. Probar la conexión', 'blue')
  log('  4. Actualizar variables de entorno', 'blue')
  
  const proceed = await question('\n¿Quieres continuar? (y/N): ')
  if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
    log('❌ Setup cancelado', 'red')
    rl.close()
    return
  }
  
  log('\n📝 PASO 1: Configuración de claves de API', 'bright')
  log('Ve a: https://dashboard.stripe.com/test/apikeys', 'cyan')
  
  // Obtener clave pública
  let publishableKey = await question('\n🔑 Pega tu clave pública (pk_test_...): ')
  while (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    log('❌ La clave pública debe empezar con pk_test_ o pk_live_', 'red')
    publishableKey = await question('🔑 Pega tu clave pública: ')
  }
  
  // Obtener clave secreta
  let secretKey = await question('🔐 Pega tu clave secreta (sk_test_...): ')
  while (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    log('❌ La clave secreta debe empezar con sk_test_ o sk_live_', 'red')
    secretKey = await question('🔐 Pega tu clave secreta: ')
  }
  
  // Verificar conexión
  log('\n🧪 PASO 2: Probando conexión con Stripe...', 'bright')
  const connectionOk = await testStripeConnection(secretKey)
  
  if (!connectionOk) {
    log('❌ La conexión con Stripe falló. Verifica tus claves.', 'red')
    rl.close()
    return
  }
  
  log('✅ Conexión con Stripe exitosa!', 'green')
  
  // Configurar webhook
  log('\n🔗 PASO 3: Configuración del webhook', 'bright')
  const setupWebhook = await question('¿Quieres que configure el webhook automáticamente? (Y/n): ')
  
  let webhookSecret = ''
  
  if (setupWebhook.toLowerCase() !== 'n' && setupWebhook.toLowerCase() !== 'no') {
    let webhookUrl = await question('🌐 URL de tu aplicación (ej: https://mi-tienda.vercel.app): ')
    
    if (!webhookUrl.startsWith('http')) {
      webhookUrl = 'https://' + webhookUrl
    }
    
    webhookUrl += '/api/stripe/webhook'
    
    log(`📡 Creando webhook para: ${webhookUrl}`, 'blue')
    
    const secret = await createWebhookEndpoint(secretKey, webhookUrl)
    if (secret) {
      webhookSecret = secret
    } else {
      log('⚠️ No se pudo crear el webhook automáticamente', 'yellow')
      log('Puedes crearlo manualmente en: https://dashboard.stripe.com/test/webhooks', 'cyan')
      webhookSecret = await question('🔐 Pega el secret del webhook (whsec_...) o presiona Enter para omitir: ')
    }
  } else {
    log('📝 Para crear el webhook manualmente:', 'yellow')
    log('  1. Ve a: https://dashboard.stripe.com/test/webhooks', 'cyan')
    log('  2. Clic en "Add endpoint"', 'cyan')
    log('  3. URL: https://tu-dominio.com/api/stripe/webhook', 'cyan')
    log('  4. Eventos: payment_intent.succeeded, payment_intent.payment_failed', 'cyan')
    
    webhookSecret = await question('🔐 Pega el secret del webhook (whsec_...) o presiona Enter para omitir: ')
  }
  
  // Actualizar archivo .env.local
  log('\n💾 PASO 4: Actualizando variables de entorno...', 'bright')
  
  await updateEnvFile('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', publishableKey)
  await updateEnvFile('STRIPE_SECRET_KEY', secretKey)
  
  if (webhookSecret) {
    await updateEnvFile('STRIPE_WEBHOOK_SECRET', webhookSecret)
  }
  
  // Test final
  log('\n🎯 PASO 5: Test final del setup...', 'bright')
  
  try {
    // Simular carga de variables de entorno
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = publishableKey
    process.env.STRIPE_SECRET_KEY = secretKey
    if (webhookSecret) process.env.STRIPE_WEBHOOK_SECRET = webhookSecret
    
    log('✅ Variables de entorno configuradas', 'green')
    log('✅ Test de conexión completado', 'green')
    
    log('\n🎉 ¡SETUP COMPLETADO EXITOSAMENTE!', 'bright')
    log('=' * 40, 'green')
    
    log('\n📋 Resumen de la configuración:', 'bright')
    log(`  • Clave pública: ${publishableKey.substring(0, 20)}...`, 'cyan')
    log(`  • Clave secreta: ${secretKey.substring(0, 20)}...`, 'cyan')
    log(`  • Webhook: ${webhookSecret ? 'Configurado ✅' : 'Pendiente ⚠️'}`, 'cyan')
    log(`  • Modo: ${secretKey.startsWith('sk_test_') ? 'TEST 🧪' : 'LIVE 🚀'}`, 'cyan')
    
    log('\n🚀 Próximos pasos:', 'bright')
    log('  1. Reinicia tu servidor de desarrollo', 'blue')
    log('  2. Ve a /checkout para probar el pago', 'blue')
    log('  3. Usa la tarjeta 4242 4242 4242 4242 para testing', 'blue')
    
    if (!webhookSecret) {
      log('\n⚠️ IMPORTANTE: Configura el webhook manualmente para completar la integración', 'yellow')
    }
    
  } catch (error) {
    log(`❌ Error en el test final: ${error.message}`, 'red')
  }
  
  rl.close()
}

// Ejecutar setup
setupStripe().catch(error => {
  log(`❌ Error fatal: ${error.message}`, 'red')
  rl.close()
})