// src/components/layout/Header.tsx
"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useCart } from "@/hooks/useCart"
import MiniCart from "@/components/carrito/MiniCart"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { summary } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-secondary-100">
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
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌹</span>
            <span className="text-xl font-bold text-secondary-800">
              Lencería<span className="text-primary">Store</span>
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/productos" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors"
            >
              Todos los Productos
            </Link>
            <Link 
              href="/categoria/conjuntos" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors"
            >
              Conjuntos
            </Link>
            <Link 
              href="/categoria/bodies" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors"
            >
              Bodies
            </Link>
            <Link 
              href="/categoria/para-el" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors"
            >
              Para Él
            </Link>
            <Link 
              href="/blog" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              🔍
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon">
              💝
            </Button>

            {/* Cart - Ahora usando MiniCart real */}
            <MiniCart />

            {/* Account */}
            <Button variant="ghost" size="icon">
              👤
            </Button>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/productos" 
                className="text-secondary-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos los Productos
              </Link>
              <Link 
                href="/categoria/conjuntos" 
                className="text-secondary-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Conjuntos
              </Link>
              <Link 
                href="/categoria/bodies" 
                className="text-secondary-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Bodies
              </Link>
              <Link 
                href="/categoria/para-el" 
                className="text-secondary-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Para Él
              </Link>
              <Link 
                href="/blog" 
                className="text-secondary-700 hover:text-primary font-medium py-2"
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