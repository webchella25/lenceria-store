import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-50 via-white to-accent-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <Badge variant="new" className="text-sm">
              ¡Nueva colección disponible!
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-800">
              Lencería Premium
              <span className="block text-primary">Con Estilo</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Descubre nuestra selección exclusiva de lencería erótica de alta calidad. 
              Envío discreto en 24h a toda España.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/productos">Ver Colección</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/productos/conjuntos">Conjuntos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="text-4xl">📦</div>
                <h3 className="text-xl font-semibold">Envío en 24h</h3>
                <p className="text-secondary-600">
                  Recibe tu pedido al día siguiente con total discreción
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="text-4xl">🔒</div>
                <h3 className="text-xl font-semibold">Máxima Discreción</h3>
                <p className="text-secondary-600">
                  Packaging sin marcas y facturación discreta
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="text-4xl">✨</div>
                <h3 className="text-xl font-semibold">Calidad Premium</h3>
                <p className="text-secondary-600">
                  Seleccionamos solo las mejores marcas y materiales
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Lista para sentirte especial?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubre nuestra colección y encuentra la lencería perfecta para ti
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-accent-50" asChild>
            <Link href="/productos">Explorar Ahora</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}