import Link from "next/link"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Shield,
  Truck,
  CreditCard,
  Clock
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    company: {
      title: "Lencería Store",
      links: [
        { name: "Sobre nosotros", href: "/sobre-nosotros" },
        { name: "Contacto", href: "/contacto" },
        { name: "Blog", href: "/blog" },
        { name: "Ofertas", href: "/ofertas" },
        { name: "Guía de tallas", href: "/guia-tallas" }
      ]
    },
    customer: {
      title: "Atención al Cliente",
      links: [
        { name: "Mi cuenta", href: "/mi-cuenta" },
        { name: "Mis pedidos", href: "/mi-cuenta/pedidos" },
        { name: "Cambios y devoluciones", href: "/devoluciones" },
        { name: "Preguntas frecuentes", href: "/faq" },
        { name: "Envíos", href: "/envios" }
      ]
    },
    categories: {
      title: "Categorías",
      links: [
        { name: "Para Ella", href: "/categoria/para-ella" },
        { name: "Para Él", href: "/categoria/para-el" },
        { name: "Tallas Grandes", href: "/categoria/tallas-grandes" },
        { name: "Disfraces", href: "/categoria/disfraces" },
        { name: "Accesorios", href: "/categoria/accesorios" }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Términos y condiciones", href: "/terminos" },
        { name: "Política de privacidad", href: "/privacidad" },
        { name: "Política de cookies", href: "/cookies" },
        { name: "Aviso legal", href: "/aviso-legal" },
        { name: "RGPD", href: "/rgpd" }
      ]
    }
  }

  const benefits = [
    {
      icon: Truck,
      title: "Envío 24h",
      description: "Entrega rápida en península"
    },
    {
      icon: Shield,
      title: "Packaging discreto",
      description: "Sin marcas identificativas"
    },
    {
      icon: CreditCard,
      title: "Pago seguro",
      description: "Múltiples métodos de pago"
    },
    {
      icon: Clock,
      title: "Atención 24/7",
      description: "Soporte cuando lo necesites"
    }
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Benefits section */}
      <div className="bg-secondary-800 border-b border-secondary-700">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{benefit.title}</h4>
                    <p className="text-sm text-secondary-300">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="bg-primary-600">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                ¡Suscríbete y obtén un 10% de descuento!
              </h3>
              <p className="text-primary-100">
                Recibe ofertas exclusivas, nuevos productos y consejos íntimos
              </p>
            </div>
            
            <div className="flex w-full lg:w-auto max-w-md">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-primary-50 transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Lencería</span>
                <span className="text-xl font-bold text-primary-400 ml-1">Store</span>
              </div>
            </div>
            
            <p className="text-secondary-300 mb-6 text-sm leading-relaxed">
              Tu tienda de confianza para lencería íntima premium. Calidad, discreción y 
              satisfacción garantizada desde 2024.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-secondary-300">
                <Phone className="w-4 h-4 mr-3 text-primary-400" />
                <span>900 123 456</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <Mail className="w-4 h-4 mr-3 text-primary-400" />
                <span>hola@lenceriastore.es</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <MapPin className="w-4 h-4 mr-3 text-primary-400" />
                <span>Valencia, España</span>
              </div>
            </div>

            {/* Social media */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="w-8 h-8 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-secondary-300 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="border-t border-secondary-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-400">Métodos de pago:</span>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">MC</span>
                </div>
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">PP</span>
                </div>
                <div className="w-8 h-5 bg-black rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">G</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-secondary-400">
              <span>SSL Seguro</span>
              <span>•</span>
              <span>Certificado de Confianza</span>
              <span>•</span>
              <span>RGPD Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-secondary-950 border-t border-secondary-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-400">
            <p>
              © {currentYear} Lencería Store. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center space-x-6">
              <span>Diseñado en España con ❤️</span>
              <span>•</span>
              <span>Mayores de 18 años</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}