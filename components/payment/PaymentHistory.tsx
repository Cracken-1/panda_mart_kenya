'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, Calendar, Filter, Download, 
  CheckCircle, Clock, AlertCircle, Search,
  ChevronDown, Receipt, RefreshCw
} from 'lucide-react'

interface PaymentHistoryProps {
  userId?: string
}

const PaymentHistory = ({ userId }: PaymentHistoryProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('last30')
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{message: string, visible: boolean}>({message: '', visible: false})

  const filters = [
    { id: 'all', name: 'All Transactions', count: 24 },
    { id: 'completed', name: 'Completed', count: 20 },
    { id: 'pending', name: 'Pending', count: 2 },
    { id: 'failed', name: 'Failed', count: 2 }
  ]

  // Load transactions from localStorage and merge with default data
  useEffect(() => {
    const defaultTransactions = [
      {
        id: 'TXN-2024-001',
        date: '2024-01-15',
        amount: 'KES 15,500',
        method: 'M-Pesa',
        status: 'completed',
        description: 'Purchase at Garden City Store',
        reference: 'MPX123456789',
        items: ['Smart TV 43"', 'HDMI Cable', 'Wall Mount']
      },
      {
        id: 'TXN-2024-002',
        date: '2024-01-12',
        amount: 'KES 8,200',
        method: 'Card',
        status: 'completed',
        description: 'Online Order - Garden City Pickup',
        reference: 'CARD987654321',
        items: ['Kitchen Cookware Set', 'Dish Towels']
      },
      {
        id: 'TXN-2024-003',
        date: '2024-01-10',
        amount: 'KES 3,500',
        method: 'Cash',
        status: 'completed',
        description: 'Purchase at Galleria Store',
        reference: 'CASH001234',
        items: ['Wireless Headphones', 'Phone Case']
      },
      {
        id: 'TXN-2024-004',
        date: '2024-01-08',
        amount: 'KES 12,000',
        method: 'M-Pesa',
        status: 'pending',
        description: 'Furniture Order - Delivery Pending',
        reference: 'MPX987654321',
        items: ['Office Chair', 'Desk Lamp']
      },
      {
        id: 'TXN-2024-005',
        date: '2024-01-05',
        amount: 'KES 2,800',
        method: 'Card',
        status: 'failed',
        description: 'Payment Failed - Insufficient Funds',
        reference: 'CARD123456789',
        items: ['Beauty Care Set']
      }
    ]

    // Load saved payments from localStorage
    const savedPayments = JSON.parse(localStorage.getItem('panda_payments') || '[]')
    
    // Merge and sort by date
    const allTransactions = [...defaultTransactions, ...savedPayments].sort((a, b) => 
      new Date(b.date || b.timestamp).getTime() - new Date(a.date || a.timestamp).getTime()
    )
    
    setTransactions(allTransactions)
  }, [])

  // Toast notification system
  const showToast = (message: string) => {
    setToast({message, visible: true})
    setTimeout(() => setToast({message: '', visible: false}), 3000)
  }

  // Export functionality
  const handleExport = async () => {
    setIsLoading(true)
    try {
      const dataToExport = filteredTransactions.map(t => ({
        ID: t.id,
        Date: t.date || t.timestamp,
        Amount: t.amount,
        Method: t.method,
        Status: t.status,
        Description: t.description,
        Reference: t.reference
      }))
      
      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      showToast('Payment history exported successfully')
    } catch (error) {
      showToast('Failed to export payment history')
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh functionality
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reload from localStorage
      const savedPayments = JSON.parse(localStorage.getItem('panda_payments') || '[]')
      const defaultTransactions = transactions.filter(t => t.id.startsWith('TXN-2024'))
      const allTransactions = [...defaultTransactions, ...savedPayments].sort((a, b) => 
        new Date(b.date || b.timestamp).getTime() - new Date(a.date || a.timestamp).getTime()
      )
      
      setTransactions(allTransactions)
      showToast('Payment history refreshed')
    } catch (error) {
      showToast('Failed to refresh payment history')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'm-pesa':
        return <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
      case 'card':
        return <CreditCard className="w-8 h-8 text-blue-600" />
      case 'cash':
        return <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
      default:
        return <CreditCard className="w-8 h-8 text-gray-600" />
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = selectedFilter === 'all' || transaction.status === selectedFilter
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {toast.message}
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
          <p className="text-gray-600">Track all your transactions and payment methods</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <Download className="w-4 h-4 mr-2" />
            {isLoading ? 'Exporting...' : 'Export'}
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
              isLoading 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date Range */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 3 months</option>
              <option value="last365">Last year</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.name}
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Payment Method Icon */}
                  <div className="flex-shrink-0">
                    {getPaymentMethodIcon(transaction.method)}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{transaction.id}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{transaction.method}</span>
                      <span>•</span>
                      <span>Ref: {transaction.reference}</span>
                    </div>

                    {/* Items */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {transaction.items.map((item, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount and Status */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{transaction.amount}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{transaction.status}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Receipt className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">KES 42,000</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg. Order</p>
              <p className="text-2xl font-bold text-gray-900">KES 1,750</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">91%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentHistory