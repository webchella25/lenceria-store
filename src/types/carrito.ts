// src/types/carrito.ts
export interface CartItem {
  id: string
  productoId: string
  nombre: string
  precio: number
  precioOferta?: number
  imagen: string
  talla?: string
  color?: string
  cantidad: number
  stock: number
  peso?: number
}

export interface CartSummary {
  subtotal: number
  descuento: number
  envio: number
  total: number
  itemsCount: number
  weight: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  summary: CartSummary
}

export interface CartActions {
  addItem: (item: Omit<CartItem, 'cantidad'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, cantidad: number) => void
  clearCart: () => void
  toggleCart: () => void
  calculateSummary: () => void
}

export type CartStore = CartState & CartActions