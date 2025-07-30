'use client'

import { useState } from 'react'
import { Shield, Eye, EyeOff, Key, Smartphone, Lock, CheckCircle, AlertCircle } from 'lucide-react'

const SecuritySection = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginNotifications, setLoginNotifications] = useState(true)

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    // Simulate password change
    alert('Password changed successfully')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-panda-black-900 mb-6">Security & Privacy</h2>

      <div className="space-y-8">
        {/* Password Change */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Key className="w-5 h-5 text-panda-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-panda-black-900">Change Password</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
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
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
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
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handlePasswordChange}
              className="btn-primary"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 text-panda-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-panda-black-900">Two-Factor Authentication</h3>
            </div>
            <div className="flex items-center">
              <span className={`text-sm mr-3 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-panda-red-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          {twoFactorEnabled && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-800 text-sm">Two-factor authentication is active</span>
              </div>
            </div>
          )}
        </div>

        {/* Login Notifications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-panda-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-panda-black-900">Login Notifications</h3>
            </div>
            <button
              onClick={() => setLoginNotifications(!loginNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                loginNotifications ? 'bg-panda-red-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  loginNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            Get notified when someone logs into your account from a new device.
          </p>
        </div>

        {/* Security Status */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-panda-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-panda-black-900">Security Status</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-green-800">Strong password</span>
              </div>
              <span className="text-green-600 text-sm">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-green-800">Email verified</span>
              </div>
              <span className="text-green-600 text-sm">Verified</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                <span className="text-yellow-800">Phone verification</span>
              </div>
              <button className="text-panda-red-500 text-sm hover:text-panda-red-600">
                Verify Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySection