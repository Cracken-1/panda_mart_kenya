'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useOrders } from '@/lib/hooks/useOrders';
import { useWishlist } from '@/lib/hooks/useWishlist';
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
  Zap,
  TrendingUp,
  Award,
  Bell,
  Settings,
  Store,
  Calendar,
  BarChart3,
  PieChart,
  Users,
  MessageSquare,
  Shield,
  Smartphone,
  Wallet,
  BookOpen,
  Camera,
  Share2,
  ThumbsUp,
  Filter,
  Search,
  Globe,
  Lock,
  Eye,
  Edit3,
  Plus,
  Minus,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Building,
  Phone,
  Mail,
  Download,
  RefreshCw,
  Target,
  DollarSign,
  Percent,
  AlertCircle
} from 'lucide-react';

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileManagement = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+254 712 345 678',
    dateOfBirth: '1990-05-15',
    gender: 'prefer-not-to-say',
    bio: 'Tech enthusiast and avid shopper',
    interests: ['Electronics', 'Fashion', 'Home & Garden']
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={profileData.gender}
              onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            disabled={!isEditing}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* Profile Picture & Social */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture & Social</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{profileData.firstName} {profileData.lastName}</h4>
            <p className="text-gray-600 mb-3">{profileData.bio}</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      name: 'Home Address',
      street: '123 Kimathi Street',
      city: 'Nairobi',
      state: 'Nairobi County',
      zipCode: '00100',
      country: 'Kenya',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Office Address',
      street: '456 Uhuru Highway',
      city: 'Nairobi',
      state: 'Nairobi County',
      zipCode: '00200',
      country: 'Kenya',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Delivery Addresses</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-2xl shadow-lg p-6 relative">
            {address.isDefault && (
              <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
                Default
              </span>
            )}
            
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                {address.type === 'home' ? <Home className="w-5 h-5 text-emerald-600" /> : <Building className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{address.name}</h4>
                <p className="text-gray-600 text-sm mt-1">
                  {address.street}<br />
                  {address.city}, {address.state} {address.zipCode}<br />
                  {address.country}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Delete
              </button>
              {!address.isDefault && (
                <button className="flex-1 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Add New Address</h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Name</label>
              <input
                type="text"
                placeholder="e.g., Home, Office"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                placeholder="Street address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                placeholder="Postal code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      name: 'Visa ending in 4242',
      details: 'Expires 12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'mpesa',
      name: 'M-Pesa',
      details: '+254 712 345 678',
      isDefault: false
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add Payment Method
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                {method.type === 'card' ? <CreditCard className="w-6 h-6 text-emerald-600" /> : <Smartphone className="w-6 h-6 text-emerald-600" />}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{method.name}</h4>
                <p className="text-gray-600 text-sm">{method.details}</p>
                {method.isDefault && (
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium mt-1">
                    Default
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Edit
              </button>
              <button className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Security & Privacy</h3>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, twoFactorEnabled: !securitySettings.twoFactorEnabled})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive order updates and promotions via email</p>
            </div>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, emailNotifications: !securitySettings.emailNotifications})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.emailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              securitySettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive delivery updates via SMS</p>
            </div>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, smsNotifications: !securitySettings.smsNotifications})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.smsNotifications ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              securitySettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Login Alerts</h4>
              <p className="text-sm text-gray-600">Get notified of new device logins</p>
            </div>
          </div>
          <button
            onClick={() => setSecuritySettings({...securitySettings, loginAlerts: !securitySettings.loginAlerts})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              securitySettings.loginAlerts ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Password & Security</h4>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Change Password</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Download Account Data</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
            <span>Delete Account</span>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ComprehensiveAccountDashboard() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { orders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pandaPoints: 2450,
    currentTier: 'Gold',
    nextTierPoints: 550,
    totalSavings: 15420,
    averageOrderValue: 0,
    favoriteCategory: 'Electronics'
  });

  useEffect(() => {
    if (orders.length > 0) {
      const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const averageOrderValue = totalSpent / orders.length;
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue
      }));
    }
  }, [orders]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'loyalty', name: 'Loyalty', icon: Award },
    { id: 'analytics', name: 'Analytics', icon: PieChart }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManagement />;
      case 'addresses':
        return <AddressManagement />;
      case 'payments':
        return <PaymentMethods />;
      case 'security':
        return <SecuritySettings />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-emerald-100 text-lg">
              Your comprehensive shopping dashboard awaits
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.pandaPoints}</div>
              <div className="text-emerald-200 text-sm">Panda Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.currentTier}</div>
              <div className="text-emerald-200 text-sm">Tier Status</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-emerald-100">Progress to Platinum</span>
            <span className="text-emerald-100">{stats.nextTierPoints} points to go</span>
          </div>
          <div className="w-full bg-emerald-400/30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${((stats.pandaPoints) / (stats.pandaPoints + stats.nextTierPoints)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-xs text-green-600 mt-1">+12% this month</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">KSh {stats.totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
          <div className="text-xs text-blue-600 mt-1">Avg: KSh {Math.round(stats.averageOrderValue).toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.pandaPoints}</div>
          <div className="text-sm text-gray-600">Panda Points</div>
          <div className="text-xs text-purple-600 mt-1">Worth KSh {(stats.pandaPoints * 0.1).toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Percent className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">KSh {stats.totalSavings.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Savings</div>
          <div className="text-xs text-emerald-600 mt-1">24% saved this year</div>
        </div>
      </div>

      {/* Quick Actions Enhanced */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'Checkout',
              description: `${cart.itemCount} items ready`,
              href: '/account/checkout',
              icon: CheckCircle,
              color: 'bg-emerald-500',
              badge: cart.itemCount > 0 ? cart.itemCount.toString() : null,
              disabled: cart.itemCount === 0
            },
            {
              name: 'Shop in Store',
              description: 'Browse store inventory',
              href: '/shop-in-store',
              icon: Store,
              color: 'bg-teal-500',
              badge: 'New'
            },
            {
              name: 'Track Orders',
              description: `${stats.totalOrders} total orders`,
              href: '/account/orders',
              icon: Truck,
              color: 'bg-blue-500',
            },
            {
              name: 'Wishlist',
              description: `${wishlistItems.length} saved items`,
              href: '/account/wishlist',
              icon: Heart,
              color: 'bg-red-500',
            },
            {
              name: 'Loyalty Rewards',
              description: 'Redeem points & benefits',
              href: '/account/loyalty',
              icon: Gift,
              color: 'bg-purple-500',
            },
            {
              name: 'Customer Support',
              description: '24/7 help available',
              href: '/support',
              icon: MessageSquare,
              color: 'bg-orange-500',
            },
            {
              name: 'Refer Friends',
              description: 'Earn KSh 500 per referral',
              href: '/referrals',
              icon: Users,
              color: 'bg-pink-500',
            },
            {
              name: 'Settings',
              description: 'Account preferences',
              href: '/account/settings',
              icon: Settings,
              color: 'bg-gray-500',
            }
          ].map((action) => (
            <Link
              key={action.name}
              href={action.disabled ? '#' : action.href}
              className={`relative p-4 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-200 group ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{action.name}</h3>
              <p className="text-xs text-gray-600">{action.description}</p>
              
              {action.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {action.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Advanced Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gray-500" />
            Shopping Analytics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Favorite Category</div>
                <div className="text-lg font-semibold text-blue-600">{stats.favoriteCategory}</div>
              </div>
              <div className="text-2xl">📱</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Monthly Budget</div>
                <div className="text-lg font-semibold text-green-600">KSh 25,000</div>
              </div>
              <div className="text-2xl">💰</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Shopping Streak</div>
                <div className="text-lg font-semibold text-purple-600">7 days</div>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-gray-500" />
            Goals & Achievements
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-800">Gold Tier Achieved</span>
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs text-emerald-700">Unlocked exclusive benefits and faster shipping</div>
            </div>
            
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">First Review Posted</span>
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xs text-blue-700">Earned 50 bonus points for your first product review</div>
            </div>
            
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-800">Referral Master</span>
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-xs text-yellow-700">Referred 3 friends and earned KSh 1,500</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Smart Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: 'order',
                title: 'Order #ORD-2024-001 delivered',
                description: 'iPhone 15 Pro and 2 other items',
                time: '2 hours ago',
                icon: CheckCircle,
                color: 'text-green-600'
              },
              {
                id: 2,
                type: 'points',
                title: 'Earned 150 Panda Points',
                description: 'From your recent purchase',
                time: '1 day ago',
                icon: Star,
                color: 'text-yellow-600'
              },
              {
                id: 3,
                type: 'review',
                title: 'Review posted',
                description: 'Samsung Galaxy S24 Ultra - 5 stars',
                time: '2 days ago',
                icon: ThumbsUp,
                color: 'text-blue-600'
              },
              {
                id: 4,
                type: 'wishlist',
                title: 'Added to wishlist',
                description: 'MacBook Pro M3',
                time: '3 days ago',
                icon: Heart,
                color: 'text-red-600'
              }
            ].map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-gray-500" />
            Smart Recommendations
          </h3>
          
          <div className="space-y-4">
            {[
              {
                id: 'flash-sale',
                title: 'Flash Sale Ending Soon',
                description: 'Up to 70% off electronics',
                href: '/flash-sale',
                color: 'bg-gradient-to-r from-red-500 to-orange-500',
                icon: Zap,
                urgency: '2 hours left'
              },
              {
                id: 'restock',
                title: 'Back in Stock',
                description: 'Items from your wishlist are available',
                href: '/account/wishlist',
                color: 'bg-gradient-to-r from-green-500 to-emerald-500',
                icon: Package,
                urgency: '3 items'
              },
              {
                id: 'birthday',
                title: 'Birthday Special',
                description: 'Exclusive 25% off everything',
                href: '/birthday-sale',
                color: 'bg-gradient-to-r from-purple-500 to-pink-500',
                icon: Gift,
                urgency: 'Today only'
              }
            ].map((rec) => (
              <Link
                key={rec.id}
                href={rec.href}
                className={`block p-4 ${rec.color} text-white rounded-xl hover:shadow-lg transition-all duration-200 group relative overflow-hidden`}
              >
                <div className="flex items-center gap-3">
                  <rec.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm opacity-90">{rec.description}</p>
                  </div>
                  <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {rec.urgency}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}