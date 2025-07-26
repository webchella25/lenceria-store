// Verificar que las claves de Stripe estén configuradas
export function validateStripeConfig() {
  const requiredKeys = {
    STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }

  const missingKeys = Object.entries(requiredKeys)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingKeys.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno de Stripe: ${missingKeys.join(', ')}`
    )
  }

  return true
}

// Verificar si estamos en modo test o live
export function isStripeTestMode() {
  return process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false
}

// Obtener configuración de Stripe para el cliente
export function getStripeConfig() {
  return {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    isTestMode: process.env.NODE_ENV !== 'production' || isStripeTestMode(),
  }
}