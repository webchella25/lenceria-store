import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"

export default function TestComponentsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-800 mb-2">
          🧪 Test de Componentes UI
        </h1>
        <p className="text-secondary-600">
          Prueba visual de todos los componentes base
        </p>
      </div>

      {/* Botones */}
      <Card>
        <CardHeader>
          <CardTitle>Botones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" placeholder="tu@email.com" type="email" />
            <Input label="Password" placeholder="••••••••" type="password" />
            <Input 
              label="Con error" 
              placeholder="Campo con error" 
              error="Este campo es requerido"
            />
            <Input label="Búsqueda" placeholder="Buscar productos..." />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">¡En Stock!</Badge>
            <Badge variant="warning">Pocas unidades</Badge>
            <Badge variant="destructive">Agotado</Badge>
            <Badge variant="new">¡Nuevo!</Badge>
            <Badge variant="featured">Destacado</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Simulación Producto */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Producto (Simulación)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center">
                  <span className="text-4xl">🌹</span>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="new">¡Nuevo!</Badge>
                    <Badge variant="featured">Destacado</Badge>
                  </div>
                  <h3 className="font-semibold text-secondary-800 mb-2">
                    Conjunto Rosa Elegante {i}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    Conjunto de lencería en encaje rosa con detalles dorados
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(22)}
                      </span>
                      <span className="text-sm text-secondary-500 line-through">
                        {formatPrice(30)}
                      </span>
                    </div>
                    <Badge variant="success">En stock</Badge>
                  </div>
                  <Button className="w-full">
                    Añadir al carrito
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}