'use client';

import Link from 'next/link';
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Smartphone,
  CreditCard,
  Truck,
  Shield,
  Clock,
  Award,
  Heart,
  ArrowRight,
  Download
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Electronics', href: '/categories/electronics' },
        { name: 'Fashion', href: '/categories/fashion' },
        { name: 'Home & Garden', href: '/categories/home-garden' },
        { name: 'Health & Beauty', href: '/categories/health-beauty' },
        { name: 'Sports & Outdoors', href: '/categories/sports' },
        { name: 'Food & Beverages', href: '/categories/food' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Shop in Store', href: '/shop-in-store' },
        { name: 'Home Delivery', href: '/delivery' },
        { name: 'Installation Service', href: '/installation' },
        { name: 'Product Support', href: '/support' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Gift Cards', href: '/gift-cards' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Live Chat', href: '/chat' },
        { name: 'Phone Support', href: 'tel:+254712345678' },
        { name: 'Email Support', href: 'mailto:support@pandamart.co.ke' },
        { name: 'Track Order', href: '/track' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Investor Relations', href: '/investors' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Community', href: '/community' }
      ]
    }
  ];

  const storeLocations = [
    {
      name: 'Garden City Mall',
      address: 'Thika Road, Nairobi',
      phone: '020 231 1166',
      hours: 'Mon-Sun: 8AM-10PM'
    },
    {
      name: 'Galleria Mall',
      address: 'Langata Road, Nairobi',
      phone: '077 866 6666',
      hours: 'Mon-Sun: 9AM-9PM'
    }
  ];



  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders over KSh 5,000'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '256-bit SSL encryption'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '100% authentic products'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Panda Mart</span>
            </div>
            
            <p className="text-gray-400 mb-6">
              Kenya's leading retail destination offering quality products, 
              exceptional service, and unbeatable prices across all categories.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Mobile App */}
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-4">Download Our App</h4>
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                >
                  <Smartphone className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold text-white">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm font-semibold text-white">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Store Locations & Contact */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-white mb-4">Store Locations</h4>
            <div className="space-y-6">
              {storeLocations.map((location, index) => (
                <div key={index} className="text-sm">
                  <h5 className="font-medium text-white mb-2">{location.name}</h5>
                  <div className="space-y-1 text-gray-400">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{location.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{location.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+254 712 345 678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@pandamart.co.ke</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} Panda Mart Kenya. All rights reserved.
            </div>



            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Made with Love */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> in Kenya
          </div>
        </div>
      </div>
    </footer>
  );
}