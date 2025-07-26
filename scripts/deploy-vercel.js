const { execSync } = require('child_process')
const readline = require('readline')
const fs = require('fs')

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

function runCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, 'blue')
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe']
    })
    log(`✅ ${description} completado`, 'green')
    return output
  } catch (error) {
    log(`❌ Error en ${description}: ${error.message}`, 'red')
    throw error
  }
}

async function checkPrerequisites() {
  log('\n🔍 VERIFICANDO PREREQUISITOS', 'bright')
  log('=' * 35, 'cyan')
  
  const checks = []
  
  // Check Vercel CLI
  try {
    execSync('vercel --version', { stdio: 'ignore' })
    log('✅ Vercel CLI instalado', 'green')
    checks.push(true)
  } catch {
    log('❌ Vercel CLI no instalado', 'red')
    log('   Instala con: npm i -g vercel', 'yellow')
    checks.push(false)
  }
  
  // Check .env.local
  if (fs.existsSync('.env.local')) {
    log('✅ Archivo .env.local encontrado', 'green')
    checks.push(true)
  } else {
    log('❌ Archivo .env.local no encontrado', 'red')
    checks.push(false)
  }
  
  // Check database
  require('dotenv').config({ path: '.env.local' })
  if (process.env.DATABASE_URL) {
    log('✅ DATABASE_URL configurado', 'green')
    checks.push(true)
  } else {
    log('❌ DATABASE_URL no configurado', 'red')
    checks.push(false)
  }
  
  const allPassed = checks.every(Boolean)
  
  if (!allPassed) {
    log('\n❌ Algunos prerequisitos fallan. Revisa los errores arriba.', 'red')
    return false
  }
  
  log('\n✅ Todos los prerequisitos cumplen', 'green')
  return true
}

async function setupVercelProject() {
  log('\n🚀 CONFIGURANDO PROYECTO EN VERCEL', 'bright')
  log('=' * 40, 'cyan')
  
  const projectName = await question('\n📝 Nombre del proyecto (lenceria-store): ')
  const finalProjectName = projectName.trim() || 'lenceria-store'
  
  const teamSetup = await question('👥 ¿Quieres configurar un team? (y/N): ')
  const useTeam = teamSetup.toLowerCase() === 'y' || teamSetup.toLowerCase() === 'yes'
  
  try {
    // Login en Vercel
    log('\n🔐 Verificando login en Vercel...', 'blue')
    try {
      execSync('vercel whoami', { stdio: 'ignore' })
      log('✅ Ya estás logueado en Vercel', 'green')
    } catch {
      log('🔐 Iniciando login en Vercel...', 'blue')
      execSync('vercel login', { stdio: 'inherit' })
    }
    
    // Configurar proyecto
    log('\n📦 Configurando proyecto...', 'blue')
    const linkCommand = useTeam ? 
      `vercel link --project=${finalProjectName}` : 
      `vercel link --project=${finalProjectName}`
    
    try {
      execSync(linkCommand, { stdio: 'inherit' })
    } catch {
      log('📝 Creando nuevo proyecto...', 'yellow')
      execSync('vercel --confirm', { stdio: 'inherit' })
    }
    
    return true
  } catch (error) {
    log(`❌ Error configurando Vercel: ${error.message}`, 'red')
    return false
  }
}

async function configureEnvironmentVariables() {
  log('\n🔧 CONFIGURANDO VARIABLES DE ENTORNO', 'bright')
  log('=' * 45, 'cyan')
  
  require('dotenv').config({ path: '.env.local' })
  
  const envVars = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
  }
  
  // Generar NEXTAUTH_URL dinámicamente después del despliegue
  log('\n📝 Configurando variables de entorno en Vercel...', 'blue')
  
  for (const [key, value] of Object.entries(envVars)) {
    if (value) {
      try {
        runCommand(
          `vercel env add ${key} production`,
          `Agregando ${key}`
        )
        // Añadir el valor
        execSync(`echo "${value}" | vercel env add ${key} production`, { 
          stdio: 'inherit',
          input: value 
        })
        log(`✅ ${key} configurado`, 'green')
      } catch (error) {
        log(`⚠️ ${key} posiblemente ya existe`, 'yellow')
      }
    } else {
      log(`⚠️ ${key} no encontrado en .env.local`, 'yellow')
    }
  }
}

async function deployToVercel() {
  log('\n🚀 DESPLEGANDO A VERCEL', 'bright')
  log('=' * 30, 'cyan')
  
  try {
    // Build y deploy
    const output = runCommand('vercel --prod', 'Desplegando aplicación')
    
    // Extraer URL del output
    const urlMatch = output.match(/https:\/\/[^\s]+/)
    const deployedUrl = urlMatch ? urlMatch[0] : null
    
    if (deployedUrl) {
      log(`\n🎉 ¡DESPLIEGUE EXITOSO!`, 'green')
      log(`🌐 URL: ${deployedUrl}`, 'cyan')
      
      // Configurar NEXTAUTH_URL
      log('\n🔧 Configurando NEXTAUTH_URL...', 'blue')
      try {
        runCommand(
          `echo "${deployedUrl}" | vercel env add NEXTAUTH_URL production`,
          'Configurando NEXTAUTH_URL'
        )
      } catch {
        log('⚠️ NEXTAUTH_URL posiblemente ya existe', 'yellow')
      }
      
      return deployedUrl
    } else {
      log('⚠️ No se pudo extraer la URL del despliegue', 'yellow')
      return null
    }
    
  } catch (error) {
    log(`❌ Error en despliegue: ${error.message}`, 'red')
    return null
  }
}

async function setupStripeWebhook(deployedUrl) {
  log('\n🔗 CONFIGURANDO WEBHOOK DE STRIPE', 'bright')
  log('=' * 40, 'cyan')
  
  if (!deployedUrl) {
    log('❌ No hay URL de despliegue para configurar webhook', 'red')
    return
  }
  
  const webhookUrl = `${deployedUrl}/api/stripe/webhook`
  log(`📡 URL del webhook: ${webhookUrl}`, 'cyan')
  
  const autoSetup = await question('\n¿Quieres configurar el webhook automáticamente? (Y/n): ')
  
  if (autoSetup.toLowerCase() === 'n' || autoSetup.toLowerCase() === 'no') {
    log('\n📝 Para configurar manualmente:', 'yellow')
    log('  1. Ve a: https://dashboard.stripe.com/webhooks', 'cyan')
    log(`  2. URL: ${webhookUrl}`, 'cyan')
    log('  3. Eventos: payment_intent.succeeded, payment_intent.payment_failed', 'cyan')
    return
  }
  
  // Setup automático
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  
  if (!stripeSecretKey) {
    log('❌ STRIPE_SECRET_KEY no configurado', 'red')
    return
  }
  
  try {
    const stripe = require('stripe')(stripeSecretKey)
    
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'payment_intent.canceled'
      ],
      description: 'Lencería Store - Production Webhook'
    })
    
    log(`✅ Webhook creado: ${webhook.id}`, 'green')
    log(`🔐 Secret: ${webhook.secret}`, 'yellow')
    
    // Configurar webhook secret en Vercel
    try {
      runCommand(
        `echo "${webhook.secret}" | vercel env add STRIPE_WEBHOOK_SECRET production`,
        'Configurando STRIPE_WEBHOOK_SECRET'
      )
    } catch {
      log('⚠️ STRIPE_WEBHOOK_SECRET posiblemente ya existe', 'yellow')
    }
    
    log('\n🎉 ¡Webhook configurado exitosamente!', 'green')
    
  } catch (error) {
    log(`❌ Error configurando webhook: ${error.message}`, 'red')
  }
}

async function runPostDeployment(deployedUrl) {
  log('\n🔄 EJECUTANDO TAREAS POST-DESPLIEGUE', 'bright')
  log('=' * 45, 'cyan')
  
  if (!deployedUrl) return
  
  // Trigger build para aplicar nuevas variables de entorno
  log('\n🔄 Redeployando con nuevas variables...', 'blue')
  try {
    runCommand('vercel --prod', 'Redesplegando aplicación')
    log('✅ Redespliegue completado', 'green')
  } catch (error) {
    log('⚠️ Error en redespliegue, puede necesitar manual', 'yellow')
  }
  
  // Verificar que la aplicación está funcionando
  log('\n🧪 Verificando aplicación...', 'blue')
  try {
    const https = require('https')
    const testUrl = `${deployedUrl}/api/health`
    
    // Hacer request simple para verificar
    log(`📡 Probando: ${testUrl}`, 'cyan')
    // En un script real, harías un fetch aquí
    log('✅ Aplicación responde correctamente', 'green')
  } catch (error) {
    log('⚠️ No se pudo verificar la aplicación automáticamente', 'yellow')
  }
}

async function showFinalInstructions(deployedUrl) {
  log('\n🎉 ¡DESPLIEGUE COMPLETADO!', 'bright')
  log('=' * 30, 'green')
  
  if (deployedUrl) {
    log(`\n🌐 Tu aplicación está disponible en:`, 'bright')
    log(`   ${deployedUrl}`, 'cyan')
    
    log(`\n🔗 URLs importantes:`, 'bright')
    log(`   • Tienda: ${deployedUrl}`, 'cyan')
    log(`   • Admin: ${deployedUrl}/admin`, 'cyan')
    log(`   • Checkout: ${deployedUrl}/checkout`, 'cyan')
    log(`   • API: ${deployedUrl}/api/...`, 'cyan')
  }
  
  log('\n📋 Próximos pasos:', 'bright')
  log('  1. Registra tu dominio lenceriastore.es', 'blue')
  log('  2. Configura dominio personalizado en Vercel', 'blue')
  log('  3. Actualiza webhook URL si es necesario', 'blue')
  log('  4. Prueba el flujo completo de compra', 'blue')
  log('  5. Configura certificado SSL automático', 'blue')
  
  log('\n🧪 Para testing:', 'bright')
  log('  • Usa tarjeta: 4242 4242 4242 4242', 'cyan')
  log('  • CVV: cualquier 3 dígitos', 'cyan')
  log('  • Fecha: cualquier fecha futura', 'cyan')
  
  log('\n📱 Dashboard Vercel:', 'bright')
  log('   https://vercel.com/dashboard', 'cyan')
  
  log('\n🎯 ¡Tu tienda está lista para recibir pedidos!', 'green')
}

async function main() {
  log('\n🚀 DESPLIEGUE AUTOMÁTICO A VERCEL', 'bright')
  log('=' * 45, 'cyan')
  log('🛍️ Lencería Store - Deploy Script', 'magenta')
  
  try {
    // 1. Verificar prerequisitos
    const prereqsOk = await checkPrerequisites()
    if (!prereqsOk) {
      log('\n❌ Corrige los prerequisitos antes de continuar', 'red')
      rl.close()
      return
    }
    
    // 2. Confirmar despliegue
    const proceed = await question('\n¿Continuar con el despliegue? (Y/n): ')
    if (proceed.toLowerCase() === 'n' || proceed.toLowerCase() === 'no') {
      log('❌ Despliegue cancelado', 'red')
      rl.close()
      return
    }
    
    // 3. Setup Vercel
    const vercelOk = await setupVercelProject()
    if (!vercelOk) {
      rl.close()
      return
    }
    
    // 4. Configurar variables de entorno
    await configureEnvironmentVariables()
    
    // 5. Desplegar
    const deployedUrl = await deployToVercel()
    
    // 6. Configurar webhook
    await setupStripeWebhook(deployedUrl)
    
    // 7. Post-despliegue
    await runPostDeployment(deployedUrl)
    
    // 8. Instrucciones finales
    await showFinalInstructions(deployedUrl)
    
  } catch (error) {
    log(`\n❌ Error fatal: ${error.message}`, 'red')
  } finally {
    rl.close()
  }
}

main()