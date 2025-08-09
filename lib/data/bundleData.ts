// Bundle data for the application

export interface Bundle {
  id: string
  name: string
  description: string
  originalPrice: number
  bundlePrice: number
  savings: number
  image: string
  category: string
  items: BundleItem[]
  popular?: boolean
}

export interface BundleItem {
  id: string
  name: string
  quantity: number
  price: number
}

const bundles: Bundle[] = [
  {
    id: '1',
    name: 'Family Breakfast Bundle',
    description: 'Everything you need for a perfect family breakfast',
    originalPrice: 2500,
    bundlePrice: 1999,
    savings: 501,
    image: '/images/breakfast-bundle.jpg',
    category: 'Food',
    popular: true,
    items: [
      { id: '1', name: 'Bread Loaf', quantity: 2, price: 150 },
      { id: '2', name: 'Milk 1L', quantity: 1, price: 120 },
      { id: '3', name: 'Eggs (12 pack)', quantity: 1, price: 300 },
      { id: '4', name: 'Butter', quantity: 1, price: 250 },
      { id: '5', name: 'Jam', quantity: 1, price: 180 }
    ]
  },
  {
    id: '2',
    name: 'Home Office Essentials',
    description: 'Get productive with this home office bundle',
    originalPrice: 8000,
    bundlePrice: 6499,
    savings: 1501,
    image: '/images/office-bundle.jpg',
    category: 'Office',
    items: [
      { id: '6', name: 'Notebook Set', quantity: 3, price: 500 },
      { id: '7', name: 'Pens Pack', quantity: 1, price: 300 },
      { id: '8', name: 'Desk Organizer', quantity: 1, price: 1200 },
      { id: '9', name: 'Coffee Mug', quantity: 1, price: 400 }
    ]
  },
  {
    id: '3',
    name: 'Cleaning Essentials',
    description: 'Keep your home spotless with this cleaning bundle',
    originalPrice: 3500,
    bundlePrice: 2799,
    savings: 701,
    image: '/images/cleaning-bundle.jpg',
    category: 'Household',
    items: [
      { id: '10', name: 'All-Purpose Cleaner', quantity: 2, price: 400 },
      { id: '11', name: 'Dish Soap', quantity: 1, price: 250 },
      { id: '12', name: 'Toilet Paper (8 pack)', quantity: 1, price: 600 },
      { id: '13', name: 'Paper Towels', quantity: 2, price: 300 }
    ]
  }
]

export function getAllBundles(): Bundle[] {
  return bundles
}

export function getBundlesByCategory(category: string): Bundle[] {
  return bundles.filter(bundle => bundle.category.toLowerCase() === category.toLowerCase())
}

export function getBundle(id: string): Bundle | undefined {
  return bundles.find(bundle => bundle.id === id)
}

export function getPopularBundles(): Bundle[] {
  return bundles.filter(bundle => bundle.popular)
}

export function getFeaturedBundles(): Bundle[] {
  return bundles.slice(0, 3) // Return first 3 bundles as featured
}