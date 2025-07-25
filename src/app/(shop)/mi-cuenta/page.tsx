import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ProfileForm } from "@/components/auth/ProfileForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Calendar,
  Package,
  Truck,
  CheckCircle
} from "lucide-react"

async function getUserStats(userId: string) {
  const [totalPedidos, pedidosPendientes, totalReviews, wishlistItems] = await Promise.all([
    prisma.pedido.count({
      where: { usuarioId: userId }
    }),
    prisma.pedido.count({
      where: { 
        usuarioId: userId,
        estado: { in: ["PENDIENTE", "CONFIRMADO", "PROCESANDO", "ENVIADO"] }
      }
    }),
    prisma.review.count({
      where: { usuarioId: userId }
    }),
    prisma.wishlistItem.count({
      where: { usuarioId: userId }
    })
  ])

  return {
    totalPedidos,
    pedidosPendientes,
    totalReviews,
    wishlistItems
  }
}

async function getRecentOrders(userId: string) {
  return await prisma.pedido.findMany({
    where: { usuarioId: userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      items: {
        include: {
          producto: {
            select: {
              nombre: true,
              imagenes: true
            }
          }
        }
      }
    }
  })
}

const estadoColors = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADO: "bg-blue-100 text-blue-800",
  PROCESANDO: "bg-purple-100 text-purple-800",
  ENVIADO: "bg-indigo-100 text-indigo-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
  DEVUELTO: "bg-gray-100 text-gray-800"
}

const estadoLabels = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  PROCESANDO: "Procesando",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  DEVUELTO: "Devuelto"
}

export default async function MiCuentaPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const [userStats, recentOrders] = await Promise.all([
    getUserStats(session.user.id),
    getRecentOrders(session.user.id)
  ])

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Pedidos</p>
                <p className="text-2xl font-bold text-secondary-900">{userStats.totalPedidos}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Pedidos Activos</p>
                <p className="text-2xl font-bold text-secondary-900">{userStats.pedidosPendientes}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Lista de Deseos</p>
                <p className="text-2xl font-bold text-secondary-900">{userStats.wishlistItems}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Reseñas</p>
                <p className="text-2xl font-bold text-secondary-900">{userStats.totalReviews}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pedidos recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Pedidos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((pedido) => (
                  <div key={pedido.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">#{pedido.numero}</span>
                      <Badge className={estadoColors[pedido.estado]}>
                        {estadoLabels[pedido.estado]}
                      </Badge>
                    </div>
                    <div className="text-sm text-secondary-600 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(pedido.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{pedido.items.length} producto(s)</span>
                      <span className="float-right font-bold">
                        €{pedido.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <a 
                    href="/mi-cuenta/pedidos"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todos los pedidos →
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-secondary-400 mb-4" />
                <p className="text-secondary-600">No tienes pedidos aún</p>
                <a 
                  href="/productos"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Explorar productos
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Estado de la Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Email verificado</span>
                <Badge className="bg-green-100 text-green-800">
                  Verificado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Método de pago</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Pendiente
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Miembro desde</span>
                <span className="text-secondary-900">
                  {new Date(session.user.createdAt || "").toLocaleDateString()}
                </span>
              </div>
              <div className="pt-4 border-t">
                <a 
                  href="/mi-cuenta/configuracion"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Actualizar configuración →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}