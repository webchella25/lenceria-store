import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard,
  Eye,
  Download,
  RotateCcw
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function getUserOrders(userId: string) {
  return await prisma.pedido.findMany({
    where: { usuarioId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          producto: {
            select: {
              id: true,
              nombre: true,
              slug: true,
              imagenes: true,
              precio: true,
              precioOferta: true
            }
          }
        }
      }
    }
  })
}

const estadoColors = {
  PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMADO: "bg-blue-100 text-blue-800 border-blue-200",
  PROCESANDO: "bg-purple-100 text-purple-800 border-purple-200",
  ENVIADO: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ENTREGADO: "bg-green-100 text-green-800 border-green-200",
  CANCELADO: "bg-red-100 text-red-800 border-red-200",
  DEVUELTO: "bg-gray-100 text-gray-800 border-gray-200"
}

const estadoLabels = {
  PENDIENTE: "Pendiente de confirmación",
  CONFIRMADO: "Confirmado",
  PROCESANDO: "Preparando envío",
  ENVIADO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  DEVUELTO: "Devuelto"
}

const estadoDescriptions = {
  PENDIENTE: "Tu pedido está siendo revisado",
  CONFIRMADO: "Hemos confirmado tu pedido",
  PROCESANDO: "Estamos preparando tu paquete",
  ENVIADO: "Tu pedido está en camino",
  ENTREGADO: "Tu pedido ha sido entregado",
  CANCELADO: "El pedido ha sido cancelado",
  DEVUELTO: "El pedido ha sido devuelto"
}

export default async function PedidosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const pedidos = await getUserOrders(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Mis Pedidos</h2>
          <p className="text-secondary-600 mt-1">
            Historial completo de tus pedidos y su estado
          </p>
        </div>
        <div className="text-sm text-secondary-600">
          {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""}
        </div>
      </div>

      {pedidos.length > 0 ? (
        <div className="space-y-6">
          {pedidos.map((pedido) => (
            <Card key={pedido.id} className="overflow-hidden">
              <CardHeader className="bg-secondary-50 border-b border-secondary-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Package className="w-6 h-6 text-secondary-600" />
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{pedido.numero}
                      </CardTitle>
                      <p className="text-sm text-secondary-600 flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(pedido.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={`${estadoColors[pedido.estado]} px-3 py-1`}>
                      {estadoLabels[pedido.estado]}
                    </Badge>
                    <span className="font-bold text-lg text-secondary-900">
                      €{pedido.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Estado del pedido */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-blue-900">
                        {estadoLabels[pedido.estado]}
                      </p>
                      <p className="text-sm text-blue-700">
                        {estadoDescriptions[pedido.estado]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de envío */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Dirección de envío
                    </h4>
                    <div className="text-sm text-secondary-600 space-y-1">
                      <p>{pedido.direccionEnvio.nombre}</p>
                      <p>{pedido.direccionEnvio.direccion}</p>
                      <p>
                        {pedido.direccionEnvio.ciudad}, {pedido.direccionEnvio.codigoPostal}
                      </p>
                      <p>{pedido.direccionEnvio.pais}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-3 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Información del pago
                    </h4>
                    <div className="text-sm text-secondary-600 space-y-1">
                      <p>Método: {pedido.metodoPago}</p>
                      <p>Subtotal: €{pedido.subtotal.toFixed(2)}</p>
                      <p>Envío: €{pedido.gastoEnvio.toFixed(2)}</p>
                      <p className="font-semibold text-secondary-900">
                        Total: €{pedido.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productos del pedido */}
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-4">
                    Productos ({pedido.items.length})
                  </h4>
                  <div className="space-y-3">
                    {pedido.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-lg">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.producto.imagenes[0] || "/images/placeholder.jpg"}
                            alt={item.producto.nombre}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/producto/${item.producto.slug}`}
                            className="font-medium text-secondary-900 hover:text-primary-600 truncate block"
                          >
                            {item.producto.nombre}
                          </Link>
                          <div className="text-sm text-secondary-600 mt-1">
                            {item.talla && <span>Talla: {item.talla}</span>}
                            {item.color && <span className="ml-2">Color: {item.color}</span>}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-secondary-600">
                            Cantidad: {item.cantidad}
                          </p>
                          <p className="font-semibold text-secondary-900">
                            €{item.precio.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-secondary-200">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver detalles
                  </Button>
                  
                  {pedido.estado === "ENTREGADO" && (
                    <>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar factura
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Solicitar devolución
                      </Button>
                    </>
                  )}
                  
                  {pedido.estado === "ENVIADO" && pedido.numeroSeguimiento && (
                    <Button variant="outline" size="sm">
                      <Package className="w-4 h-4 mr-2" />
                      Seguir envío
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No tienes pedidos aún
            </h3>
            <p className="text-secondary-600 mb-6">
              Cuando realices tu primer pedido, aparecerá aquí
            </p>
            <Link href="/productos">
              <Button>
                Explorar productos
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}