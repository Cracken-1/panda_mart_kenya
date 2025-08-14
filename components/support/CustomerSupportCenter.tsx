'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  Filter,
  Send,
  Paperclip,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  Bot,
  Headphones,
  Video,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Zap,
  Shield,
  Truck,
  CreditCard,
  Package,
  RefreshCw,
  Settings,
  Bell
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
  messages: SupportMessage[];
  rating?: number;
  feedback?: string;
}

interface SupportMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  specialties: string[];
  rating: number;
  responseTime: string;
}

export default function CustomerSupportCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFAQs] = useState<FAQItem[]>([]);
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium' as const
  });
  const [chatMessage, setChatMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const mockTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: 'Order delivery delay',
      description: 'My order #ORD-2024-001 was supposed to be delivered yesterday but I haven\'t received it yet.',
      status: 'in-progress',
      priority: 'high',
      category: 'delivery',
      createdAt: '2024-12-20T10:30:00Z',
      updatedAt: '2024-12-20T14:15:00Z',
      assignedAgent: 'Sarah Wanjiku',
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          message: 'My order #ORD-2024-001 was supposed to be delivered yesterday but I haven\'t received it yet.',
          timestamp: '2024-12-20T10:30:00Z'
        },
        {
          id: 'msg-2',
          sender: 'agent',
          message: 'Hi! I\'m sorry to hear about the delay. Let me check the status of your order right away.',
          timestamp: '2024-12-20T11:45:00Z'
        },
        {
          id: 'msg-3',
          sender: 'agent',
          message: 'I\'ve contacted our delivery partner and your order is currently out for delivery. You should receive it by 6 PM today.',
          timestamp: '2024-12-20T14:15:00Z'
        }
      ]
    },
    {
      id: 'TKT-002',
      subject: 'Product return request',
      description: 'I need to return a Samsung Galaxy S24 that I purchased last week. The screen has a defect.',
      status: 'resolved',
      priority: 'medium',
      category: 'returns',
      createdAt: '2024-12-18T09:15:00Z',
      updatedAt: '2024-12-19T16:30:00Z',
      assignedAgent: 'James Mwangi',
      messages: [
        {
          id: 'msg-4',
          sender: 'user',
          message: 'I need to return a Samsung Galaxy S24 that I purchased last week. The screen has a defect.',
          timestamp: '2024-12-18T09:15:00Z'
        },
        {
          id: 'msg-5',
          sender: 'agent',
          message: 'I\'ll help you with the return process. Can you please provide your order number?',
          timestamp: '2024-12-18T10:30:00Z'
        },
        {
          id: 'msg-6',
          sender: 'system',
          message: 'Return request approved. Return label has been sent to your email.',
          timestamp: '2024-12-19T16:30:00Z'
        }
      ],
      rating: 5,
      feedback: 'Excellent service! The return process was very smooth.'
    },
    {
      id: 'TKT-003',
      subject: 'Account login issues',
      description: 'I can\'t log into my account. It says my password is incorrect but I\'m sure it\'s right.',
      status: 'open',
      priority: 'low',
      category: 'account',
      createdAt: '2024-12-21T08:45:00Z',
      updatedAt: '2024-12-21T08:45:00Z',
      messages: [
        {
          id: 'msg-7',
          sender: 'user',
          message: 'I can\'t log into my account. It says my password is incorrect but I\'m sure it\'s right.',
          timestamp: '2024-12-21T08:45:00Z'
        }
      ]
    }
  ];

  const mockFAQs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "Orders" section. You\'ll find a tracking number and real-time updates on your order status. You can also use our order tracking tool on the homepage.',
      category: 'orders',
      helpful: 245,
      notHelpful: 12,
      tags: ['tracking', 'orders', 'delivery']
    },
    {
      id: 'faq-2',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Electronics have a 14-day return window. To initiate a return, visit your account dashboard or contact our support team.',
      category: 'returns',
      helpful: 189,
      notHelpful: 8,
      tags: ['returns', 'policy', 'refund']
    },
    {
      id: 'faq-3',
      question: 'How do I use my Panda Points?',
      answer: 'Panda Points can be redeemed for discounts, free delivery, and exclusive rewards. Visit the Loyalty section in your account to see available rewards. Points are automatically applied at checkout when you select a reward.',
      category: 'loyalty',
      helpful: 156,
      notHelpful: 5,
      tags: ['loyalty', 'points', 'rewards']
    },
    {
      id: 'faq-4',
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, Visa, Mastercard, bank transfers, and cash on delivery. All online payments are secured with 256-bit SSL encryption. You can save multiple payment methods in your account for faster checkout.',
      category: 'payment',
      helpful: 203,
      notHelpful: 7,
      tags: ['payment', 'mpesa', 'cards', 'security']
    },
    {
      id: 'faq-5',
      question: 'Do you offer installation services?',
      answer: 'Yes! We offer professional installation services for appliances, electronics, and furniture. Installation fees vary by product and location. You can add installation service during checkout or contact us after purchase.',
      category: 'services',
      helpful: 134,
      notHelpful: 3,
      tags: ['installation', 'services', 'appliances']
    }
  ];

  const mockAgents: SupportAgent[] = [
    {
      id: 'agent-1',
      name: 'Sarah Wanjiku',
      avatar: '/avatars/sarah.jpg',
      status: 'online',
      specialties: ['Orders', 'Delivery', 'General Support'],
      rating: 4.9,
      responseTime: '< 2 minutes'
    },
    {
      id: 'agent-2',
      name: 'James Mwangi',
      avatar: '/avatars/james.jpg',
      status: 'online',
      specialties: ['Returns', 'Technical Support', 'Product Issues'],
      rating: 4.8,
      responseTime: '< 3 minutes'
    },
    {
      id: 'agent-3',
      name: 'Grace Njeri',
      avatar: '/avatars/grace.jpg',
      status: 'busy',
      specialties: ['Account Issues', 'Payments', 'Loyalty Program'],
      rating: 4.9,
      responseTime: '< 5 minutes'
    }
  ];

  const supportCategories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle },
    { id: 'orders', name: 'Orders & Delivery', icon: Package },
    { id: 'returns', name: 'Returns & Refunds', icon: RefreshCw },
    { id: 'payment', name: 'Payment & Billing', icon: CreditCard },
    { id: 'account', name: 'Account & Login', icon: User },
    { id: 'technical', name: 'Technical Support', icon: Settings },
    { id: 'loyalty', name: 'Loyalty Program', icon: Star },
    { id: 'general', name: 'General Inquiry', icon: MessageSquare }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setTickets(mockTickets);
      setFAQs(mockFAQs);
      setAgents(mockAgents);
    }, 1000);
  }, []);

  const handleCreateTicket = () => {
    const newTicket: SupportTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicketData.subject,
      description: newTicketData.description,
      status: 'open',
      priority: newTicketData.priority,
      category: newTicketData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          message: newTicketData.description,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
    setNewTicketData({
      subject: '',
      description: '',
      category: 'general',
      priority: 'medium'
    });
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedTicket) return;

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      message: chatMessage,
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      updatedAt: new Date().toISOString()
    };

    setSelectedTicket(updatedTicket);
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setChatMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HelpCircle },
    { id: 'tickets', name: 'My Tickets', icon: MessageSquare },
    { id: 'faq', name: 'FAQ', icon: BookOpen },
    { id: 'contact', name: 'Contact Us', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
                <p className="text-lg opacity-90">
                  We're here to help! Get support 24/7 from our expert team.
                </p>
              </div>
              
              <div className="mt-4 lg:mt-0 flex items-center gap-4">
                <button
                  onClick={() => setShowChatModal(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Live Chat
                </button>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="flex items-center gap-2 bg-white text-emerald-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  New Ticket
                </button>
              </div>
            </div>
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
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setShowChatModal(true)}
                className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600">Get instant help from our support team</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">3 agents online</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('tickets')}
                className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">My Tickets</h3>
                <p className="text-sm text-gray-600">View and manage your support tickets</p>
                <div className="mt-4">
                  <span className="text-xs text-blue-600 font-medium">{tickets.length} active tickets</span>
                </div>
              </button>

              <a
                href="tel:+254712345678"
                className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-sm text-gray-600">Speak directly with our support team</p>
                <div className="mt-4">
                  <span className="text-xs text-green-600 font-medium">+254 712 345 678</span>
                </div>
              </a>

              <button
                onClick={() => setActiveTab('faq')}
                className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                <p className="text-sm text-gray-600">Find answers to common questions</p>
                <div className="mt-4">
                  <span className="text-xs text-purple-600 font-medium">{faqs.length} articles</span>
                </div>
              </button>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Tickets</h3>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {tickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{ticket.subject}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.description.substring(0, 100)}...</p>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(ticket.createdAt).toLocaleDateString()}
                        {ticket.assignedAgent && ` • Assigned to: ${ticket.assignedAgent}`}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setActiveTab('tickets');
                      }}
                      className="ml-4 px-3 py-2 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular FAQs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Popular Questions</h3>
                <button
                  onClick={() => setActiveTab('faq')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {faqs.slice(0, 5).map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-600 mb-4">{faq.answer}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({faq.helpful})
                          </button>
                          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600">
                            <ThumbsDown className="w-4 h-4" />
                            Not Helpful ({faq.notHelpful})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Tickets Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Support Tickets</h2>
                <p className="text-gray-600">Track and manage your support requests</p>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Ticket
              </button>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Ticket #{ticket.id}</span>
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                        {ticket.assignedAgent && <span>Agent: {ticket.assignedAgent}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="ml-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                  
                  {ticket.rating && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">Your Rating:</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < ticket.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {ticket.feedback && (
                        <p className="text-sm text-gray-600 italic">"{ticket.feedback}"</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* FAQ Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find quick answers to common questions</p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {supportCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                        {faq.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 ml-4" />
                    )}
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-600 mb-6">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              Helpful ({faq.helpful})
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                              <ThumbsDown className="w-4 h-4" />
                              Not Helpful ({faq.notHelpful})
                            </button>
                          </div>
                          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                            Still need help?
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            {/* Contact Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Our Support Team</h2>
              <p className="text-gray-600">Choose the best way to reach us</p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Get instant help from our support agents</p>
                <div className="text-sm text-gray-500 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>3 agents online</span>
                  </div>
                  <div>Average response: &lt; 2 minutes</div>
                </div>
                <button
                  onClick={() => setShowChatModal(true)}
                  className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Start Chat
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Speak directly with our support team</p>
                <div className="text-sm text-gray-500 mb-4">
                  <div>+254 712 345 678</div>
                  <div>Mon-Sun: 8:00 AM - 10:00 PM</div>
                </div>
                <a
                  href="tel:+254712345678"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors inline-block"
                >
                  Call Now
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Send us a detailed message</p>
                <div className="text-sm text-gray-500 mb-4">
                  <div>support@pandamart.co.ke</div>
                  <div>Response within 24 hours</div>
                </div>
                <a
                  href="mailto:support@pandamart.co.ke"
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors inline-block"
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* Available Agents */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Available Support Agents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'online' ? 'bg-green-500' :
                            agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{agent.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{agent.responseTime}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-2">Specialties:</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.specialties.map((specialty) => (
                          <span key={specialty} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create New Support Ticket</h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData({...newTicketData, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTicketData.category}
                    onChange={(e) => setNewTicketData({...newTicketData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {supportCategories.filter(c => c.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTicketData.priority}
                    onChange={(e) => setNewTicketData({...newTicketData, priority: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTicketData.description}
                  onChange={(e) => setNewTicketData({...newTicketData, description: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Please provide detailed information about your issue..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newTicketData.subject || !newTicketData.description}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Chat Support</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Sarah is online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Hi! I'm Sarah from Panda Mart support. How can I help you today?</p>
                    <span className="text-xs text-gray-500 mt-1 block">Just now</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-600">Ticket #{selectedTicket.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {selectedTicket.messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' ? 'bg-emerald-100' :
                      message.sender === 'agent' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-emerald-600" />
                      ) : message.sender === 'agent' ? (
                        <Headphones className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`max-w-md ${
                      message.sender === 'user' ? 'bg-emerald-500 text-white' : 'bg-gray-100'
                    } rounded-lg p-3`}>
                      <p className="text-sm">{message.message}</p>
                      <span className={`text-xs mt-1 block ${
                        message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedTicket.status !== 'closed' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}