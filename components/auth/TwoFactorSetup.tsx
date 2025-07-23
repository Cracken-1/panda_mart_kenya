'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Smartphone, Key, Copy, Check, AlertTriangle, CheckCircle } from 'lucide-react'
// import QRCode from 'qrcode' // Temporarily commented out

interface TwoFactorSetupProps {
  userEmail: string
  onSetupComplete: (backupCodes: string[]) => void
  onCancel: () => void
}

const TwoFactorSetup = ({ userEmail, onSetupComplete, onCancel }: TwoFactorSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedCodes, setCopiedCodes] = useState(false)

  // Generate 2FA secret and QR code
  const generateSecret = async () => {
    // Mock secret generation - in real app, this would come from server
    const mockSecret = 'JBSWY3DPEHPK3PXP'
    const issuer = 'Panda Mart Kenya'
    const label = `${issuer}:${userEmail}`
    const otpUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${mockSecret}&issuer=${encodeURIComponent(issuer)}`

    try {
      // Mock QR code generation for now
      // const qrUrl = await QRCode.toDataURL(otpUrl)
      const qrUrl = `data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="160" height="160" fill="black"/>
          <rect x="40" y="40" width="120" height="120" fill="white"/>
          <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code</text>
          <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="8" fill="black">Scan with</text>
          <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="8" fill="black">Authenticator</text>
        </svg>
      `)}`
      setQrCodeUrl(qrUrl)
      setSecret(mockSecret)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  // Generate backup codes
  const generateBackupCodes = () => {
    const codes = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    setBackupCodes(codes)
  }

  // Verify 2FA code
  const verifyCode = async () => {
    setIsVerifying(true)
    setError('')

    try {
      // Mock verification - in real app, this would verify with server
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        generateBackupCodes()
        setCurrentStep(3)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'secret' | 'codes') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'secret') {
        setCopiedSecret(true)
        setTimeout(() => setCopiedSecret(false), 2000)
      } else {
        setCopiedCodes(true)
        setTimeout(() => setCopiedCodes(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleComplete = () => {
    onSetupComplete(backupCodes)
  }

  // Initialize on mount
  useState(() => {
    generateSecret()
  })

  const steps = [
    { number: 1, title: 'Install App', description: 'Download an authenticator app' },
    { number: 2, title: 'Scan QR Code', description: 'Add your account to the app' },
    { number: 3, title: 'Verify Setup', description: 'Enter the verification code' },
    { number: 4, title: 'Save Backup Codes', description: 'Store your recovery codes' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-panda-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-panda-black-900 mb-2">
          Set Up Two-Factor Authentication
        </h2>
        <p className="text-gray-600">
          Add an extra layer of security to your Panda Mart account
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step.number
              ? 'bg-panda-red-500 text-white'
              : 'bg-gray-200 text-gray-500'
              }`}>
              {currentStep > step.number ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${currentStep > step.number ? 'bg-panda-red-500' : 'bg-gray-200'
                }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Install App */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8"
          >
            <h3 className="text-xl font-bold text-panda-black-900 mb-4">
              Step 1: Install an Authenticator App
            </h3>
            <p className="text-gray-600 mb-6">
              Download and install one of these authenticator apps on your smartphone:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { name: 'Google Authenticator', icon: '🔐', store: 'App Store / Play Store' },
                { name: 'Microsoft Authenticator', icon: '🛡️', store: 'App Store / Play Store' },
                { name: 'Authy', icon: '🔑', store: 'App Store / Play Store' }
              ].map((app) => (
                <div key={app.name} className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">{app.icon}</div>
                  <div className="font-semibold text-sm">{app.name}</div>
                  <div className="text-xs text-gray-500">{app.store}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-primary"
              >
                I've Installed an App
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Scan QR Code */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8"
          >
            <h3 className="text-xl font-bold text-panda-black-900 mb-4">
              Step 2: Scan QR Code
            </h3>
            <p className="text-gray-600 mb-6">
              Open your authenticator app and scan this QR code to add your Panda Mart account:
            </p>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 border border-gray-200 rounded-lg" />
                )}
              </div>

              {/* Manual Entry */}
              <div className="flex-1">
                <h4 className="font-semibold text-panda-black-900 mb-2">
                  Can't scan the QR code?
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Manually enter this secret key in your authenticator app:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="font-mono text-sm break-all">{secret}</code>
                    <button
                      onClick={() => copyToClipboard(secret, 'secret')}
                      className="ml-2 p-2 text-gray-500 hover:text-panda-red-500 transition-colors"
                    >
                      {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p><strong>Account:</strong> {userEmail}</p>
                  <p><strong>Issuer:</strong> Panda Mart Kenya</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-outline"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-primary"
              >
                I've Added the Account
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Verify Code */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8"
          >
            <h3 className="text-xl font-bold text-panda-black-900 mb-4">
              Step 3: Verify Setup
            </h3>
            <p className="text-gray-600 mb-6">
              Enter the 6-digit verification code from your authenticator app:
            </p>

            <div className="max-w-xs mx-auto mb-6">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full text-center text-2xl font-mono py-4 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-outline"
              >
                Back
              </button>
              <button
                onClick={verifyCode}
                disabled={verificationCode.length !== 6 || isVerifying}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Backup Codes */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8"
          >
            <h3 className="text-xl font-bold text-panda-black-900 mb-4">
              Step 4: Save Your Backup Codes
            </h3>
            <p className="text-gray-600 mb-6">
              Store these backup codes in a safe place. You can use them to access your account if you lose your phone:
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Recovery Codes</h4>
                <button
                  onClick={() => copyToClipboard(backupCodes.join('\n'), 'codes')}
                  className="flex items-center text-panda-red-500 hover:text-panda-red-600 transition-colors"
                >
                  {copiedCodes ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copiedCodes ? 'Copied!' : 'Copy All'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm bg-white p-2 rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Each backup code can only be used once</li>
                    <li>Store them in a secure location (password manager, safe, etc.)</li>
                    <li>Don't share these codes with anyone</li>
                    <li>You can generate new codes anytime from your account settings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={onCancel}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                className="btn-primary"
              >
                Complete Setup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TwoFactorSetup