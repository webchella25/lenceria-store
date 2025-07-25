import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    // Rutas protegidas que requieren autenticación
    const protectedRoutes = [
      "/mi-cuenta",
      "/carrito",
      "/checkout",
    ]

    // Rutas de admin que requieren rol de administrador
    const adminRoutes = ["/admin"]

    // Verificar si la ruta actual es protegida
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )

    const isAdminRoute = adminRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Si es una ruta protegida y no hay token, redirigir a login
    if (isProtectedRoute && !token) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Si es una ruta de admin y no tiene permisos, redirigir a home
    if (isAdminRoute && (!token || !["ADMIN", "SUPER_ADMIN"].includes(token.role as string))) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Permitir acceso a rutas de auth sin token
        if (pathname.startsWith("/login") || 
            pathname.startsWith("/register") || 
            pathname.startsWith("/forgot-password")) {
          return true
        }

        // Para otras rutas, verificar según las reglas en el middleware principal
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/mi-cuenta/:path*",
    "/carrito/:path*", 
    "/checkout/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password"
  ]
}