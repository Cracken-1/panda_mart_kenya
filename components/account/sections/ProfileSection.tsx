'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, X, User, Mail, Phone, Calendar } from 'lucide-react'

interface UserProfile {
  id: string
  pandaId: string
  name: string
  email: string
  phone: string
  tier: string
  points: number
  joinDate: string
  totalOrders: number
  totalSpent: number
}

interface ProfileSectionProps {
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
}

const ProfileSection = ({ userProfile, setUserProfile }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone
  })

  const handleSave = () => {
    const updatedProfile = {
      ...userProfile,
      ...editData
    }
    setUserProfile(updatedProfile)
    localStorage.setItem('user-data', JSON.stringify(updatedProfile))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone
    })
    setIsEditing(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-panda-black-900">Profile Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 text-panda-red-500 hover:text-panda-red-600"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-panda-red-500 text-white px-4 py-2 rounded-lg hover:bg-panda-red-600"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-panda-red-500 to-panda-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-panda-black-900">{userProfile.name}</h3>
            <p className="text-gray-500">Panda ID: {userProfile.pandaId}</p>
            <button className="text-panda-red-500 hover:text-panda-red-600 text-sm mt-1">
              Change Profile Picture
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{userProfile.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{userProfile.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-lg">{userProfile.phone}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Member Since
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              {new Date(userProfile.joinDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-panda-black-900 mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-panda-red-500">{userProfile.points}</div>
              <div className="text-sm text-gray-600">Panda Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-panda-black-900">{userProfile.totalOrders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-panda-black-900">KES {userProfile.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{userProfile.tier}</div>
              <div className="text-sm text-gray-600">Member Tier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection