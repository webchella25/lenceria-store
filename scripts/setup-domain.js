const readline = require('readline')
const { execSync } = require('child_process')

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

async function setupCustomDomain() {
  log('\n🌐 CONFIGURACIÓN DE DOMINIO PERSONALIZADO', 'bright')
  log('=' * 50, 'cyan')
  
  const domain = await question('\n📝 Introduce tu dominio (ej: lenceriastore.es): ')
  
  if (!domain.trim()) {
    log('❌ Dominio no válido', 'red')
    rl.close()
    return
  }
  
  log('\n📋 Pasos para configurar tu dominio:', 'bright')
  log('\n1️⃣ Configurar DNS en tu proveedor:', 'blue')
  log('   • Tipo: CNAME', 'cyan')
  log('   • Nombre: @ (o vacío)', 'cyan')
  log('   • Valor: cname.vercel-dns.com', 'cyan')
  log('   • Tipo: CNAME', 'cyan')
  log('   • Nombre: www', 'cyan')
  log('   • Valor: cname.vercel-dns.com', 'cyan')
  
  log('\n2️⃣ Agregar dominio a Vercel:', 'blue')
  
  const addNow = await question('¿Agregar el dominio ahora a Vercel? (Y/n): ')
  
  if (addNow.toLowerCase() !== 'n' && addNow.toLowerCase() !== 'no') {
    try {
      log('\n🔄 Agregando dominio a Vercel...', 'blue')
      execSync(`vercel domains add ${domain}`, { stdio: 'inherit' })
      execSync(`vercel domains add www.${domain}`, { stdio: 'inherit' })
      log('✅ Dominios agregados a Vercel', 'green')
    } catch (error) {
      log('⚠️ Error agregando dominios. Hazlo manualmente en el dashboard.', 'yellow')
    }
  }
  
  log('\n3️⃣ Verificar configuración:', 'blue')
  log('   • Dashboard: https://vercel.com/dashboard', 'cyan')
  log('   • Dominios: Configuración > Domains', 'cyan')
  log('   • SSL: Se configura automáticamente', 'cyan')
  
  log('\n4️⃣ Actualizar variables de entorno:', 'blue')
  log(`   • NEXTAUTH_URL: https://${domain}`, 'cyan')
  log('   • Webhook URL en Stripe', 'cyan')
  
  log('\n🎉 Una vez configurado, tu tienda estará en:', 'green')
  log(`   https://${domain}`, 'cyan')
  log(`   https://www.${domain}`, 'cyan')
  
  rl.close()
}

setupCustomDomain()