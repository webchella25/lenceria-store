"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartItemsCount = 0 // TODO: Conectar con el estado del carrito

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4">
        {/* Top Bar - Solo desktop */}
        <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b">
          <div className="text-secondary-600">
            📦 Envío gratuito en pedidos superiores a 50€
          </div>
          <div className="flex items-center gap-4 text-secondary-600">
            <span>📞 Atención al cliente</span>
            <span>📧 info@lenceriastore.es</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl">🌹</span>
            <div className="text-lg md:text-xl font-bold">
              <span className="text-secondary-800">Lencería</span>
              <span className="text-primary">Store</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/productos" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors text-sm"
            >
              Productos
            </Link>
            <Link 
              href="/productos/conjuntos" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors text-sm"
            >
              Conjuntos
            </Link>
            <Link 
              href="/productos/bodies" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors text-sm"
            >
              Bodies
            </Link>
            <Link 
              href="/productos/para-el" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors text-sm"
            >
              Para Él
            </Link>
            <Link 
              href="/blog" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors text-sm"
            >
              Blog
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search - Solo desktop */}
            <Button variant="ghost" size="icon" className="hidden md:flex text-lg">
              🔍
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="text-lg">
              💝
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative text-lg">
              🛒
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center p-0"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Account */}
            <Button variant="ghost" size="icon" className="text-lg">
              👤
            </Button>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-secondary-200 py-4 bg-white">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/productos" 
                className="text-secondary-700 hover:text-primary font-medium py-2 px-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos los Productos
              </Link>
              <Link 
                href="/productos/conjuntos" 
                className="text-secondary-700 hover:text-primary font-medium py-2 px-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Conjuntos
              </Link>
              <Link 
                href="/productos/bodies" 
                className="text-secondary-700 hover:text-primary font-medium py-2 px-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Bodies
              </Link>
              <Link 
                href="/productos/para-el" 
                className="text-secondary-700 hover:text-primary font-medium py-2 px-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Para Él
              </Link>
              <Link 
                href="/blog" 
                className="text-secondary-700 hover:text-primary font-medium py-2 px-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}