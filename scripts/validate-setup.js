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

async function validateStripeSetup() {
  log('\n🔍 VALIDANDO CONFIGURACIÓN DE STRIPE', 'bright')
  log('=' * 45, 'cyan')
  
  const checks = []
  
  // Check 1: Variables de entorno
  log('\n📝 Verificando variables de entorno...', 'blue')
  
  const envVars = {
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
    'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET
  }
  
  for (const [key, value] of Object.entries(envVars)) {
    if (value) {
      log(`  ✅ ${key}: Configurado`, 'green')
      checks.push(true)
    } else {
      log(`  ❌ ${key}: No configurado`, 'red')
      checks.push(false)
    }
  }
  
  // Check 2: Formato de claves
  log('\n🔑 Verificando formato de claves...', 'blue')
  
  if (envVars['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']) {
    const pk = envVars['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']
    if (pk.startsWith('pk_test_') || pk.startsWith('pk_live_')) {
      log(`  ✅ Clave pública: Formato correcto`, 'green')
      checks.push(true)
    } else {
      log(`  ❌ Clave pública: Formato incorrecto`, 'red')
      checks.push(false)
    }
  }
  
  if (envVars['STRIPE_SECRET_KEY']) {
    const sk = envVars['STRIPE_SECRET_KEY']
    if (sk.startsWith('sk_test_') || sk.startsWith('sk_live_')) {
      log(`  ✅ Clave secreta: Formato correcto`, 'green')
      checks.push(true)
    } else {
      log(`  ❌ Clave secreta: Formato incorrecto`, 'red')
      checks.push(false)
    }
  }
  
  if (envVars['STRIPE_WEBHOOK_SECRET']) {
    const ws = envVars['STRIPE_WEBHOOK_SECRET']
    if (ws.startsWith('whsec_')) {
      log(`  ✅ Webhook secret: Formato correcto`, 'green')
      checks.push(true)
    } else {
      log(`  ❌ Webhook secret: Formato incorrecto`, 'red')
      checks.push(false)
    }
  }
  
  // Check 3: Consistencia test/live
  log('\n🎯 Verificando consistencia test/live...', 'blue')
  
  const isTestPK = envVars['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']?.startsWith('pk_test_')
  const isTestSK = envVars['STRIPE_SECRET_KEY']?.startsWith('sk_test_')
  
  if (isTestPK === isTestSK) {
    log(`  ✅ Claves consistentes (${isTestPK ? 'TEST' : 'LIVE'} mode)`, 'green')
    checks.push(true)
  } else {
    log(`  ❌ Claves inconsistentes (mezcla test/live)`, 'red')
    checks.push(false)
  }
  
  // Check 4: Conexión con Stripe
  if (envVars['STRIPE_SECRET_KEY']) {
    log('\n🌐 Probando conexión con Stripe...', 'blue')
    
    try {
      const stripe = require('stripe')(envVars['STRIPE_SECRET_KEY'])
      const account = await stripe.accounts.retrieve()
      log(`  ✅ Conexión exitosa (${account.display_name || account.id})`, 'green')
      checks.push(true)
    } catch (error) {
      log(`  ❌ Error de conexión: ${error.message}`, 'red')
      checks.push(false)
    }
  }
  
  // Check 5: Archivos requeridos
  log('\n📁 Verificando archivos del proyecto...', 'blue')
  
  const requiredFiles = [
    'src/lib/stripe.ts',
    'src/app/api/stripe/create-payment-intent/route.ts',
    'src/app/api/stripe/webhook/route.ts',
    'src/components/checkout/PaymentForm.tsx'
  ]
  
  const fs = require('fs')
  const path = require('path')
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      log(`  ✅ ${file}`, 'green')
      checks.push(true)
    } else {
      log(`  ❌ ${file} (falta)`, 'red')
      checks.push(false)
    }
  }
  
  // Resumen final
  log('\n📊 RESUMEN DE VALIDACIÓN', 'bright')
  log('=' * 30, 'cyan')
  
  const passed = checks.filter(Boolean).length
  const total = checks.length
  const percentage = Math.round((passed / total) * 100)
  
  log(`\n  Checks pasados: ${passed}/${total} (${percentage}%)`, 'cyan')
  
  if (percentage === 100) {
    log('  🎉 ¡Todo está configurado correctamente!', 'green')
    log('\n🚀 Tu tienda está lista para recibir pagos:', 'bright')
    log('  • Modo actual: ' + (isTestPK ? 'TEST 🧪' : 'LIVE 🚀'), 'cyan')
    log('  • Tarjeta de prueba: 4242 4242 4242 4242', 'cyan')
    log('  • URL de checkout: /checkout', 'cyan')
  } else if (percentage >= 80) {
    log('  ⚠️ Configuración casi completa', 'yellow')
    log('  Revisa los elementos marcados con ❌', 'yellow')
  } else {
    log('  ❌ Configuración incompleta', 'red')
    log('  Ejecuta: npm run setup:stripe', 'red')
  }
  
  log('\n' + '=' * 50, 'cyan')
}

validateStripeSetup().catch(error => {
  log(`❌ Error en validación: ${error.message}`, 'red')
})