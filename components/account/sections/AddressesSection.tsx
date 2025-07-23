'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Plus, Edit3, Trash2, Home, Building, 
  Phone, User, Check, X, Star, Navigation
} from 'lucide-react'

const AddressesSection = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      label: 'Home',
      name: 'Sarah Wanjiku',
      phone: '+254 712 345 678',
      address: 'Apartment 4B, Riverside Drive',
      city: 'Nairobi',
      area: 'Westlands',
      postalCode: '00100',
      isDefault: true,
      instructions: 'Blue gate, ring the bell twice'
    },
    {
      id: 2,
      type: 'work',
      label: 'Office',
      name: 'Sarah Wanjiku',
      phone: '+254 712 345 678',
      address: 'ABC Plaza, 5th Floor, Suite 502',
      city: 'Nairobi',
      area: 'Upper Hill',
      postalCode: '00100',
      isDefault: false,
      instructions: 'Reception will collect the package'
    },
    {
      id: 3,
      type: 'other',
      label: "Mom's Place",
      name: 'Mary Wanjiku',
      phone: '+254 722 123 456',
      address: 'House No. 25, Kiambu Road',
      city: 'Kiambu',
      area: 'Kiambu Town',
      postalCode: '00900',
      isDefault: false,
      instructions: 'Call before delivery'
    }
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    area: '',
    postalCode: '',
    instructions: ''
  })

  const addressTypes = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'work', label: 'Work', icon: Building },
    { value: 'other', label: 'Other', icon: MapPin }
  ]

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.name && newAddress.address) {
      const address = {
        id: Date.now(),
        ...newAddress,
        isDefault: addresses.length === 0
      }
      setAddresses([...addresses, address])
      setNewAddress({
        type: 'home',
        label: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        area: '',
        postalCode: '',
        instructions: ''
      })
      setIsAddingNew(false)
    }
  }

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  const getAddressIcon = (type: string) => {
    const addressType = addressTypes.find(t => t.value === type)
    return addressType ? addressType.icon : MapPin
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
          <p className="text-gray-600">Manage your delivery locations</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </button>
      </div>

      {/* Add New Address Form */}
      {isAddingNew && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <select
                value={newAddress.type}
                onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {addressTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <input
                type="text"
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Home, Office, Mom's Place"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={newAddress.name}
                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Recipient's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+254 700 000 000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="House number, street name, apartment/building"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <input
                type="text"
                value={newAddress.area}
                onChange={(e) => setNewAddress({...newAddress, area: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Area/Neighborhood"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                value={newAddress.instructions}
                onChange={(e) => setNewAddress({...newAddress, instructions: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions for delivery..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Address
            </button>
          </div>
        </motion.div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address, index) => {
          const AddressIcon = getAddressIcon(address.type)
          return (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                address.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${address.isDefault ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <AddressIcon className={`w-5 h-5 ${address.isDefault ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{address.label}</h3>
                    {address.isDefault && (
                      <div className="flex items-center text-blue-600 text-sm">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Default Address
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingId(address.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{address.name}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{address.phone}</span>
                </div>
                
                <div className="flex items-start text-gray-700">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p>{address.address}</p>
                    <p>{address.area}, {address.city}</p>
                    {address.postalCode && <p>{address.postalCode}</p>}
                  </div>
                </div>

                {address.instructions && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-3">
                    <p className="text-sm text-gray-600">
                      <strong>Instructions:</strong> {address.instructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Set as Default
                  </button>
                )}
                <div className="flex items-center space-x-3">
                  <button className="flex items-center text-gray-600 hover:text-gray-700 text-sm">
                    <Navigation className="w-4 h-4 mr-1" />
                    View on Map
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-4">Add your first delivery address to get started</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Address
          </button>
        </div>
      )}
    </div>
  )
}

export default AddressesSection