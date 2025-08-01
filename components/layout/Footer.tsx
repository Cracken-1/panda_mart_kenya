'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Download } from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Deals & Promotions', href: '/deals' },
    { name: 'Our Collections', href: '/collections' },
    { name: 'Stores', href: '/stores' },
    { name: 'Panda Community', href: '/community' },
  ]

  const categories = [
    { name: 'Furniture', href: '/collections/furniture' },
    { name: 'Electronics', href: '/collections/electronics' },
    { name: 'Homeware', href: '/collections/homeware' },
    { name: 'Beauty & Lifestyle', href: '/collections/beauty' },
    { name: 'Hardware', href: '/collections/hardware' },
  ]

  const support = [
    { name: 'Contact Us', href: 'mailto:info@pandamart.co.ke' },
    { name: 'About Us', href: '/about' },
    { name: 'Wholesale Inquiries', href: 'mailto:wholesale@pandamart.co.ke' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ]

  return (
    <footer className="bg-panda-black-900 text-white">
      {/* Mobile App Banner */}
      <div className="gradient-bg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Get the Panda Mart App</h3>
              <p className="text-white/90">Exclusive deals and seamless shopping experience</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                <Download className="w-5 h-5" />
                <span className="font-semibold">Download App</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Panda Mart</h2>
                <p className="text-panda-red-500 font-medium">Kenya</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Your trusted destination for affordable home, electronics, beauty, and lifestyle products across Kenya.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-panda-red-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/pandamartkenya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-panda-red-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-panda-red-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-panda-red-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href} className="text-gray-300 hover:text-panda-red-500 transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Support</h3>

            {/* Store Locations */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-semibold text-gray-200">Store Locations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2 text-gray-300">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Garden City Mall</div>
                    <div className="text-xs text-gray-400">Nairobi</div>
                    <a href="tel:0202311166" className="text-panda-red-400 hover:text-panda-red-300 transition-colors">
                      020 231 1166
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-gray-300">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Galleria Shopping Mall</div>
                    <div className="text-xs text-gray-400">Nairobi</div>
                    <a href="tel:0778666666" className="text-panda-red-400 hover:text-panda-red-300 transition-colors">
                      077 866 6666
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* General Contact */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-semibold text-gray-200">General Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@pandamart.co.ke" className="hover:text-panda-red-500 transition-colors text-sm">
                    info@pandamart.co.ke
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:wholesale@pandamart.co.ke" className="hover:text-panda-red-500 transition-colors text-sm">
                    wholesale@pandamart.co.ke
                  </a>
                </div>
              </div>
            </div>

            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-panda-red-500 transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Panda Mart Kenya. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-panda-red-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-panda-red-500 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer