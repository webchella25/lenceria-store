// src/store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartStore, CartItem, CartSummary } from '@/types/carrito'

const ENVIO_GRATIS_MINIMO = 50
const COSTE_ENVIO = 4.95

const calculateSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => {
    const precio = item.precioOferta || item.precio
    return sum + (precio * item.cantidad)
  }, 0)
  
  const itemsCount = items.reduce((sum, item) => sum + item.cantidad, 0)
  const weight = items.reduce((sum, item) => sum + ((item.peso || 0) * item.cantidad), 0)
  
  const descuento = 0 // TODO: Implementar sistema de descuentos
  const envio = subtotal >= ENVIO_GRATIS_MINIMO ? 0 : COSTE_ENVIO
  const total = subtotal - descuento + envio

  return {
    subtotal,
    descuento,
    envio,
    total,
    itemsCount,
    weight
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isOpen: false,
      summary: {
        subtotal: 0,
        descuento: 0,
        envio: 0,
        total: 0,
        itemsCount: 0,
        weight: 0
      },

      // Acciones
      addItem: (newItem) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          item => item.productoId === newItem.productoId && 
                  item.talla === newItem.talla && 
                  item.color === newItem.color
        )

        let updatedItems: CartItem[]

        if (existingItemIndex >= 0) {
          // Incrementar cantidad si ya existe
          updatedItems = items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, cantidad: Math.min(item.cantidad + 1, item.stock) }
              : item
          )
        } else {
          // Añadir nuevo item
          const cartItem: CartItem = {
            ...newItem,
            id: `${newItem.productoId}-${newItem.talla || 'sin-talla'}-${newItem.color || 'sin-color'}`,
            cantidad: 1
          }
          updatedItems = [...items, cartItem]
        }

        const newSummary = calculateSummary(updatedItems)

        set({
          items: updatedItems,
          summary: newSummary,
          isOpen: true // Abrir carrito al añadir
        })
      },

      removeItem: (itemId) => {
        const { items } = get()
        const updatedItems = items.filter(item => item.id !== itemId)
        const newSummary = calculateSummary(updatedItems)

        set({
          items: updatedItems,
          summary: newSummary
        })
      },

      updateQuantity: (itemId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(itemId)
          return
        }

        const { items } = get()
        const updatedItems = items.map(item => 
          item.id === itemId 
            ? { ...item, cantidad: Math.min(cantidad, item.stock) }
            : item
        )
        
        const newSummary = calculateSummary(updatedItems)

        set({
          items: updatedItems,
          summary: newSummary
        })
      },

      clearCart: () => {
        set({
          items: [],
          summary: calculateSummary([]),
          isOpen: false
        })
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      calculateSummary: () => {
        const { items } = get()
        const newSummary = calculateSummary(items)
        set({ summary: newSummary })
      }
    }),
    {
      name: 'lenceria-store-cart',
      partialize: (state) => ({
        items: state.items,
        summary: state.summary
      })
    }
  )
)