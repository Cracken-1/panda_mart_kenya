'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Smartphone, 
  Key, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Monitor,
  Wifi,
  Lock,
  Unlock,
  Settings
} from 'lucide-react'
import TwoFactorSetup from '../auth/TwoFactorSetup'

interface SecurityDashboardProps {
  userEmail: string
}

const SecurityDashboard = ({ userEmail }: SecurityDashboardProps) => {
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    sessionTimeout: 30,
    deviceTrust: true
  })
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error'}>({message: '', visible: false, type: 'success'})
  const [trustedDevices, setTrustedDevices] = useState([
    {
      id: 1,
      name: 'iPhone 13 Pro',
      type: 'mobile',
      lastUsed: '2024-01-20 14:30:00',
      location: 'Nairobi, Kenya',
      current: true
    },
    {
      id: 2,
      name: 'MacBook Pro',
      type: 'desktop',
      lastUsed: '2024-01-19 09:15:00',
      location: 'Nairobi, Kenya',
      current: false
    },
    {
      id: 3,
      name: 'Samsung Galaxy S23',
      type: 'mobile',
      lastUsed: '2024-01-17 16:20:00',
      location: 'Mombasa, Kenya',
      current: false
    }
  ])

  // Load security settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('panda_security_settings')
    if (savedSettings) {
      try {
        setSecuritySettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading security settings:', error)
      }
    }

    const savedDevices = localStorage.getItem('panda_trusted_devices')
    if (savedDevices) {
      try {
        setTrustedDevices(JSON.parse(savedDevices))
      } catch (error) {
        console.error('Error loading trusted devices:', error)
      }
    }
  }, [])

  // Save security settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('panda_security_settings', JSON.stringify(securitySettings))
  }, [securitySettings])

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 3000)
  }

  const [recentActivity] = useState([
    {
      id: 1,
      action: 'Login',
      device: 'iPhone 13 Pro',
      location: 'Nairobi, Kenya',
      ip: '197.248.xxx.xxx',
      timestamp: '2024-01-20 14:30:00',
      status: 'success',
      trusted: true
    },
    {
      id: 2,
      action: 'Password Change',
      device: 'MacBook Pro',
      location: 'Nairobi, Kenya',
      ip: '197.248.xxx.xxx',
      timestamp: '2024-01-19 09:15:00',
      status: 'success',
      trusted: true
    },
    {
      id: 3,
      action: 'Failed Login Attempt',
      device: 'Unknown Device',
      location: 'Lagos, Nigeria',
      ip: '41.203.xxx.xxx',
      timestamp: '2024-01-18 22:45:00',
      status: 'blocked',
      trusted: false
    },
    {
      id: 4,
      action: 'Login',
      device: 'Samsung Galaxy S23',
      location: 'Mombasa, Kenya',
      ip: '41.90.xxx.xxx',
      timestamp: '2024-01-17 16:20:00',
      status: 'success',
      trusted: true
    }
  ])

  // Remove device functionality
  const handleRemoveDevice = async (deviceId: number) => {
    if (confirm('Are you sure you want to remove this device from your trusted devices?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const updatedDevices = trustedDevices.filter(device => device.id !== deviceId)
        setTrustedDevices(updatedDevices)
        localStorage.setItem('panda_trusted_devices', JSON.stringify(updatedDevices))
        
        showToast('Device removed successfully', 'success')
      } catch (error) {
        showToast('Failed to remove device', 'error')
      }
    }
  }

  // Update session timeout
  const handleUpdateSessionTimeout = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedSettings = { ...securitySettings, sessionTimeout: 15 }
      setSecuritySettings(updatedSettings)
      
      showToast('Session timeout updated to 15 minutes', 'success')
    } catch (error) {
      showToast('Failed to update session timeout', 'error')
    }
  }

  // Handle security setting changes with feedback
  const handleSecuritySettingChange = (key: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }))
    
    const settingNames: { [key: string]: string } = {
      loginNotifications: 'Login Notifications',
      suspiciousActivityAlerts: 'Suspicious Activity Alerts',
      deviceTrust: 'Device Trust'
    }
    
    const settingName = settingNames[key] || key
    showToast(`${settingName} ${value ? 'enabled' : 'disabled'}`, 'success')
  }

  const getSecurityScore = () => {
    let score = 0
    if (securitySettings.twoFactorEnabled) score += 40
    if (securitySettings.loginNotifications) score += 20
    if (securitySettings.suspiciousActivityAlerts) score += 20
    if (securitySettings.sessionTimeout <= 30) score += 10
    if (securitySettings.deviceTrust) score += 10
    return score
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const handleTwoFactorSetup = (backupCodes: string[]) => {
    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }))
    setShowTwoFactorSetup(false)
    // In real app, save backup codes securely
    console.log('Backup codes:', backupCodes)
  }

  const securityScore = getSecurityScore()

  if (showTwoFactorSetup) {
    return (
      <TwoFactorSetup
        userEmail={userEmail}
        onSetupComplete={handleTwoFactorSetup}
        onCancel={() => setShowTwoFactorSetup(false)}
      />
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
      
      {/* Security Score */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-panda-black-900">Security Dashboard</h2>
          <div className={`px-4 py-2 rounded-full ${getScoreBackground(securityScore)}`}>
            <span className={`font-bold ${getScoreColor(securityScore)}`}>
              Security Score: {securityScore}/100
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Security Status */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              securityScore >= 80 ? 'bg-green-100' : securityScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Shield className={`w-8 h-8 ${getScoreColor(securityScore)}`} />
            </div>
            <h3 className="font-semibold text-panda-black-900">
              {securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Improvement'}
            </h3>
            <p className="text-sm text-gray-600">Security Level</p>
          </div>

          {/* 2FA Status */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              securitySettings.twoFactorEnabled ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Smartphone className={`w-8 h-8 ${
                securitySettings.twoFactorEnabled ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <h3 className="font-semibold text-panda-black-900">
              {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </h3>
            <p className="text-sm text-gray-600">Two-Factor Auth</p>
          </div>

          {/* Recent Activity */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-panda-black-900">{recentActivity.length}</h3>
            <p className="text-sm text-gray-600">Recent Activities</p>
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      {securityScore < 100 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-panda-black-900 mb-4">Security Recommendations</h3>
          <div className="space-y-3">
            {!securitySettings.twoFactorEnabled && (
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <div className="font-semibold text-red-800">Enable Two-Factor Authentication</div>
                    <div className="text-sm text-red-600">Add an extra layer of security to your account</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTwoFactorSetup(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Enable
                </button>
              </div>
            )}

            {securitySettings.sessionTimeout > 30 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                  <div>
                    <div className="font-semibold text-yellow-800">Reduce Session Timeout</div>
                    <div className="text-sm text-yellow-600">Set a shorter timeout for better security</div>
                  </div>
                </div>
                <button 
                  onClick={handleUpdateSessionTimeout}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          {[
            {
              key: 'twoFactorEnabled',
              label: 'Two-Factor Authentication',
              description: 'Require a code from your phone when signing in',
              icon: Smartphone
            },
            {
              key: 'loginNotifications',
              label: 'Login Notifications',
              description: 'Get notified when someone signs into your account',
              icon: Eye
            },
            {
              key: 'suspiciousActivityAlerts',
              label: 'Suspicious Activity Alerts',
              description: 'Get alerts for unusual account activity',
              icon: AlertTriangle
            },
            {
              key: 'deviceTrust',
              label: 'Device Trust',
              description: 'Remember trusted devices to reduce login prompts',
              icon: Monitor
            }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <setting.icon className="w-5 h-5 text-panda-red-500 mr-3" />
                <div>
                  <div className="font-semibold text-panda-black-900">{setting.label}</div>
                  <div className="text-sm text-gray-600">{setting.description}</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings[setting.key as keyof typeof securitySettings] as boolean}
                  onChange={(e) => {
                    if (setting.key === 'twoFactorEnabled') return
                    handleSecuritySettingChange(setting.key, e.target.checked)
                  }}
                  className="sr-only peer"
                  disabled={setting.key === 'twoFactorEnabled'}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-panda-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-panda-red-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-panda-black-900">Recent Activity</h3>
          <button className="text-panda-red-500 font-semibold hover:text-panda-red-600 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  activity.status === 'success' ? 'bg-green-100' : 
                  activity.status === 'blocked' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : activity.status === 'blocked' ? (
                    <Lock className="w-5 h-5 text-red-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                
                <div>
                  <div className="font-semibold text-panda-black-900">{activity.action}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Monitor className="w-4 h-4 mr-1" />
                    {activity.device}
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    {activity.location}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">{activity.timestamp}</div>
                <div className="text-xs text-gray-400">{activity.ip}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trusted Devices */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-panda-black-900">Trusted Devices</h3>
          <button className="text-panda-red-500 font-semibold hover:text-panda-red-600 transition-colors">
            Manage All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustedDevices.map((device) => (
            <div key={device.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {device.type === 'mobile' ? (
                    <Smartphone className="w-5 h-5 text-panda-red-500 mr-2" />
                  ) : (
                    <Monitor className="w-5 h-5 text-panda-red-500 mr-2" />
                  )}
                  <span className="font-semibold text-panda-black-900">{device.name}</span>
                </div>
                {device.current && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Current
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {device.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Last used: {device.lastUsed}
                </div>
              </div>
              
              {!device.current && (
                <button 
                  onClick={() => handleRemoveDevice(device.id)}
                  className="w-full mt-3 text-red-500 hover:text-red-600 text-sm font-semibold"
                >
                  Remove Device
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SecurityDashboard