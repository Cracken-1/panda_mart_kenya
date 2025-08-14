'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import AuthenticationForm from '@/components/auth/AuthenticationForm';
import Link from 'next/link';
import { 
  Award, 
  Star, 
  Crown, 
  Diamond, 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  Gift, 
  Zap,
  Heart,
  ShoppingBag,
  Trophy,
  Gem,
  Users,
  Percent,
  Truck,
  Bell,
  CreditCard,
  Smartphone,
  Mail,
  CheckCircle,
  ArrowRight,
  Plus,
  Minus,
  X,
  ExternalLink,
  Info
} from 'lucide-react';

interface LoyaltyTier {
  id: string;
  name: string;
  icon: any;
  color: string;
  minPoints: number;
  multiplier: number;
  benefits: string[];
  description: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  image: string;
  expiryDate?: string;
  termsAndConditions: string[];
  isAvailable: boolean;
  isPopular?: boolean;
  isLimited?: boolean;
  quantityLeft?: number;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  description: string;
  date: string;
  orderId?: string;
  rewardId?: string;
}

export default function LoyaltyPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userPoints, setUserPoints] = useState(2450);
  const [currentTier, setCurrentTier] = useState('gold');
  const [pointsToNextTier, setPointsToNextTier] = useState(550);
  const [lifetimePoints, setLifetimePoints] = useState(8750);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const loyaltyTiers: LoyaltyTier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      icon: Award,
      color: 'from-orange-400 to-orange-600',
      minPoints: 0,
      multiplier: 1,
      benefits: [
        'Earn 1 point per KSh 100 spent',
        'Birthday bonus: 100 points',
        'Welcome bonus: 50 points',
        'Basic customer support'
      ],
      description: 'Welcome to Panda Rewards! Start earning points on every purchase.'
    },
    {
      id: 'silver',
      name: 'Silver',
      icon: Star,
      color: 'from-gray-400 to-gray-600',
      minPoints: 1000,
      multiplier: 1.25,
      benefits: [
        'Earn 1.25 points per KSh 100 spent',
        'Birthday bonus: 200 points',
        'Free delivery on orders over KSh 3,000',
        'Priority customer support',
        'Early access to sales'
      ],
      description: 'Unlock enhanced benefits and faster point earning.'
    },
    {
      id: 'gold',
      name: 'Gold',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      minPoints: 3000,
      multiplier: 1.5,
      benefits: [
        'Earn 1.5 points per KSh 100 spent',
        'Birthday bonus: 300 points',
        'Free delivery on all orders',
        'Priority customer support',
        'Early access to sales',
        'Exclusive member events'
      ],
      description: 'Premium benefits and exclusive perks for our valued customers.'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      icon: Diamond,
      color: 'from-purple-400 to-purple-600',
      minPoints: 10000,
      multiplier: 2,
      benefits: [
        'Earn 2 points per KSh 100 spent',
        'Birthday bonus: 500 points',
        'Free express delivery',
        'VIP customer support',
        'Dedicated account manager',
        'Exclusive platinum events',
        'Extended return period (60 days)',
        'Personal shopping service',
        'Quarterly bonus points'
      ],
      description: 'Elite status with maximum benefits and exclusive access.'
    }
  ];

  const mockRewards: Reward[] = [
    {
      id: 'discount-10',
      name: '10% Off Next Purchase',
      description: 'Get 10% discount on your next order (minimum KSh 2,000)',
      pointsCost: 500,
      category: 'discounts',
      image: '/rewards/discount-10.jpg',
      expiryDate: '2024-12-31',
      termsAndConditions: [
        'Minimum order value KSh 2,000',
        'Cannot be combined with other offers',
        'Valid for online and in-store purchases',
        'Valid for 30 days from redemption'
      ],
      isAvailable: true,
      isPopular: true
    },
    {
      id: 'free-delivery',
      name: 'Free Delivery Voucher',
      description: 'Free delivery on your next order (any amount)',
      pointsCost: 200,
      category: 'delivery',
      image: '/rewards/free-delivery.jpg',
      expiryDate: '2024-12-31',
      termsAndConditions: [
        'Valid for 60 days from redemption',
        'Applies to standard delivery only',
        'Valid within Nairobi metropolitan area',
        'Cannot be combined with other delivery offers'
      ],
      isAvailable: true,
      isPopular: true
    },
    {
      id: 'gift-card-1000',
      name: 'KSh 1,000 Gift Card',
      description: 'Digital gift card worth KSh 1,000',
      pointsCost: 1000,
      category: 'gift-cards',
      image: '/rewards/gift-card.jpg',
      termsAndConditions: [
        'Can be used online and in-store',
        'Valid for 12 months from issue date',
        'Non-transferable and non-refundable'
      ],
      isAvailable: true
    },
    {
      id: 'premium-support',
      name: '3 Months Premium Support',
      description: 'Upgrade to premium customer support for 3 months',
      pointsCost: 750,
      category: 'services',
      image: '/rewards/premium-support.jpg',
      termsAndConditions: [
        'Includes priority phone and chat support',
        'Dedicated account manager',
        'Extended return period',
        'Non-transferable and non-refundable'
      ],
      isAvailable: true
    },
    {
      id: 'exclusive-event',
      name: 'VIP Shopping Event Access',
      description: 'Exclusive access to our next VIP shopping event',
      pointsCost: 1500,
      category: 'experiences',
      image: '/rewards/vip-event.jpg',
      expiryDate: '2024-12-15',
      termsAndConditions: [
        'Event Date: December 20, 2024',
        'Includes refreshments and personal shopping assistance',
        'Limited to 50 participants',
        'Extended return period',
        'Non-transferable'
      ],
      isAvailable: true,
      isLimited: true,
      quantityLeft: 12
    },
    {
      id: 'tech-consultation',
      name: 'Free Tech Consultation',
      description: '1-hour consultation with our tech experts',
      pointsCost: 600,
      category: 'services',
      image: '/rewards/tech-consultation.jpg',
      termsAndConditions: [
        'Covers product recommendations and setup',
        'Can be conducted in-store or virtually',
        'Valid for 90 days from redemption',
        'Non-transferable'
      ],
      isAvailable: true,
      isLimited: true,
      quantityLeft: 8
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'earned',
      points: 150,
      description: 'Purchase at Garden City store',
      date: '2024-12-20',
      orderId: 'ORD-2024-001'
    },
    {
      id: '2',
      type: 'redeemed',
      points: -500,
      description: '10% discount voucher',
      date: '2024-12-18',
      rewardId: 'discount-10'
    },
    {
      id: '3',
      type: 'earned',
      points: 300,
      description: 'Birthday bonus points',
      date: '2024-12-15'
    },
    {
      id: '4',
      type: 'earned',
      points: 75,
      description: 'Online purchase',
      date: '2024-12-12',
      orderId: 'ORD-2024-002'
    },
    {
      id: '5',
      type: 'redeemed',
      points: -200,
      description: 'Free delivery voucher',
      date: '2024-12-10',
      rewardId: 'free-delivery'
    }
  ];

  const rewardCategories = [
    { id: 'all', name: 'All Rewards', icon: Gift },
    { id: 'discounts', name: 'Discounts', icon: Percent },
    { id: 'delivery', name: 'Delivery', icon: Truck },
    { id: 'gift-cards', name: 'Gift Cards', icon: CreditCard },
    { id: 'services', name: 'Services', icon: Users },
    { id: 'experiences', name: 'Experiences', icon: Star }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setTransactions(mockTransactions);
      setAvailableRewards(mockRewards);
    }, 1000);
  }, []);

  const getCurrentTierInfo = () => {
    return loyaltyTiers.find(tier => tier.id === currentTier) || loyaltyTiers[0];
  };

  const getNextTierInfo = () => {
    const currentIndex = loyaltyTiers.findIndex(tier => tier.id === currentTier);
    return currentIndex < loyaltyTiers.length - 1 ? loyaltyTiers[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const currentTierInfo = getCurrentTierInfo();
    const nextTierInfo = getNextTierInfo();
    
    if (!nextTierInfo) return 100;
    
    const pointsInCurrentTier = userPoints - currentTierInfo.minPoints;
    const pointsNeededForNextTier = nextTierInfo.minPoints - currentTierInfo.minPoints;
    
    return Math.min((pointsInCurrentTier / pointsNeededForNextTier) * 100, 100);
  };

  const handleRedeemReward = (reward: Reward) => {
    if (userPoints >= reward.pointsCost && reward.isAvailable) {
      setSelectedReward(reward);
      setShowRedeemModal(true);
    }
  };

  const confirmRedemption = () => {
    if (selectedReward) {
      setUserPoints(prev => prev - selectedReward.pointsCost);
      setTransactions(prev => [...prev, {
        id: Date.now().toString(),
        type: 'redeemed',
        points: -selectedReward.pointsCost,
        description: `Redeemed ${selectedReward.name}`,
        date: new Date().toISOString().split('T')[0],
        rewardId: selectedReward.id
      }]);
      setShowRedeemModal(false);
      setSelectedReward(null);
    }
  };

  const filteredRewards = availableRewards.filter(reward => 
    selectedCategory === 'all' || reward.category === selectedCategory
  );

  const currentTierInfo = getCurrentTierInfo();
  const nextTierInfo = getNextTierInfo();
  const CurrentTierIcon = currentTierInfo.icon;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Award },
    { id: 'rewards', name: 'Rewards', icon: Gift },
    { id: 'tiers', name: 'Tiers', icon: Crown },
    { id: 'history', name: 'History', icon: Clock }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <AuthenticationForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`bg-gradient-to-r ${currentTierInfo.color} text-white rounded-2xl p-6 lg:p-8`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Panda Rewards</h1>
                <p className="text-lg opacity-90 mb-4">
                  Welcome, {user.firstName}! You're a {currentTierInfo.name} member.
                </p>
                <p className="opacity-75">{currentTierInfo.description}</p>
              </div>
              
              <div className="mt-6 lg:mt-0 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CurrentTierIcon className="w-12 h-12" />
                </div>
                <div className="text-2xl font-bold">{userPoints.toLocaleString()}</div>
                <div className="text-sm opacity-90">Available Points</div>
              </div>
            </div>
            
            {/* Progress to next tier */}
            {nextTierInfo && (
              <div className="mt-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="opacity-90">Progress to {nextTierInfo.name}</span>
                  <span className="opacity-90">{pointsToNextTier} points to go</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${getProgressToNextTier()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userPoints.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Available Points</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{lifetimePoints.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Lifetime Points</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentTierInfo.name}</div>
                <div className="text-sm text-gray-600">Current Tier</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{nextTierInfo?.name || 'Max'}</div>
                <div className="text-sm text-gray-600">Next Tier</div>
              </div>
            </div>

            {/* Current Tier Benefits */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Current Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTierInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Rewards */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Popular Rewards</h3>
                <button 
                  onClick={() => setActiveTab('rewards')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableRewards.filter(r => r.isPopular).slice(0, 3).map((reward) => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Gift className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{reward.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-emerald-600">{reward.pointsCost} points</span>
                      <button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={userPoints < reward.pointsCost || !reward.isAvailable}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          userPoints >= reward.pointsCost && reward.isAvailable
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {userPoints >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Browse Rewards</h3>
              <div className="flex flex-wrap gap-2">
                {rewardCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <div key={reward.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                    <Gift className="w-16 h-16 text-gray-400" />
                    {reward.isPopular && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        Popular
                      </span>
                    )}
                    {reward.isLimited && (
                      <span className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        Limited
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-2">{reward.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                    
                    {reward.expiryDate && (
                      <div className="flex items-center gap-1 text-xs text-orange-600 mb-2">
                        <Clock className="w-3 h-3" />
                        Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    {reward.isLimited && reward.quantityLeft && (
                      <div className="text-xs text-purple-600 mb-4">
                        Only {reward.quantityLeft} left
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-emerald-600">{reward.pointsCost} points</span>
                      <button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={userPoints < reward.pointsCost || !reward.isAvailable}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          userPoints >= reward.pointsCost && reward.isAvailable
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {userPoints >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Loyalty Tiers</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unlock more benefits as you shop and earn points. Each tier offers enhanced rewards and exclusive perks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loyaltyTiers.map((tier) => {
                const TierIcon = tier.icon;
                const isCurrentTier = tier.id === currentTier;
                const isUnlocked = userPoints >= tier.minPoints;

                return (
                  <div
                    key={tier.id}
                    className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                      isCurrentTier ? 'ring-4 ring-emerald-500' : ''
                    }`}
                  >
                    <div className={`bg-gradient-to-br ${tier.color} text-white p-6 text-center`}>
                      {isCurrentTier && (
                        <div className="absolute top-3 right-3 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Current
                        </div>
                      )}
                      
                      <TierIcon className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                      <div className="text-sm opacity-90">
                        {tier.minPoints === 0 ? 'Starting tier' : `${tier.minPoints}+ points`}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm font-medium text-gray-900">Benefits:</div>
                        {tier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">Point Multiplier</div>
                        <span className="text-xl font-bold text-gray-900">{tier.multiplier}x</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Points History</h3>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earned' ? 'bg-green-100' : 
                      transaction.type === 'redeemed' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {transaction.type === 'earned' ? (
                        <Plus className="w-5 h-5 text-green-600" />
                      ) : transaction.type === 'redeemed' ? (
                        <Minus className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                      {transaction.orderId && (
                        <div className="text-xs text-blue-600">Order: {transaction.orderId}</div>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points} points
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Redemption Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Confirm Redemption</h3>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedReward.name}</h4>
              <p className="text-gray-600 mb-4">{selectedReward.description}</p>
              <div className="text-2xl font-bold text-emerald-600 mb-4">
                {selectedReward.pointsCost} points
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Terms & Conditions:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedReward.termsAndConditions.map((term, index) => (
                    <li key={index}>• {term}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedemption}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}