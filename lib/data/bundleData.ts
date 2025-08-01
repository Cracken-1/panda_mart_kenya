export interface BundleItem {
  name: string
  price: number
}

export interface Bundle {
  id: number
  name: string
  category: string
  description: string
  bundlePrice: number
  originalPrice: number
  savings: number
  discount: number
  image: string
  rating: number
  reviews: number
  items: BundleItem[]
  features: string[]
  store: string
}

export const bundles: Bundle[] = [
  {
    id: 1,
    name: "Complete Home Makeover Bundle",
    category: "home",
    description: "Transform your living space with this comprehensive furniture set",
    bundlePrice: 85000,
    originalPrice: 120000,
    savings: 35000,
    discount: 29,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
    rating: 4.9,
    reviews: 156,
    items: [
      { name: "3-Seater Sofa Set", price: 45000 },
      { name: "Coffee Table", price: 18000 },
      { name: "TV Stand", price: 25000 },
      { name: "Side Tables (2)", price: 16000 },
      { name: "Floor Lamp", price: 16000 }
    ],
    features: ["Free Assembly", "1 Year Warranty", "Free Delivery"],
    store: "Panda Mart Garden City"
  },
  {
    id: 2,
    name: "Smart Home Electronics Bundle",
    category: "electronics",
    description: "Everything you need for a connected smart home experience",
    bundlePrice: 95000,
    originalPrice: 135000,
    savings: 40000,
    discount: 30,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=400&fit=crop",
    rating: 4.8,
    reviews: 203,
    items: [
      { name: "55\" Smart TV", price: 65000 },
      { name: "Sound Bar", price: 25000 },
      { name: "Streaming Device", price: 8000 },
      { name: "Smart Speakers (2)", price: 20000 },
      { name: "Universal Remote", price: 17000 }
    ],
    features: ["Professional Setup", "2 Year Warranty", "Tech Support"],
    store: "Panda Mart Galleria"
  },
  {
    id: 3,
    name: "Master Chef Kitchen Bundle",
    category: "kitchen",
    description: "Professional-grade kitchen appliances for the home chef",
    bundlePrice: 45000,
    originalPrice: 65000,
    savings: 20000,
    discount: 31,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
    rating: 4.7,
    reviews: 124,
    items: [
      { name: "Multi-Function Oven", price: 25000 },
      { name: "Blender Pro", price: 12000 },
      { name: "Coffee Maker", price: 10000 },
      { name: "Cookware Set", price: 8000 },
      { name: "Kitchen Scale", price: 10000 }
    ],
    features: ["Recipe Book Included", "1 Year Warranty", "Cooking Classes"],
    store: "Panda Mart Garden City"
  },
  {
    id: 4,
    name: "Home Office Productivity Bundle",
    category: "office",
    description: "Create the perfect work-from-home setup",
    bundlePrice: 35000,
    originalPrice: 50000,
    savings: 15000,
    discount: 30,
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&h=400&fit=crop",
    rating: 4.6,
    reviews: 89,
    items: [
      { name: "Ergonomic Office Chair", price: 18000 },
      { name: "Standing Desk", price: 15000 },
      { name: "Monitor Stand", price: 5000 },
      { name: "Desk Organizer Set", price: 4000 },
      { name: "LED Desk Lamp", price: 8000 }
    ],
    features: ["Ergonomic Assessment", "Assembly Service", "Productivity Guide"],
    store: "Panda Mart Galleria"
  },
  {
    id: 5,
    name: "Complete Beauty Care Bundle",
    category: "beauty",
    description: "Everything for your daily beauty and skincare routine",
    bundlePrice: 12000,
    originalPrice: 18000,
    savings: 6000,
    discount: 33,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=400&fit=crop",
    rating: 4.5,
    reviews: 267,
    items: [
      { name: "Skincare Set (5 products)", price: 8000 },
      { name: "Makeup Kit", price: 5000 },
      { name: "Hair Care Bundle", price: 3000 },
      { name: "Beauty Tools Set", price: 2000 }
    ],
    features: ["Beauty Consultation", "Tutorial Videos", "Satisfaction Guarantee"],
    store: "Panda Mart Garden City"
  },
  {
    id: 6,
    name: "Gaming Setup Bundle",
    category: "electronics",
    description: "Ultimate gaming experience with premium accessories",
    bundlePrice: 55000,
    originalPrice: 75000,
    savings: 20000,
    discount: 27,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=400&fit=crop",
    rating: 4.8,
    reviews: 145,
    items: [
      { name: "Gaming Monitor 27\"", price: 30000 },
      { name: "Mechanical Keyboard", price: 12000 },
      { name: "Gaming Mouse", price: 8000 },
      { name: "Gaming Headset", price: 10000 },
      { name: "Mouse Pad XL", price: 15000 }
    ],
    features: ["Gaming Setup Guide", "Extended Warranty", "Performance Optimization"],
    store: "Panda Mart Galleria"
  }
]

// Get featured bundles for homepage
export const getFeaturedBundles = (limit: number = 2): Bundle[] => {
  return bundles.slice(0, limit)
}

// Get all bundles
export const getAllBundles = (): Bundle[] => {
  return bundles
}

// Get bundles by category
export const getBundlesByCategory = (category: string): Bundle[] => {
  if (category === 'all') return bundles
  return bundles.filter(bundle => bundle.category === category)
}

// Get bundle by ID
export const getBundleById = (id: number): Bundle | undefined => {
  return bundles.find(bundle => bundle.id === id)
}