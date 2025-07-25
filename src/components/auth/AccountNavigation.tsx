"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  Star,
  CreditCard
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"

const navigationItems = [
  {
    name: "Mi Perfil",
    href: "/mi-cuenta",
    icon: User,
    description: "Información personal y configuración"
  },
  {
    name: "Mis Pedidos",
    href: "/mi-cuenta/pedidos",
    icon: ShoppingBag,
    description: "Historial y estado de pedidos"
  },
  {
    name: "Lista de Deseos",
    href: "/mi-cuenta/wishlist",
    icon: Heart,
    description: "Productos guardados para más tarde"
  },
  {
    name: "Mis Reseñas",
    href: "/mi-cuenta/reviews",
    icon: Star,
    description: "Opiniones sobre productos comprados"
  },
  {
    name: "Métodos de Pago",
    href: "/mi-cuenta/pagos",
    icon: CreditCard,
    description: "Gestionar tarjetas y métodos de pago"
  },
  {
    name: "Configuración",
    href: "/mi-cuenta/configuracion",
    icon: Settings,
    description: "Preferencias y notificaciones"
  }
]

export function AccountNavigation() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      {/* Header de usuario */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900">
              {user?.name || "Usuario"}
            </h3>
            <p className="text-sm text-secondary-600">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
                      : "text-secondary-700 hover:bg-secondary-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-secondary-500 hidden sm:block">
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-secondary-200">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}