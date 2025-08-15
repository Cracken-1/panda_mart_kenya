'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useOrders } from '@/lib/hooks/useOrders';
import Link from 'next/link';
import {
    ShoppingBag,
    Heart,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Star,
    Clock,
    Package,
    Gift,
    TrendingUp,
    Award,
    Bell,
    Settings,
    Store,
    User,
    ArrowRight,
    Plus,
    Eye,
    Search,
    Filter,
    Grid,
    List,
    Navigation,
    Phone,
    Calendar,
    X
} from 'lucide-react';

export default function CleanAccountDashboard() {
    const { user } = useAuth();
    const { cart } = useCart();
    const { orders } = useOrders();
    const [showShopInStore, setShowShopInStore] = useState(false);
    const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [nearbyStores, setNearbyStores] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pandaPoints: 2450,
        currentTier: 'Gold',
        nextTierPoints: 550,
        wishlistItems: 12
    });

    useEffect(() => {
        if (orders.length > 0) {
            const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
            setStats(prev => ({
                ...prev,
                totalOrders: orders.length,
                totalSpent
            }));
        }
    }, [orders]);

    useEffect(() => {
        if (user && 'geolocation' in navigator) {
            checkLocationPermission();
        }
    }, [user]);

    const checkLocationPermission = async () => {
        try {
            // First try to get current position to check if permission is already granted
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        setLocationPermission('granted');
                        console.log('Location obtained successfully');
                    },
                    (error) => {
                        console.log('Location error:', error.message);
                        if (error.code === error.PERMISSION_DENIED) {
                            setLocationPermission('denied');
                        } else {
                            setLocationPermission('pending');
                        }
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 5000,
                        maximumAge: 300000 // 5 minutes
                    }
                );
            } else {
                console.log('Geolocation not supported');
                setLocationPermission('denied');
            }
        } catch (error) {
            console.log('Error checking location permission:', error);
            setLocationPermission('pending');
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser');
            setLocationPermission('denied');
            return;
        }

        setLocationPermission('pending');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationPermission('granted');
                console.log('Location obtained successfully:', position.coords);

                // Calculate distances to stores
                const updatedStores = stores.map(store => ({
                    ...store,
                    distance: calculateDistance(
                        position.coords.latitude,
                        position.coords.longitude,
                        store.coordinates.lat,
                        store.coordinates.lng
                    )
                }));

                // Sort by distance
                updatedStores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                setNearbyStores(updatedStores);
            },
            (error) => {
                console.error('Error getting location:', error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationPermission('denied');
                        alert('Location access denied. Please enable location services in your browser settings to find nearby stores.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationPermission('denied');
                        alert('Location information is unavailable. Showing all stores.');
                        break;
                    case error.TIMEOUT:
                        setLocationPermission('pending');
                        alert('Location request timed out. Please try again.');
                        break;
                    default:
                        setLocationPermission('denied');
                        alert('An unknown error occurred while getting your location.');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    const requestLocationAccess = () => {
        getCurrentLocation();
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance.toFixed(1) + ' km';
    };

    const stores = [
        {
            id: 'garden-city',
            name: 'Garden City Mall',
            address: 'Thika Road, Garden City Mall',
            distance: '2.3 km',
            status: 'Open',
            products: '15,420',
            rating: 4.8
        },
        {
            id: 'galleria',
            name: 'Galleria Shopping Mall',
            address: 'Langata Road, Galleria Mall',
            distance: '5.7 km',
            status: 'Open',
            products: '12,800',
            rating: 4.6
        },
        {
            id: 'westgate',
            name: 'Westgate Shopping Mall',
            address: 'Westlands, Westgate Mall',
            distance: '8.1 km',
            status: 'Open',
            products: '18,900',
            rating: 4.7
        }
    ];

    const featuredDeals = [
        {
            id: 1,
            title: 'Electronics Flash Sale',
            description: 'Up to 50% off smartphones, laptops & more',
            discount: '50%',
            endsIn: '2 hours',
            image: '/deals/electronics.jpg'
        },
        {
            id: 2,
            title: 'Home Appliances Bundle',
            description: 'Buy 2 get 1 free on selected items',
            discount: 'BOGO',
            endsIn: '1 day',
            image: '/deals/appliances.jpg'
        },
        {
            id: 3,
            title: 'Fashion Week Special',
            description: 'New arrivals with exclusive discounts',
            discount: '30%',
            endsIn: '3 days',
            image: '/deals/fashion.jpg'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, {user?.firstName}
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your account and discover great deals</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900">{stats.pandaPoints}</div>
                                <div className="text-sm text-gray-500">Panda Points</div>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                                <div className="text-sm text-gray-600">Orders</div>
                            </div>
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">KSh {(stats.totalSpent / 1000).toFixed(0)}K</div>
                                <div className="text-sm text-gray-600">Spent</div>
                            </div>
                            <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</div>
                                <div className="text-sm text-gray-600">Wishlist</div>
                            </div>
                            <Heart className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.currentTier}</div>
                                <div className="text-sm text-gray-600">Tier</div>
                            </div>
                            <Award className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shop in Store Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Shop in Store</h2>
                                <button
                                    onClick={() => setShowShopInStore(!showShopInStore)}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    {showShopInStore ? 'Hide' : 'View All'}
                                </button>
                            </div>

                            {!showShopInStore ? (
                                <div className="space-y-4">
                                    <p className="text-gray-600 text-sm">
                                        Browse products in-store with real-time inventory and expert assistance
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setShowShopInStore(true)}
                                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Store className="w-4 h-4" />
                                            Browse Stores
                                        </button>
                                        <button
                                            onClick={requestLocationAccess}
                                            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            Find Nearest
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Location Status */}
                                    {locationPermission === 'pending' && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-blue-900">Enable Location Access</h3>
                                                    <p className="text-sm text-blue-700">Find the nearest store and check real-time inventory</p>
                                                </div>
                                                <button
                                                    onClick={requestLocationAccess}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                >
                                                    Enable
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {locationPermission === 'granted' && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <h3 className="font-medium text-green-900">Location Enabled</h3>
                                                    <p className="text-sm text-green-700">Showing stores near you</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {locationPermission === 'denied' && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-yellow-600" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-yellow-900">Location Access Denied</h3>
                                                    <p className="text-sm text-yellow-700">Showing all available stores</p>
                                                </div>
                                                <button
                                                    onClick={requestLocationAccess}
                                                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Store List */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900">Available Stores</h3>
                                        {stores.map((store) => (
                                            <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-medium text-gray-900">{store.name}</h4>
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                                {store.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-1">{store.address}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>{store.distance} away</span>
                                                            <span>{store.products} products</span>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                                <span>{store.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setShowScheduleModal(true)}
                                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                        >
                                                            Schedule Visit
                                                        </button>
                                                        <Link
                                                            href={`/shop-in-store/${store.id}`}
                                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                        >
                                                            Browse
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Featured Deals */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Featured Deals</h2>
                                <Link href="/shop-in-store" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                    View All
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featuredDeals.map((deal) => (
                                    <Link
                                        key={deal.id}
                                        href="/shop-in-store"
                                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                {deal.discount} OFF
                                            </span>
                                            <span className="text-xs text-gray-500">{deal.endsIn} left</span>
                                        </div>
                                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-900">
                                            {deal.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">{deal.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <Link
                                    href="/account/checkout"
                                    className={`flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group ${cart.itemCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <CheckCircle className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900">Checkout</span>
                                    <span className="text-xs text-gray-500">{cart.itemCount} items</span>
                                </Link>

                                <Link
                                    href="/account/orders"
                                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                >
                                    <Package className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900">Orders</span>
                                    <span className="text-xs text-gray-500">{stats.totalOrders} total</span>
                                </Link>

                                <Link
                                    href="/account/wishlist"
                                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                >
                                    <Heart className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900">Wishlist</span>
                                    <span className="text-xs text-gray-500">{stats.wishlistItems} items</span>
                                </Link>

                                <Link
                                    href="/account/settings"
                                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                >
                                    <Settings className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900">Settings</span>
                                    <span className="text-xs text-gray-500">Account</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                                <Link href="/account/orders" className="text-blue-600 hover:text-blue-700 text-sm">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {orders.slice(0, 3).map((order) => (
                                    <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Package className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                Order #{order.order_number}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                KSh {order.total_amount.toLocaleString()}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {orders.length === 0 && (
                                    <div className="text-center py-6">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No orders yet</p>
                                        <Link
                                            href="/shop-in-store"
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            Start Shopping
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <Bell className="w-5 h-5 text-gray-400" />
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-800">Flash Sale Alert</p>
                                    <p className="text-xs text-yellow-700">Electronics sale ends in 2 hours</p>
                                </div>

                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">New Arrivals</p>
                                    <p className="text-xs text-blue-700">Check out the latest products</p>
                                </div>

                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-800">Free Delivery</p>
                                    <p className="text-xs text-green-700">On orders over KSh 5,000</p>
                                </div>
                            </div>
                        </div>

                        {/* Loyalty Progress */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Loyalty Progress</h3>

                            <div className="text-center mb-4">
                                <div className="text-2xl font-bold text-gray-900">{stats.pandaPoints}</div>
                                <div className="text-sm text-gray-600">Panda Points</div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Progress to Platinum</span>
                                    <span className="text-gray-600">{stats.nextTierPoints} points to go</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                                        style={{ width: `${((stats.pandaPoints) / (stats.pandaPoints + stats.nextTierPoints)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Link
                                href="/account/loyalty"
                                className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                View Rewards
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Visit Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Schedule Your Visit</h3>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option>Garden City Mall</option>
                                    <option>Galleria Shopping Mall</option>
                                    <option>Westgate Shopping Mall</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option>9:00 AM - 11:00 AM</option>
                                    <option>11:00 AM - 1:00 PM</option>
                                    <option>1:00 PM - 3:00 PM</option>
                                    <option>3:00 PM - 5:00 PM</option>
                                    <option>5:00 PM - 7:00 PM</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose (Optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g., Looking for electronics, need consultation..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowScheduleModal(false);
                                    alert('Visit scheduled! We\'ll send you a confirmation email.');
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}