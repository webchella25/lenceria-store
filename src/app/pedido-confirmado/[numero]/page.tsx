import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: {
    numero: string
  }
}

async function getPedido(numero: string, userId?: string) {
  const pedido = await prisma.pedido.findFirst({
    where: {
      numero,
      ...(userId && { usuarioId: userId })
    },
    include: {
      items: {
        include: {
          producto: {
            select: {
              id: true,
              nombre: true,
              slug: true,
              imagenes: true
            }
          }
        }
      }
    }
  })

  return pedido
}

export default async function PedidoConfirmadoPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  const pedido = await getPedido(params.numero, session?.user?.id)

  if (!pedido) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header de confirmación */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-lg text-secondary-600">
            Gracias por tu compra. Hemos recibido tu pedido y está siendo procesado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Número de pedido:</span>
                  <span className="font-mono">{pedido.numero}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estado:</span>
                  <Badge className="bg-green-100 text-green-800">
                    Confirmado
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Fecha:</span>
                  <span>{new Date(pedido.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">€{pedido.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-secondary-600 space-y-1">
                  <p className="font-medium text-secondary-900">
                    {pedido.nombreEnvio}
                  </p>
                  <p>{pedido.direccionEnvio}</p>
                  <p>{pedido.ciudadEnvio}, {pedido.cpEnvio}</p>
                  <p>{pedido.provinciaEnvio}, {pedido.paisEnvio}</p>
                  <p>{pedido.emailEnvio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Próximos pasos */}
            <Card>
              <CardHeader>
                <CardTitle>¿Qué sigue?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Confirmación por email</h4>
                      <p className="text-sm text-secondary-600">
                        Recibirás un email de confirmación en {pedido.emailEnvio}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Preparación del pedido</h4>
                      <p className="text-sm text-secondary-600">
                        Preparamos tu pedido en nuestro almacén
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Envío en 24h</h4>
                      <p className="text-sm text-secondary-600">
                        Tu pedido será enviado de forma discreta en máximo 24h
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productos del pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Productos Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pedido.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border border-secondary-100 rounded-lg">
                      <img
                        src={item.producto.imagenes[0]?.url || '/placeholder.jpg'}
                        alt={item.producto.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.producto.nombre}</h4>
                        <div className="text-sm text-secondary-600">
                          {item.talla && <span>Talla: {item.talla} • </span>}
                          {item.color && <span>Color: {item.color} • </span>}
                          <span>Cantidad: {item.cantidad}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          €{(item.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="mt-6 space-y-3">
              <Link href="/mi-cuenta/pedidos">
                <Button className="w-full">
                  Ver Mis Pedidos
                </Button>
              </Link>
              <Link href="/productos">
                <Button variant="outline" className="w-full">
                  Seguir Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}