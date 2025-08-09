import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  description: string
  quantity: number
  maxQuantity: number
  store: string
  sku: string
  inStock: boolean
  flashSale?: boolean
  couponEligible?: boolean
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  appliedCoupon: string | null
  couponDiscount: number
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  getTotalWithDiscount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      appliedCoupon: null,
      couponDiscount: 0,

      addItem: (newItem) => {
        const items = get().items
        const existingItem = items.find(item => item.id === newItem.id)
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + 1, existingItem.maxQuantity)
          set(state => ({
            items: state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
            totalItems: state.totalItems + (newQuantity - existingItem.quantity),
            totalPrice: state.totalPrice + (newQuantity - existingItem.quantity) * newItem.price
          }))
        } else {
          const itemWithQuantity = { ...newItem, quantity: 1 }
          set(state => ({
            items: [...state.items, itemWithQuantity],
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + newItem.price
          }))
        }
      },

      removeItem: (id) => {
        const items = get().items
        const itemToRemove = items.find(item => item.id === id)
        if (itemToRemove) {
          set(state => ({
            items: state.items.filter(item => item.id !== id),
            totalItems: state.totalItems - itemToRemove.quantity,
            totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
          }))
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        const items = get().items
        const existingItem = items.find(item => item.id === id)
        if (existingItem) {
          const quantityDiff = quantity - existingItem.quantity
          const validQuantity = Math.min(quantity, existingItem.maxQuantity)
          
          set(state => ({
            items: state.items.map(item =>
              item.id === id
                ? { ...item, quantity: validQuantity }
                : item
            ),
            totalItems: state.totalItems + quantityDiff,
            totalPrice: state.totalPrice + (quantityDiff * existingItem.price)
          }))
        }
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          appliedCoupon: null,
          couponDiscount: 0
        })
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      applyCoupon: (code) => {
        const validCoupons: Record<string, number> = {
          'WELCOME10': 10,
          'SAVE20': 20,
          'NEWUSER15': 15,
          'FLASH25': 25
        }

        const discount = validCoupons[code]
        if (discount) {
          set({
            appliedCoupon: code,
            couponDiscount: discount
          })
          return true
        }
        return false
      },

      removeCoupon: () => {
        set({
          appliedCoupon: null,
          couponDiscount: 0
        })
      },

      getTotalWithDiscount: () => {
        const { totalPrice, couponDiscount } = get()
        return totalPrice - (totalPrice * couponDiscount / 100)
      }
    }),
    {
      name: 'panda-cart-storage',
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        couponDiscount: state.couponDiscount
      })
    }
  )
)