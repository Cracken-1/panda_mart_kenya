'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  Star,
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Heart,
  Zap,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  Activity,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    averageValue: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    loyaltyMembers: number;
    growth: number;
  };
  products: {
    totalViews: number;
    totalSales: number;
    topPerforming: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
      views: number;
      conversionRate: number;
    }>;
    lowStock: Array<{
      id: string;
      name: string;
      currentStock: number;
      minStock: number;
    }>;
  };
  traffic: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
    deviceBreakdown: {
      mobile: number;
      desktop: number;
      tablet: number;
    };
    sourceBreakdown: {
      direct: number;
      search: number;
      social: number;
      referral: number;
    };
  };
  storePerformance: {
    footTraffic: number;
    conversionRate: number;
    averageTransactionValue: number;
    peakHours: Array<{
      hour: number;
      visitors: number;
      sales: number;
    }>;
    categoryPerformance: Array<{
      category: string;
      sales: number;
      revenue: number;
      growth: number;
    }>;
  };
}

interface StoreAnalyticsDashboardProps {
  storeId: string;
  storeName: string;
}

export default function StoreAnalyticsDashboard({ storeId, storeName }: StoreAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data - in production, this would come from an API
  const mockAnalyticsData: AnalyticsData = {
    revenue: {
      today: 125000,
      yesterday: 98000,
      thisWeek: 750000,
      lastWeek: 680000,
      thisMonth: 2850000,
      lastMonth: 2650000,
      growth: 7.5
    },
    orders: {
      total: 156,
      pending: 12,
      completed: 138,
      cancelled: 6,
      averageValue: 8500,
      growth: 12.3
    },
    customers: {
      total: 1247,
      new: 89,
      returning: 67,
      loyaltyMembers: 892,
      growth: 15.2
    },
    products: {
      totalViews: 15420,
      totalSales: 892,
      topPerforming: [
        {
          id: 'iphone-15-pro',
          name: 'iPhone 15 Pro 128GB',
          sales: 45,
          revenue: 6525000,
          views: 1250,
          conversionRate: 3.6
        },
        {
          id: 'samsung-galaxy-s24',
          name: 'Samsung Galaxy S24 Ultra',
          sales: 32,
          revenue: 4320000,
          views: 980,
          conversionRate: 3.3
        },
        {
          id: 'macbook-air-m3',
          name: 'MacBook Air M3 13"',
          sales: 18,
          revenue: 2970000,
          views: 650,
          conversionRate: 2.8
        },
        {
          id: 'sony-headphones',
          name: 'Sony WH-1000XM5',
          sales: 67,
          revenue: 2345000,
          views: 1890,
          conversionRate: 3.5
        },
        {
          id: 'nintendo-switch',
          name: 'Nintendo Switch OLED',
          sales: 28,
          revenue: 1260000,
          views: 780,
          conversionRate: 3.6
        }
      ],
      lowStock: [
        {
          id: 'iphone-15-pro',
          name: 'iPhone 15 Pro 128GB',
          currentStock: 3,
          minStock: 10
        },
        {
          id: 'dyson-vacuum',
          name: 'Dyson V15 Detect',
          currentStock: 1,
          minStock: 5
        },
        {
          id: 'instant-pot',
          name: 'Instant Pot Duo 7-in-1',
          currentStock: 2,
          minStock: 8
        }
      ]
    },
    traffic: {
      totalVisitors: 8945,
      uniqueVisitors: 6234,
      pageViews: 25670,
      bounceRate: 32.5,
      averageSessionDuration: 4.2,
      deviceBreakdown: {
        mobile: 65,
        desktop: 28,
        tablet: 7
      },
      sourceBreakdown: {
        direct: 45,
        search: 32,
        social: 15,
        referral: 8
      }
    },
    storePerformance: {
      footTraffic: 2340,
      conversionRate: 6.7,
      averageTransactionValue: 8500,
      peakHours: [
        { hour: 9, visitors: 45, sales: 3 },
        { hour: 10, visitors: 78, sales: 5 },
        { hour: 11, visitors: 120, sales: 8 },
        { hour: 12, visitors: 156, sales: 12 },
        { hour: 13, visitors: 189, sales: 15 },
        { hour: 14, visitors: 234, sales: 18 },
        { hour: 15, visitors: 198, sales: 14 },
        { hour: 16, visitors: 167, sales: 11 },
        { hour: 17, visitors: 145, sales: 9 },
        { hour: 18, visitors: 123, sales: 7 },
        { hour: 19, visitors: 89, sales: 4 },
        { hour: 20, visitors: 56, sales: 2 }
      ],
      categoryPerformance: [
        {
          category: 'Electronics',
          sales: 234,
          revenue: 15680000,
          growth: 18.5
        },
        {
          category: 'Fashion',
          sales: 189,
          revenue: 3450000,
          growth: 12.3
        },
        {
          category: 'Home & Garden',
          sales: 156,
          revenue: 4230000,
          growth: 8.7
        },
        {
          category: 'Health & Beauty',
          sales: 98,
          revenue: 1890000,
          growth: 15.2
        },
        {
          category: 'Sports & Outdoors',
          sales: 67,
          revenue: 2340000,
          growth: 22.1
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    }, 1500);
  }, []);

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Unable to load analytics data at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Analytics</h1>
          <p className="text-gray-600">{storeName} - Real-time performance insights</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analyticsData.revenue.growth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.revenue.growth)}`}>
                {formatPercentage(analyticsData.revenue.growth)}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(analyticsData.revenue.today)}
          </div>
          <div className="text-sm text-gray-600">Today's Revenue</div>
          <div className="text-xs text-gray-500 mt-2">
            vs. yesterday: {formatCurrency(analyticsData.revenue.yesterday)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analyticsData.orders.growth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.orders.growth)}`}>
                {formatPercentage(analyticsData.orders.growth)}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.orders.total}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-xs text-gray-500 mt-2">
            Avg. value: {formatCurrency(analyticsData.orders.averageValue)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analyticsData.customers.growth)}
              <span className={`text-sm font-medium ${getGrowthColor(analyticsData.customers.growth)}`}>
                {formatPercentage(analyticsData.customers.growth)}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.customers.total}
          </div>
          <div className="text-sm text-gray-600">Total Customers</div>
          <div className="text-xs text-gray-500 mt-2">
            New: {analyticsData.customers.new} | Returning: {analyticsData.customers.returning}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">Live</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatPercentage(analyticsData.storePerformance.conversionRate)}
          </div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
          <div className="text-xs text-gray-500 mt-2">
            Foot traffic: {analyticsData.storePerformance.footTraffic}
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Performing Products</h3>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {analyticsData.products.topPerforming.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <div className="text-sm text-gray-600">
                      {product.sales} sales • {product.views} views
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPercentage(product.conversionRate)} conv.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Category Performance</h3>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View Details
            </button>
          </div>
          
          <div className="space-y-4">
            {analyticsData.storePerformance.categoryPerformance.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(category.revenue)}
                    </span>
                    <div className="flex items-center gap-1">
                      {getGrowthIcon(category.growth)}
                      <span className={`text-xs ${getGrowthColor(category.growth)}`}>
                        {formatPercentage(category.growth)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(category.revenue / Math.max(...analyticsData.storePerformance.categoryPerformance.map(c => c.revenue))) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {category.sales} sales this period
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Device Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Mobile</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatPercentage(analyticsData.traffic.deviceBreakdown.mobile)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${analyticsData.traffic.deviceBreakdown.mobile}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Desktop</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatPercentage(analyticsData.traffic.deviceBreakdown.desktop)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${analyticsData.traffic.deviceBreakdown.desktop}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Tablet</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatPercentage(analyticsData.traffic.deviceBreakdown.tablet)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${analyticsData.traffic.deviceBreakdown.tablet}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Traffic Sources</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-gray-900">Direct</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatPercentage(analyticsData.traffic.sourceBreakdown.direct)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${analyticsData.traffic.sourceBreakdown.direct}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Search</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatPercentage(analyticsData.traffic.sourceBreakdown.search)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${analyticsData.traffic.sourceBreakdown.search}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-600" />
                <span className="font-medium text-gray-900">Social</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatPercentage(analyticsData.traffic.sourceBreakdown.social)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full"
                style={{ width: `${analyticsData.traffic.sourceBreakdown.social}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">Referral</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatPercentage(analyticsData.traffic.sourceBreakdown.referral)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${analyticsData.traffic.sourceBreakdown.referral}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.products.lowStock.map((product) => (
              <div key={product.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className="font-bold text-red-600">{product.currentStock}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Minimum Required:</span>
                  <span className="font-medium text-gray-900">{product.minStock}</span>
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                  Reorder Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Peak Hours Analysis</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Sales</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-2 h-64">
          {analyticsData.storePerformance.peakHours.map((hour) => {
            const maxVisitors = Math.max(...analyticsData.storePerformance.peakHours.map(h => h.visitors));
            const maxSales = Math.max(...analyticsData.storePerformance.peakHours.map(h => h.sales));
            const visitorHeight = (hour.visitors / maxVisitors) * 100;
            const salesHeight = (hour.sales / maxSales) * 100;
            
            return (
              <div key={hour.hour} className="flex flex-col items-center">
                <div className="flex-1 flex flex-col justify-end gap-1 w-full">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${visitorHeight}%`, minHeight: '4px' }}
                    title={`${hour.visitors} visitors`}
                  ></div>
                  <div 
                    className="bg-emerald-500 rounded-t"
                    style={{ height: `${salesHeight}%`, minHeight: '2px' }}
                    title={`${hour.sales} sales`}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {hour.hour}:00
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}