"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X,
  LogOut,
  Package,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { logout, isAuthenticated, user } = useAuth()

  const navigationItems = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Para Ella", href: "/categoria/para-ella" },
    { name: "Para Él", href: "/categoria/para-el" },
    { name: "Tallas Grandes", href: "/categoria/tallas-grandes" },
    { name: "Blog", href: "/blog" },
  ]

  const userMenuItems = [
    { name: "Mi Cuenta", href: "/mi-cuenta", icon: User },
    { name: "Mis Pedidos", href: "/mi-cuenta/pedidos", icon: Package },
    { name: "Lista de Deseos", href: "/mi-cuenta/wishlist", icon: Heart },
    { name: "Configuración", href: "/mi-cuenta/configuracion", icon: Settings },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
      {/* Top bar - Solo visible en desktop */}
      <div className="hidden lg:block bg-primary-600 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <p>🚚 Envío GRATIS desde 50€ | Entrega en 24h | Packaging discreto</p>
            <div className="flex items-center space-x-4">
              <span>📞 Atención al cliente: 900 123 456</span>
              <span>|</span>
              <span>🕒 L-V: 9:00-18:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">L</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl lg:text-2xl font-bold text-secondary-900">
                Lencería
              </span>
              <span className="text-xl lg:text-2xl font-bold text-primary-600 ml-1">
                Store
              </span>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pr-12 h-12"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1 h-10"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">
                    {user?.name?.split(' ')[0] || 'Mi cuenta'}
                  </span>
                </Button>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-secondary-200">
                      <p className="font-semibold text-secondary-900">
                        {user?.name}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {user?.email}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                    
                    <div className="border-t border-secondary-200 pt-2">
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5 mr-2" />
                    <span className="hidden sm:block">Entrar</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="hidden sm:flex">
                    Registro
                  </Button>
                </Link>
              </div>
            )}

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block border-t border-secondary-200">
          <div className="flex items-center justify-center space-x-8 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-secondary-200 bg-white">
          {/* Search mobile */}
          <div className="p-4 border-b border-secondary-200">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pr-12"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation mobile */}
          <nav className="py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-secondary-700 hover:bg-secondary-50 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth links mobile */}
          {!isAuthenticated && (
            <div className="border-t border-secondary-200 p-4">
              <div className="space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full">
                    Crear Cuenta
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  )
}