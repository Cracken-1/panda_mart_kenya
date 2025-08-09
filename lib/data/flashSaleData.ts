// Flash sale data for the application

export interface FlashSaleItem {
  id: string
  name: string
  originalPrice: number
  salePrice: number
  discount: number
  image: string
  category: string
  timeLeft: number
  stock: number
  sold: number
  rating: number
  reviews: number
  store: string
}

const flashSaleItems: FlashSaleItem[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    originalPrice: 1500,
    salePrice: 999,
    discount: 33,
    image: '/images/coffee-beans.jpg',
    category: 'Beverages',
    timeLeft: Date.now() + 3600000, // 1 hour from now
    stock: 50,
    sold: 23,
    rating: 4.5,
    reviews: 128,
    store: 'Panda Mart Westlands'
  },
  {
    id: '2',
    name: 'Organic Honey',
    originalPrice: 800,
    salePrice: 599,
    discount: 25,
    image: '/images/honey.jpg',
    category: 'Food',
    timeLeft: Date.now() + 7200000, // 2 hours from now
    stock: 30,
    sold: 15,
    rating: 4.8,
    reviews: 89,
    store: 'Panda Mart Karen'
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    originalPrice: 5000,
    salePrice: 3499,
    discount: 30,
    image: '/images/headphones.jpg',
    category: 'Electronics',
    timeLeft: Date.now() + 1800000, // 30 minutes from now
    stock: 20,
    sold: 8,
    rating: 4.2,
    reviews: 45,
    store: 'Panda Mart CBD'
  }
]

export function getAllFlashSaleItems(): FlashSaleItem[] {
  return flashSaleItems
}

export function getFlashSaleItem(id: string): FlashSaleItem | undefined {
  return flashSaleItems.find(item => item.id === id)
}

export function getActiveFlashSaleItems(): FlashSaleItem[] {
  return flashSaleItems.filter(item => item.timeLeft > 0 && item.stock > 0)
}

export function getFeaturedFlashSaleItems(): FlashSaleItem[] {
  return flashSaleItems.slice(0, 4) // Return first 4 items as featured
}