import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌹</span>
              <span className="text-xl font-bold">
                Lencería<span className="text-primary">Store</span>
              </span>
            </div>
            <p className="text-secondary-300 text-sm">
              Tu tienda de lencería premium con la máxima discreción y calidad. 
              Envío en 24h a toda España.
            </p>
            <div className="flex space-x-4">
              <span className="text-2xl cursor-pointer hover:text-primary">📱</span>
              <span className="text-2xl cursor-pointer hover:text-primary">📧</span>
              <span className="text-2xl cursor-pointer hover:text-primary">📞</span>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Productos</h3>
            <ul className="space-y-2 text-secondary-300">
              <li>
                <Link href="/productos/conjuntos" className="hover:text-white transition-colors">
                  Conjuntos
                </Link>
              </li>
              <li>
                <Link href="/productos/bodies" className="hover:text-white transition-colors">
                  Bodies
                </Link>
              </li>
              <li>
                <Link href="/productos/babydolls" className="hover:text-white transition-colors">
                  Babydolls
                </Link>
              </li>
              <li>
                <Link href="/productos/para-el" className="hover:text-white transition-colors">
                  Para Él
                </Link>
              </li>
              <li>
                <Link href="/productos/accesorios" className="hover:text-white transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Ayuda</h3>
            <ul className="space-y-2 text-secondary-300">
              <li>
                <Link href="/ayuda/envios" className="hover:text-white transition-colors">
                  Envíos y devoluciones
                </Link>
              </li>
              <li>
                <Link href="/ayuda/tallas" className="hover:text-white transition-colors">
                  Guía de tallas
                </Link>
              </li>
              <li>
                <Link href="/ayuda/cuidados" className="hover:text-white transition-colors">
                  Cuidado de la lencería
                </Link>
              </li>
              <li>
                <Link href="/ayuda/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/ayuda/faq" className="hover:text-white transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-secondary-300">
              <li>
                <Link href="/legal/privacidad" className="hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos" className="hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-white transition-colors">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/devolucion" className="hover:text-white transition-colors">
                  Derecho de desistimiento
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © 2024 Lencería Store. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-secondary-400 text-sm">Métodos de pago:</span>
            <div className="flex space-x-2">
              <span className="text-xl">💳</span>
              <span className="text-xl">🏧</span>
              <span className="text-xl">📱</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}