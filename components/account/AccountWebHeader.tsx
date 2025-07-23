'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown, ChevronRight, User, Settings, LogOut, Share2, Download,
    Smartphone, HelpCircle, MessageSquare, Star, Bell, ShoppingCart
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import FeedbackModal from './FeedbackModal'
import RatingModal from './RatingModal'
import CartIcon from '../cart/CartIcon'
import CartDrawer from '../cart/CartDrawer'

interface AccountWebHeaderProps {
    user: any
    activeSection: string
    onProfileEdit: () => void
    onLogout: () => void
}

const AccountWebHeader = ({ user, activeSection, onProfileEdit, onLogout }: AccountWebHeaderProps) => {
    const router = useRouter()
    const [showDropdown, setShowDropdown] = useState(false)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [showCartDrawer, setShowCartDrawer] = useState(false)

    const dropdownRef = useRef<HTMLDivElement>(null)

    const getSectionTitle = (section: string) => {
        const titles: { [key: string]: string } = {
            dashboard: 'Account Dashboard',
            profile: 'Profile Settings',
            orders: 'Order History',
            cart: 'Shopping Cart',
            coupons: 'Coupons & Rewards',
            addresses: 'Delivery Addresses',
            payment: 'Payment Methods',
            wishlist: 'My Wishlist',
            loyalty: 'Loyalty Program',
            security: 'Security Settings',
            notifications: 'Notification Preferences',
            support: 'Help & Support',
            settings: 'Account Settings'
        }
        return titles[section] || 'Account'
    }

    // Handle dropdown actions
    const handleAccountSettings = () => {
        router.push('/account#settings')
    }

    const handleNotifications = () => {
        router.push('/account#notifications')
    }

    const handleShareProfile = () => {
        if (navigator.share) {
            navigator.share({
                title: `${user.name}'s Panda Mart Profile`,
                text: `Check out my Panda Mart profile and see my reviews!`,
                url: window.location.origin + '/profile/' + user.id
            })
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(window.location.origin + '/profile/' + user.id)
            alert('Profile link copied to clipboard!')
        }
    }

    const handleDownloadData = () => {
        // In a real app, this would trigger a data export
        const data = {
            user: user,
            exportDate: new Date().toISOString(),
            orders: [], // Would fetch user's orders
            preferences: {}, // Would fetch user's preferences
            loyaltyData: {} // Would fetch loyalty program data
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `panda-mart-data-${user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleMobileApp = () => {
        // Check if user is on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        if (isMobile) {
            // Try to open app store
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
            const appStoreUrl = isIOS
                ? 'https://apps.apple.com/app/panda-mart/id123456789'
                : 'https://play.google.com/store/apps/details?id=com.pandamart.app'

            window.open(appStoreUrl, '_blank')
        } else {
            // Show QR code or send SMS
            alert('Scan the QR code with your phone or visit our mobile site at m.pandamart.co.ke')
        }
    }

    const handleHelp = () => {
        router.push('/account#support')
    }

    // Cart handlers
    const handleCartClick = () => {
        setShowCartDrawer(true)
    }

    const handleViewFullCart = () => {
        router.push('/account#cart')
    }

    const handleCheckout = () => {
        // Navigate to checkout page or show checkout modal
        router.push('/checkout')
    }

    const dropdownItems = [
        {
            id: 'edit-profile',
            label: 'Edit Profile',
            icon: User,
            action: onProfileEdit
        },
        {
            id: 'account-settings',
            label: 'Account Settings',
            icon: Settings,
            action: handleAccountSettings
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            action: handleNotifications
        },
        {
            id: 'share-profile',
            label: 'Share Profile',
            icon: Share2,
            action: handleShareProfile
        },
        {
            id: 'download-data',
            label: 'Download Data',
            icon: Download,
            action: handleDownloadData
        },
        {
            id: 'mobile-app',
            label: 'Get Mobile App',
            icon: Smartphone,
            action: handleMobileApp
        },
        {
            id: 'help',
            label: 'Help & Support',
            icon: HelpCircle,
            action: handleHelp
        },
        {
            id: 'feedback',
            label: 'Send Feedback',
            icon: MessageSquare,
            action: () => setShowFeedbackModal(true)
        },
        {
            id: 'rate-app',
            label: 'Rate Our Service',
            icon: Star,
            action: () => setShowRatingModal(true)
        },
        {
            id: 'logout',
            label: 'Sign Out',
            icon: LogOut,
            action: onLogout,
            danger: true
        }
    ]

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close user dropdown if clicked outside
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Page Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{getSectionTitle(activeSection)}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage your Panda Mart account and preferences
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {/* Cart Icon */}
                    <CartIcon 
                        onClick={handleCartClick}
                        size="lg"
                        className="hover:bg-gray-100"
                    />

                    {/* User Actions Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                        onClick={() => setShowDropdown(!showDropdown)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.tier} Member</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''
                            }`} />
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                            >
                                {dropdownItems.map((item, index) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => {
                                            item.action()
                                            setShowDropdown(false)
                                        }}
                                        whileHover={{ 
                                            backgroundColor: item.danger ? '#fef2f2' : '#f9fafb',
                                            scale: 1.02,
                                            x: 4
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 rounded-lg mx-2 ${item.danger
                                            ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            } ${index === dropdownItems.length - 1 ? 'border-t border-gray-100 mt-2 pt-3' : ''}`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: item.danger ? 5 : 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <item.icon className={`w-4 h-4 mr-3 transition-colors duration-200 ${
                                                item.danger ? 'text-red-500' : 'text-gray-400'
                                            }`} />
                                        </motion.div>
                                        <span className="font-medium">{item.label}</span>
                                        <motion.div
                                            className="ml-auto opacity-0"
                                            whileHover={{ opacity: 1, x: 2 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <ChevronRight className="w-3 h-3 text-gray-400" />
                                        </motion.div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <FeedbackModal
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                user={user}
            />

            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                user={user}
            />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={showCartDrawer}
                onClose={() => setShowCartDrawer(false)}
                onViewFullCart={handleViewFullCart}
                onCheckout={handleCheckout}
            />
        </div>
    )
}

export default AccountWebHeader