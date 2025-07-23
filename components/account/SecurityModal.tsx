'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, Shield, Lock, Eye, EyeOff, Smartphone, 
  Key, AlertTriangle, CheckCircle, QrCode 
} from 'lucide-react'

interface User {
  id: string
  pandaId: string
  name: string
  email: string
  phone: string
  avatar: string | null
  tier: string
  points: number
  isVerified: boolean
}

interface SecurityModalProps {
  user: User
  onClose: () => void
}

const SecurityModal = ({ user, onClose }: SecurityModalProps) => {
  const [activeTab, setActiveTab] = useState('password')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const tabs = [
    { id: 'password', label: 'Password', icon: Lock },
    { id: '2fa', label: '2FA', icon: Shield },
    { id: 'devices', label: 'Devices', icon: Smartphone }
  ]

  const connectedDevices = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      type: 'Mobile',
      location: 'Nairobi, Kenya',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      name: 'MacBook Pro',
      type: 'Desktop',
      location: 'Nairobi, Kenya',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: 3,
      name: 'Chrome Browser',
      type: 'Web',
      location: 'Nairobi, Kenya',
      lastActive: '2 days ago',
      current: false
    }
  ]

  const renderPasswordTab = () => (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Password Security</p>
          <p className="text-xs text-yellow-700 mt-1">
            Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Confirm new password"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        Update Password
      </motion.button>
    </div>
  )

  const render2FATab = () => (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800">Two-Factor Authentication</p>
          <p className="text-xs text-green-700 mt-1">
            Add an extra layer of security to your account with 2FA.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Smartphone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Authenticator App</p>
            <p className="text-xs text-gray-500">Use Google Authenticator or similar</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTwoFactorEnabled(!twoFactorEnabled)
            if (!twoFactorEnabled) setShowQRCode(true)
          }}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            twoFactorEnabled 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          {twoFactorEnabled ? 'Disable' : 'Enable'}
        </motion.button>
      </div>

      {showQRCode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 rounded-xl p-6 text-center"
        >
          <QrCode className="w-32 h-32 mx-auto mb-4 text-gray-400" />
          <p className="text-sm font-medium text-gray-900 mb-2">
            Scan with your authenticator app
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Or enter this code manually: JBSWY3DPEHPK3PXP
          </p>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              Verify
            </motion.button>
          </div>
        </motion.div>
      )}

      {twoFactorEnabled && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">2FA is enabled</p>
            <p className="text-xs text-green-700">Your account is protected with 2FA</p>
          </div>
        </div>
      )}
    </div>
  )

  const renderDevicesTab = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
        <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Connected Devices</p>
          <p className="text-xs text-blue-700 mt-1">
            Manage devices that have access to your account.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {connectedDevices.map((device) => (
          <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-200 p-2 rounded-lg">
                <Smartphone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900">{device.name}</p>
                  {device.current && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{device.type} • {device.location}</p>
                <p className="text-xs text-gray-400">Last active: {device.lastActive}</p>
              </div>
            </div>
            
            {!device.current && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-red-600 text-sm font-medium hover:text-red-700"
              >
                Remove
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Security & Privacy</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'password' && renderPasswordTab()}
          {activeTab === '2fa' && render2FATab()}
          {activeTab === 'devices' && renderDevicesTab()}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SecurityModal