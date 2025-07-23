import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pandamart.co.ke'
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Collection pages
  const collections = [
    'furniture',
    'electronics',
    'homeware',
    'beauty',
    'hardware',
    'appliances',
    'decor',
    'kitchen',
    'bedroom',
    'living-room'
  ]

  const collectionPages = collections.map(collection => ({
    url: `${baseUrl}/collections/${collection}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Store locations (example stores)
  const stores = [
    'westgate',
    'garden-city',
    'sarit-centre',
    'junction',
    'village-market',
    'galleria',
    'thika-road-mall',
    'two-rivers'
  ]

  const storePages = stores.map(store => ({
    url: `${baseUrl}/stores/${store}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Deal categories
  const dealCategories = [
    'flash-sales',
    'weekly-deals',
    'clearance',
    'new-arrivals',
    'trending',
    'electronics-deals',
    'furniture-deals',
    'home-deals'
  ]

  const dealPages = dealCategories.map(category => ({
    url: `${baseUrl}/deals/${category}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Help and support pages
  const supportPages = [
    'contact',
    'faq',
    'shipping',
    'returns',
    'warranty',
    'size-guide',
    'payment-methods'
  ]

  const helpPages = supportPages.map(page => ({
    url: `${baseUrl}/help/${page}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Blog/News pages (if applicable)
  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  ]

  return [
    ...staticPages,
    ...collectionPages,
    ...storePages,
    ...dealPages,
    ...helpPages,
    ...blogPages
  ]
}