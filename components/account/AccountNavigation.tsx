'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  MapPinIcon, 
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/account',
    icon: ChartBarIcon,
  },
  {
    name: 'Profile',
    href: '/account/profile',
    icon: UserIcon,
  },
  {
    name: 'Orders',
    href: '/account/orders',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Wishlist',
    href: '/account/wishlist',
    icon: HeartIcon,
  },
  {
    name: 'Addresses',
    href: '/account/addresses',
    icon: MapPinIcon,
  },
  {
    name: 'Settings',
    href: '/account/settings',
    icon: CogIcon,
  },
];

export function AccountNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">My Account</h2>
      <ul className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}