'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Calendar, Camera, Shield, Key, Trash2, Save, Settings } from 'lucide-react'

interface UserProfile {
  name: string
  pandaId: string
  email: string
  phone: string
  avatar: string
  joinDate: string
}

interface ProfileSettingsProps {
  userProfile: UserProfile
}

const ProfileSettings = ({ userProfile }: ProfileSettingsProps) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error'}>({message: '', visible: false, type: 'success'})
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    address: '123 Nairobi Street, Westlands',
    city: 'Nairobi',
    preferredStore: 'Panda Mart Garden City',
    language: 'English',
    currency: 'KES'
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    dataSharing: false,
    marketingEmails: true
  })

  // Load saved profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('panda_profile_data')
    const savedSecurity = localStorage.getItem('panda_security_settings')
    
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile)
        setFormData(prev => ({ ...prev, ...profileData }))
      } catch (error) {
        console.error('Error loading profile data:', error)
      }
    }
    
    if (savedSecurity) {
      try {
        setSecuritySettings(JSON.parse(savedSecurity))
      } catch (error) {
        console.error('Error loading security settings:', error)
      }
    }
  }, [])

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Name is required', 'error')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showToast('Valid email is required', 'error')
      return false
    }
    if (!formData.phone.trim()) {
      showToast('Phone number is required', 'error')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem('panda_profile_data', JSON.stringify(formData))
      
      setIsEditing(false)
      showToast('Profile updated successfully!', 'success')
    } catch (error) {
      showToast('Failed to update profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('All password fields are required', 'error')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      showToast('Password must be at least 8 characters long', 'error')
      return
    }
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      showToast('Password updated successfully!', 'success')
    } catch (error) {
      showToast('Failed to update password', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSecuritySettingChange = (key: string, value: boolean) => {
    const updatedSettings = { ...securitySettings, [key]: value }
    setSecuritySettings(updatedSettings)
    localStorage.setItem('panda_security_settings', JSON.stringify(updatedSettings))
    showToast(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`, 'success')
  }

  const handleDownloadData = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = {
        profile: formData,
        security: securitySettings,
        exportDate: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(userData, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `panda-mart-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
      
      showToast('Data exported successfully!', 'success')
    } catch (error) {
      showToast('Failed to export data', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showToast('Account deletion feature coming soon', 'error')
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-panda-red-500 text-white rounded-full flex items-center justify-center hover:bg-panda-red-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="font-semibold text-panda-black-900 mb-2">Change Profile Picture</h4>
            <p className="text-sm text-gray-600 mb-4">Upload a new photo to personalize your account</p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 transition-colors">
                Upload Photo
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-panda-black-900">Personal Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  isEditing ? 'border-gray-300 focus:ring-2 focus:ring-panda-red-500' : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  isEditing ? 'border-gray-300 focus:ring-2 focus:ring-panda-red-500' : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  isEditing ? 'border-gray-300 focus:ring-2 focus:ring-panda-red-500' : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  isEditing ? 'border-gray-300 focus:ring-2 focus:ring-panda-red-500' : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg ${
                isEditing ? 'border-gray-300 focus:ring-2 focus:ring-panda-red-500' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Store</label>
            <select
              value={formData.preferredStore}
              onChange={(e) => handleInputChange('preferredStore', e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg ${
                isEditing ? 'border-gray-300 focus:ring-2 focus:ring-panda-red-500' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <option value="Panda Mart Garden City">Panda Mart Garden City</option>
              <option value="Panda Mart Galleria">Panda Mart Galleria</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                isEditing ? 'border-gray-300 focus:ring-2 focus:ring-panda-red-500' : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Panda ID</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono">
              {userProfile.pandaId}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              {userProfile.joinDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">Password & Security</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500"
            />
          </div>
          <button 
            onClick={handlePasswordUpdate}
            disabled={isSaving}
            className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-panda-red-500 hover:bg-panda-red-600'
            } text-white`}
          >
            <Key className="w-4 h-4 mr-2" />
            {isSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          {[
            { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' },
            { key: 'loginNotifications', label: 'Login Notifications', description: 'Get notified when someone logs into your account' },
            { key: 'dataSharing', label: 'Data Sharing', description: 'Allow sharing of anonymized data for service improvement' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional emails and offers' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{setting.label}</div>
                <div className="text-sm text-gray-600">{setting.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings[setting.key as keyof typeof securitySettings]}
                  onChange={(e) => handleSecuritySettingChange(setting.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-panda-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-panda-red-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* App Preferences */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">App Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500"
            >
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500"
            >
              <option value="KES">Kenyan Shilling (KES)</option>
              <option value="USD">US Dollar (USD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <button 
            onClick={handleDownloadData}
            disabled={isSaving}
            className={`w-full text-left p-4 border border-gray-300 rounded-lg transition-colors ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{isSaving ? 'Downloading...' : 'Download My Data'}</div>
            <div className="text-sm text-gray-600">Get a copy of all your account data</div>
          </button>
          <button className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="font-medium">Privacy Settings</div>
            <div className="text-sm text-gray-600">Manage how your data is used</div>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200">
        <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </button>
          <p className="text-sm text-gray-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
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
      <div className="card p-6">
        <div className="flex items-center">
          <User className="w-8 h-8 text-panda-red-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-panda-black-900">Account Settings</h2>
            <p className="text-gray-600">Manage your profile and account preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mt-6">
          {[
            { id: 'profile', name: 'Profile', icon: User },
            { id: 'security', name: 'Security', icon: Shield },
            { id: 'preferences', name: 'Preferences', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-panda-red-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
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
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
      </motion.div>
    </div>
  )
}

export default ProfileSettings