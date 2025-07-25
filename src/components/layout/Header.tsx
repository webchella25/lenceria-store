// src/components/layout/Header.tsx (ACTUALIZACIÓN)
"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import MiniCart from "@/components/carrito/MiniCart"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              href="/productos/conjuntos" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors"
            >
              Conjuntos
            </Link>
            <Link 
              href="/productos/bodies" 
              className="text-secondary-700 hover:text-primary font-medium transition-colors"
            >
              Bodies
            </Link>
            <Link 
              href="/productos/para-el" 
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
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <Button variant="ghost" className="md:hidden">
              🔍
            </Button>

            {/* Search - Desktop */}
            <div className="hidden md:flex items-center bg-secondary-50 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="bg-transparent border-none outline-none flex-1 text-sm"
              />
              <button className="text-secondary-400">🔍</button>
            </div>

            {/* User Menu */}
            <Button variant="ghost" className="hidden md:flex">
              👤
            </Button>

            {/* Mini Cart */}
            <MiniCart />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <nav className="space-y-2">
              <Link 
                href="/productos" 
                className="block py-2 text-secondary-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos los Productos
              </Link>
              <Link 
                href="/productos/conjuntos" 
                className="block py-2 text-secondary-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Conjuntos
              </Link>
              <Link 
                href="/productos/bodies" 
                className="block py-2 text-secondary-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Bodies
              </Link>
              <Link 
                href="/productos/para-el" 
                className="block py-2 text-secondary-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Para Él
              </Link>
              <Link 
                href="/blog" 
                className="block py-2 text-secondary-700 hover:text-primary"
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