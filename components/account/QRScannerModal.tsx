'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, QrCode, Camera, Flashlight, RotateCcw, CheckCircle } from 'lucide-react'

interface QRScannerModalProps {
  onClose: () => void
  onScan: (data: string) => void
}

const QRScannerModal = ({ onClose, onScan }: QRScannerModalProps) => {
  const [isScanning, setIsScanning] = useState(true)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  const handleScan = (mockData: string) => {
    setScanResult(mockData)
    setIsScanning(false)
    setTimeout(() => {
      onScan(mockData)
      onClose()
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
        >
          <X className="w-6 h-6 text-white" />
        </motion.button>
        
        <h2 className="text-white font-semibold">Scan QR Code</h2>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setFlashEnabled(!flashEnabled)}
          className={`p-2 rounded-full backdrop-blur-sm ${
            flashEnabled ? 'bg-yellow-500/30' : 'bg-white/20'
          }`}
        >
          <Flashlight className={`w-6 h-6 ${flashEnabled ? 'text-yellow-300' : 'text-white'}`} />
        </motion.button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Mock Camera View */}
        <div className="w-full h-full bg-gray-900 relative overflow-hidden">
          {/* Animated scanning lines */}
          {isScanning && (
            <motion.div
              animate={{ y: [0, 400, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent z-10"
            />
          )}
          
          {/* Scanning Frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg" />
              
              {/* Success animation */}
              {scanResult && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg"
                >
                  <CheckCircle className="w-16 h-16 text-green-400" />
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Mock QR Code for demo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => handleScan('PANDA_STORE_WESTGATE_CHECKIN')}
          >
            <QrCode className="w-24 h-24 text-black" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="text-center mb-4">
          <p className="text-white text-sm mb-2">
            {isScanning ? 'Position QR code within the frame' : 'QR Code Scanned!'}
          </p>
          {scanResult && (
            <p className="text-green-400 text-xs">
              {scanResult}
            </p>
          )}
        </div>
        
        <div className="flex justify-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <Camera className="w-6 h-6 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsScanning(true)
              setScanResult(null)
            }}
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </motion.button>
        </div>
        
        <p className="text-white/60 text-xs text-center mt-4">
          Tap the QR code above to simulate scanning
        </p>
      </div>
    </motion.div>
  )
}

export default QRScannerModal