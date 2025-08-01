export interface FlashSaleItem {
  id: number
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  rating: number
  reviews: number
  stock: number
  sold: number
  store: string
  timeLeft?: string
  badge?: string
}

export const flashSaleItems: FlashSaleItem[] = [
  {
    id: 1,
    name: "Smart LED TV 55\"",
    price: 45000,
    originalPrice: 65000,
    discount: 31,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 124,
    stock: 15,
    sold: 85,
    store: "Panda Mart Garden City",
    timeLeft: "2 days",
    badge: "Flash Sale"
  },
  {
    id: 2,
    name: "Wireless Bluetooth Headphones",
    price: 3500,
    originalPrice: 5000,
    discount: 30,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 89,
    stock: 8,
    sold: 42,
    store: "Panda Mart Galleria",
    timeLeft: "1 day",
    badge: "Hot Deal"
  },
  {
    id: 3,
    name: "Smartphone 128GB",
    price: 22000,
    originalPrice: 30000,
    discount: 27,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 312,
    stock: 5,
    sold: 95,
    store: "Panda Mart Garden City",
    timeLeft: "3 hours",
    badge: "Almost Gone"
  },
  {
    id: 4,
    name: "Coffee Maker Premium",
    price: 8000,
    originalPrice: 12000,
    discount: 33,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 156,
    stock: 12,
    sold: 38,
    store: "Panda Mart Galleria",
    timeLeft: "5 hours",
    badge: "Flash Sale"
  },
  {
    id: 5,
    name: "Wireless Gaming Mouse",
    price: 2500,
    originalPrice: 4000,
    discount: 38,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 67,
    stock: 20,
    sold: 30,
    store: "Panda Mart Garden City",
    timeLeft: "8 hours",
    badge: "Limited Time"
  },
  {
    id: 6,
    name: "Desk Organizer Set",
    price: 1200,
    originalPrice: 2000,
    discount: 40,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 45,
    stock: 25,
    sold: 25,
    store: "Panda Mart Galleria",
    timeLeft: "12 hours",
    badge: "Best Value"
  }
]

// Get featured flash sale items for homepage
export const getFeaturedFlashSaleItems = (limit: number = 4): FlashSaleItem[] => {
  return flashSaleItems.slice(0, limit)
}

// Get all flash sale items
export const getAllFlashSaleItems = (): FlashSaleItem[] => {
  return flashSaleItems
}

// Get flash sale item by ID
export const getFlashSaleItemById = (id: number): FlashSaleItem | undefined => {
  return flashSaleItems.find(item => item.id === id)
}