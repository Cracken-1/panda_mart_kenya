'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, Calendar, Users, Gift, Camera, Share2, Star, Clock, CheckCircle } from 'lucide-react'

const ChallengesSection = () => {
  const [activeTab, setActiveTab] = useState('active')

  const activeChallenges = [
    {
      id: 1,
      title: 'Home Makeover Master',
      description: 'Transform any room in your home using Panda Mart products and share your before/after photos',
      type: 'Photo Challenge',
      difficulty: 'Medium',
      points: 500,
      prize: 'KES 10,000 shopping voucher',
      participants: 234,
      deadline: '2024-02-28',
      progress: 60,
      requirements: ['Purchase furniture/decor items worth KES 15,000+', 'Share before/after photos', 'Use hashtag #PandaHomeMakeover'],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Unboxing Video Star',
      description: 'Create the most creative and engaging unboxing video of your Panda Mart electronics purchase',
      type: 'Video Challenge',
      difficulty: 'Easy',
      points: 300,
      prize: 'Latest smartphone + KES 5,000 voucher',
      participants: 89,
      deadline: '2024-02-15',
      progress: 0,
      requirements: ['Purchase electronics worth KES 10,000+', 'Create 60-second unboxing video', 'Post on TikTok/Instagram with #PandaUnboxing'],
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop',
      status: 'Not Started'
    },
    {
      id: 3,
      title: 'Eco-Friendly Living',
      description: 'Show how you use Panda Mart eco-friendly products to create a sustainable lifestyle',
      type: 'Lifestyle Challenge',
      difficulty: 'Hard',
      points: 750,
      prize: 'KES 15,000 eco-products bundle',
      participants: 156,
      deadline: '2024-03-15',
      progress: 25,
      requirements: ['Purchase eco-friendly products', 'Document 30-day sustainable living journey', 'Share weekly updates'],
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=200&fit=crop',
      status: 'In Progress'
    }
  ]

  const completedChallenges = [
    {
      id: 4,
      title: 'Kitchen Upgrade Challenge',
      description: 'Upgraded kitchen with new appliances and cookware',
      completedDate: '2024-01-20',
      pointsEarned: 400,
      prize: 'KES 5,000 voucher',
      rank: 3,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
    },
    {
      id: 5,
      title: 'Beauty Routine Makeover',
      description: 'Created new beauty routine with Panda Mart products',
      completedDate: '2024-01-10',
      pointsEarned: 250,
      prize: 'Beauty products bundle',
      rank: 7,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop'
    }
  ]

  const getDaysLeft = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const renderActiveChallenges = () => (
    <div className="space-y-6">
      {activeChallenges.map((challenge, index) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={challenge.image}
                alt={challenge.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-panda-black-900 mr-3">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{challenge.description}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participants} participants
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {getDaysLeft(challenge.deadline)} days left
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-panda-red-500">{challenge.points}</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-panda-red-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="font-semibold text-panda-black-900 mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {challenge.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <div className="w-1.5 h-1.5 bg-panda-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prize */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <Gift className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="font-semibold text-orange-700">Prize: {challenge.prize}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {challenge.status === 'Not Started' ? (
                  <button className="flex-1 bg-panda-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-panda-red-600 transition-colors">
                    Join Challenge
                  </button>
                ) : (
                  <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    Continue Challenge
                  </button>
                )}
                <button className="px-4 py-2 border-2 border-panda-red-500 text-panda-red-500 rounded-lg font-semibold hover:bg-panda-red-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderCompletedChallenges = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {completedChallenges.map((challenge, index) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card overflow-hidden"
        >
          <img
            src={challenge.image}
            alt={challenge.title}
            className="w-full h-32 object-cover"
          />
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-panda-black-900">{challenge.title}</h3>
              <div className="flex items-center text-yellow-500">
                <Trophy className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">#{challenge.rank}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold text-green-600">+{challenge.pointsEarned} points</div>
                <div className="text-gray-500">Completed {challenge.completedDate}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-panda-red-500">{challenge.prize}</div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-panda-red-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-panda-black-900">Panda Challenges</h2>
              <p className="text-gray-600">Complete challenges and win amazing prizes</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-panda-red-500">{activeChallenges.length}</div>
            <div className="text-sm text-gray-500">Active Challenges</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">{completedChallenges.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">
              {completedChallenges.reduce((sum, c) => sum + c.pointsEarned, 0)}
            </div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">
              {completedChallenges.filter(c => c.rank <= 3).length}
            </div>
            <div className="text-sm text-gray-600">Top 3 Finishes</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-panda-red-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Active ({activeChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-panda-red-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Completed ({completedChallenges.length})
          </button>
        </div>
      </div>

      {/* Challenge Content */}
      {activeTab === 'active' ? renderActiveChallenges() : renderCompletedChallenges()}

      {/* How Challenges Work */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">How Challenges Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-panda-red-500" />
            </div>
            <h4 className="font-semibold mb-2">Join Challenge</h4>
            <p className="text-sm text-gray-600">Choose a challenge that interests you and click join</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6 text-panda-red-500" />
            </div>
            <h4 className="font-semibold mb-2">Complete Tasks</h4>
            <p className="text-sm text-gray-600">Follow the requirements and complete all tasks</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-6 h-6 text-panda-red-500" />
            </div>
            <h4 className="font-semibold mb-2">Share & Submit</h4>
            <p className="text-sm text-gray-600">Share your results on social media and submit</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-panda-red-500" />
            </div>
            <h4 className="font-semibold mb-2">Win Prizes</h4>
            <p className="text-sm text-gray-600">Get points and compete for amazing prizes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengesSection