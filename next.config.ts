/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.stripe.com', // Para logos de tarjetas
    ],
  },
  // Configuración para webhooks de Stripe
  async headers() {
    return [
      {
        source: '/api/stripe/webhook',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Stripe-Signature',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig