import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AccountNavigation } from "@/components/auth/AccountNavigation"

export const metadata: Metadata = {
  title: "Mi Cuenta | Lencería Store",
  description: "Gestiona tu cuenta, pedidos y configuración en Lencería Store",
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/mi-cuenta")
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Mi Cuenta</h1>
          <p className="text-secondary-600 mt-2">
            Gestiona tu información personal, pedidos y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <AccountNavigation />
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}