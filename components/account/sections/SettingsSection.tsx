'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, User, Bell, Shield, Globe, Palette,
  Moon, Sun, Smartphone, Download, Trash2, 
  RefreshCw, Database, Eye, EyeOff, Save,
  AlertTriangle, CheckCircle, Info, ExternalLink
} from 'lucide-react'

interface SettingsSectionProps {
  user?: any
}

const SettingsSection = ({ user }: SettingsSectionProps) => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      timezone: 'Africa/Nairobi',
      currency: 'KES',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light'
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMarketing: true,
      allowAnalytics: true,
      allowCookies: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      orderUpdates: true,
      securityAlerts: true
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    data: {
      autoBackup: true,
      dataRetention: 365,
      exportFormat: 'json'
    }
  })

  const [showDangerZone, setShowDangerZone] = useState(false)
  const [confirmAction, setConfirmAction] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error'}>({message: '', visible: false, type: 'success'})

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('panda_settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  // Apply theme to document when it changes
  useEffect(() => {
    const applyTheme = (theme: string) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
      } else if (theme === 'auto') {
        // Auto mode - detect system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark')
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          document.documentElement.setAttribute('data-theme', 'light')
        }
        
        // Listen for system theme changes
        const handleChange = (e: MediaQueryListEvent) => {
          if (settings.general.theme === 'auto') {
            if (e.matches) {
              document.documentElement.classList.add('dark')
              document.documentElement.setAttribute('data-theme', 'dark')
            } else {
              document.documentElement.classList.remove('dark')
              document.documentElement.setAttribute('data-theme', 'light')
            }
          }
        }
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
    }
    
    applyTheme(settings.general.theme)
  }, [settings.general.theme])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('panda_settings', JSON.stringify(settings))
  }, [settings])

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 3000)
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data & Storage', icon: Database },
    { id: 'advanced', name: 'Advanced', icon: RefreshCw }
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  const timezones = [
    { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)' },
    { value: 'Africa/Cairo', label: 'Cairo (GMT+2)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' }
  ]

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    
    // Show immediate feedback for certain settings
    if (category === 'privacy') {
      showToast(`Privacy setting updated: ${key}`, 'success')
    } else if (category === 'general' && key === 'language') {
      // Apply language change to HTML
      const langMap: { [key: string]: string } = {
        'en': 'en',
        'sw': 'sw',
        'fr': 'fr',
        'ar': 'ar'
      }
      document.documentElement.lang = langMap[value] || 'en'
      showToast('Language updated', 'success')
    }
  }

  const handleSaveSettings = async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage (already done in useEffect)
      setSaveStatus('success')
      showToast('Settings saved successfully!', 'success')
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      showToast('Failed to save settings', 'error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleExportData = async () => {
    setSaveStatus('saving')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create comprehensive data export
      const exportData = {
        profile: {
          exportDate: new Date().toISOString(),
          settings: settings,
          preferences: {
            theme: settings.general.theme,
            language: settings.general.language,
            timezone: settings.general.timezone
          }
        },
        privacy: {
          profileVisibility: settings.privacy.profileVisibility,
          dataSharing: {
            marketing: settings.privacy.allowMarketing,
            analytics: settings.privacy.allowAnalytics,
            cookies: settings.privacy.allowCookies
          }
        },
        orders: JSON.parse(localStorage.getItem('panda_payments') || '[]'),
        notifications: JSON.parse(localStorage.getItem('panda_notifications') || '[]'),
        loyaltyData: {
          points: localStorage.getItem('panda_user_points') || '0',
          redeemedRewards: JSON.parse(localStorage.getItem('panda_redeemed_rewards') || '[]')
        }
      }
      
      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `panda-mart-data-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
      
      setSaveStatus('success')
      showToast('Data exported successfully!', 'success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      showToast('Failed to export data', 'error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleResetSettings = async () => {
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      setSaveStatus('saving')
      try {
        // Reset to default settings
        const defaultSettings = {
          general: {
            language: 'en',
            timezone: 'Africa/Nairobi',
            currency: 'KES',
            dateFormat: 'DD/MM/YYYY',
            theme: 'light'
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false,
            allowMarketing: true,
            allowAnalytics: true,
            allowCookies: true
          },
          notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            marketingEmails: false,
            orderUpdates: true,
            securityAlerts: true
          },
          security: {
            twoFactorEnabled: false,
            loginAlerts: true,
            sessionTimeout: 30,
            passwordExpiry: 90
          },
          data: {
            autoBackup: true,
            dataRetention: 365,
            exportFormat: 'json'
          }
        }
        
        setSettings(defaultSettings)
        localStorage.setItem('panda_settings', JSON.stringify(defaultSettings))
        
        // Reset theme
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
        document.documentElement.lang = 'en'
        
        setSaveStatus('success')
        showToast('Settings reset to default', 'success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } catch (error) {
        setSaveStatus('error')
        showToast('Failed to reset settings', 'error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    }
  }

  const handleDeleteAccount = () => {
    if (confirmAction === 'DELETE') {
      console.log('Deleting account...')
      // In real app, delete account
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.general.language}
              onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.general.currency}
              onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'light', name: 'Light', icon: Sun },
              { value: 'dark', name: 'Dark', icon: Moon },
              { value: 'auto', name: 'Auto', icon: Smartphone }
            ].map(theme => (
              <button
                key={theme.value}
                onClick={() => handleSettingChange('general', 'theme', theme.value)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  settings.general.theme === theme.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <theme.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="text-sm font-medium text-gray-900">{theme.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Privacy</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public - Anyone can see your profile</option>
              <option value="members">Members Only - Only Panda Mart members</option>
              <option value="private">Private - Only you can see your profile</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-900 font-medium">Show Email Address</span>
                <p className="text-sm text-gray-500">Allow others to see your email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showEmail}
                  onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-900 font-medium">Show Phone Number</span>
                <p className="text-sm text-gray-500">Allow others to see your phone</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showPhone}
                  onChange={(e) => handleSettingChange('privacy', 'showPhone', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Usage</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">Marketing Communications</span>
              <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.allowMarketing}
                onChange={(e) => handleSettingChange('privacy', 'allowMarketing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">Analytics & Performance</span>
              <p className="text-sm text-gray-500">Help us improve by sharing usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.allowAnalytics}
                onChange={(e) => handleSettingChange('privacy', 'allowAnalytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">Cookies</span>
              <p className="text-sm text-gray-500">Allow cookies for better experience</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.allowCookies}
                onChange={(e) => handleSettingChange('privacy', 'allowCookies', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">Automatic Backup</span>
              <p className="text-sm text-gray-500">Automatically backup your data weekly</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.data.autoBackup}
                onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period</label>
            <select
              value={settings.data.dataRetention}
              onChange={(e) => handleSettingChange('data', 'dataRetention', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={90}>3 months</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={730}>2 years</option>
              <option value={-1}>Forever</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">How long to keep your inactive data</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select
              value={settings.data.exportFormat}
              onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Your Data</h3>
        <p className="text-gray-600 mb-4">Download a copy of all your data including orders, preferences, and activity.</p>
        
        <button
          onClick={handleExportData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>
    </div>
  )

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Experience</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">Accessibility Mode</span>
              <p className="text-sm text-gray-500">Enhanced accessibility features for better usability</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.advanced?.accessibilityMode || false}
                onChange={(e) => handleSettingChange('advanced', 'accessibilityMode', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">Reduced Motion</span>
              <p className="text-sm text-gray-500">Minimize animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.advanced?.reducedMotion || false}
                onChange={(e) => handleSettingChange('advanced', 'reducedMotion', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">High Contrast</span>
              <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.advanced?.highContrast || false}
                onChange={(e) => handleSettingChange('advanced', 'highContrast', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium">Beta Features</span>
              <p className="text-sm text-gray-500">Access experimental features before release</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.advanced?.betaFeatures || false}
                onChange={(e) => handleSettingChange('advanced', 'betaFeatures', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowDangerZone(!showDangerZone)}
            className="flex items-center text-red-600 hover:text-red-800 font-medium"
          >
            {showDangerZone ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showDangerZone ? 'Hide' : 'Show'} Dangerous Actions
          </button>

          {showDangerZone && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-red-200"
            >
              <div>
                <h4 className="font-medium text-red-900 mb-2">Reset All Settings</h4>
                <p className="text-sm text-red-700 mb-3">This will reset all your preferences to default values.</p>
                <button 
                  onClick={handleResetSettings}
                  disabled={saveStatus === 'saving'}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    saveStatus === 'saving' 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {saveStatus === 'saving' ? 'Resetting...' : 'Reset Settings'}
                </button>
              </div>

              <div>
                <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                <p className="text-sm text-red-700 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Type 'DELETE' to confirm"
                    value={confirmAction}
                    onChange={(e) => setConfirmAction(e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={confirmAction !== 'DELETE'}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account preferences and privacy settings</p>
        </div>
        
        <button
          onClick={handleSaveSettings}
          disabled={saveStatus === 'saving'}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            saveStatus === 'saving' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : saveStatus === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : saveStatus === 'error'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : saveStatus === 'error' ? (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Error
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'privacy' && renderPrivacySettings()}
        {activeTab === 'notifications' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Info className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="font-semibold text-blue-900">Notification Settings</h3>
            </div>
            <p className="text-blue-800 mb-4">
              Notification preferences are managed in the dedicated Notifications section.
            </p>
            <button
              onClick={() => {
                // Navigate to notifications section
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('navigate-to-section', { detail: 'notifications' })
                  window.dispatchEvent(event)
                }
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to Notifications
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="font-semibold text-green-900">Security Settings</h3>
            </div>
            <p className="text-green-800 mb-4">
              Security settings including 2FA and password management are available in the Security section.
            </p>
            <button
              onClick={() => {
                // Navigate to security section
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('navigate-to-section', { detail: 'security' })
                  window.dispatchEvent(event)
                }
              }}
              className="flex items-center text-green-600 hover:text-green-800 font-medium"
            >
              Go to Security
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
        {activeTab === 'data' && renderDataSettings()}
        {activeTab === 'advanced' && renderAdvancedSettings()}
      </motion.div>
    </div>
  )
}

export default SettingsSection