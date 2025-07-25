import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function calculateShipping(subtotal: number, freeShippingThreshold: number = 50): number {
  return subtotal >= freeShippingThreshold ? 0 : 4.95
}

export function isInStock(stock: number, requestedQuantity: number = 1): boolean {
  return stock >= requestedQuantity
}

export function generateCartItemId(productId: string, size?: string, color?: string): string {
  return `${productId}-${size || "no-size"}-${color || "no-color"}`
}