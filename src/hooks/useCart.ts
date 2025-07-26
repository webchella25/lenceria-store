"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productoId: string
  nombre: string
  precio: number
  precioOferta?: number
  imagen: string
  cantidad: number
  talla?: string
  color?: string
  slug: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: any, talla?: string, color?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
  toggleCart: () => void
  summary: {
    itemsCount: number
    subtotal: number
    envio: number
    descuento: number
    total: number
  }
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, talla, color) => {
        const items = get().items
        const itemId = `${product.id}-${talla || ''}-${color || ''}`
        
        const existingItem = items.find(item => item.id === itemId)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === itemId
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            )
          })
        } else {
          const newItem: CartItem = {
            id: itemId,
            productoId: product.id,
            nombre: product.nombre,
            precio: product.precio,
            precioOferta: product.precioOferta,
            imagen: product.imagenes?.[0]?.url || '/placeholder.jpg',
            cantidad: 1,
            talla,
            color,
            slug: product.slug
          }
          
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },

      updateQuantity: (id, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(id)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, cantidad } : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      get summary() {
        const items = get().items
        const itemsCount = items.reduce((total, item) => total + item.cantidad, 0)
        const subtotal = items.reduce((total, item) => {
          const precio = item.precioOferta || item.precio
          return total + (precio * item.cantidad)
        }, 0)
        
        // Envío gratis si > 50€, sino 4.95€
        const envio = subtotal >= 50 ? 0 : 4.95
        const descuento = 0 // Puedes implementar lógica de descuentos aquí
        const total = subtotal + envio - descuento
        
        return {
          itemsCount,
          subtotal,
          envio,
          descuento,
          total
        }
      }
    }),
    {
      name: 'lenceria-store-cart',
      partialize: (state) => ({
        items: state.items
      })
    }
  )
)