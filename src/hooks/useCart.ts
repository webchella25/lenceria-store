// src/hooks/useCart.ts
import { useCartStore } from '@/store/cartStore'
import type { CartItem } from '@/types/carrito'

export const useCart = () => {
  const store = useCartStore()

  const addToCart = (item: Omit<CartItem, 'cantidad' | 'id'>) => {
    store.addItem(item)
  }

  const getItemQuantity = (productoId: string, talla?: string, color?: string): number => {
    const item = store.items.find(
      item => item.productoId === productoId && 
              item.talla === talla && 
              item.color === color
    )
    return item?.cantidad || 0
  }

  const isInCart = (productoId: string, talla?: string, color?: string): boolean => {
    return getItemQuantity(productoId, talla, color) > 0
  }

  const getTotalItems = (): number => {
    return store.summary.itemsCount
  }

  const canAddMore = (productoId: string, talla?: string, color?: string): boolean => {
    const item = store.items.find(
      item => item.productoId === productoId && 
              item.talla === talla && 
              item.color === color
    )
    return !item || item.cantidad < item.stock
  }

  return {
    ...store,
    addToCart,
    getItemQuantity,
    isInCart,
    getTotalItems,
    canAddMore
  }
}