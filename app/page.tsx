import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import FeaturedDealsSection from '@/components/home/FeaturedDealsSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import ValuePropositionSection from '@/components/home/ValuePropositionSection'
import WhatsHotSection from '@/components/home/WhatsHotSection'
import StoreLocatorCTA from '@/components/home/StoreLocatorCTA'

export const metadata: Metadata = {
  title: 'Panda Mart Kenya - Your World of Amazing Deals',
  description: 'Discover unbeatable deals on electronics, furniture, homeware, and more at Panda Mart Kenya. Quality products at affordable prices with convenient store locations across Kenya.',
  keywords: 'panda mart, kenya, electronics, furniture, homeware, deals, shopping, nairobi, westgate, garden city',
  openGraph: {
    title: 'Panda Mart Kenya - Your World of Amazing Deals',
    description: 'Quality products at unbeatable prices. Visit our stores across Kenya or shop online.',
    images: ['/images/og-home.jpg'],
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Carousel */}
      <HeroSection />
      
      {/* Featured Deals with Countdown Timer */}
      <FeaturedDealsSection />
      
      {/* Product Categories */}
      <CategoriesSection />
      
      {/* What's Hot/Trending Products */}
      <WhatsHotSection />
      
      {/* Value Proposition & Why Choose Us */}
      <ValuePropositionSection />
      
      {/* Store Locator CTA */}
      <StoreLocatorCTA />
    </main>
  )
}