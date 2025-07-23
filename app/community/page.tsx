'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Camera, Trophy, Users, Flame, Star } from 'lucide-react'

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('hauls')

  const tabs = [
    { id: 'hauls', name: 'Panda Hauls', icon: Camera },
    { id: 'diy', name: 'DIY & Inspiration', icon: Star },
    { id: 'challenges', name: 'Panda Challenges', icon: Trophy },
    { id: 'spotlight', name: 'Customer Spotlight', icon: Users }
  ]

  const hauls = [
    {
      id: 1,
      user: "Sarah K.",
      location: "Nairobi",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      caption: "Just transformed my living room with these amazing finds from Panda Mart! The sofa is so comfortable and the price was unbeatable! 🛋️✨",
      likes: 234,
      comments: 45,
      shares: 12,
      hashtags: ["#PandaMartKenyaFinds", "#HomeDecor", "#LivingRoomGoals"],
      platform: "Instagram"
    },
    {
      id: 2,
      user: "Mike O.",
      location: "Mombasa",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      caption: "New TV setup is complete! Thanks Panda Mart for the amazing deal on this smart TV. Movie nights just got better! 📺🍿",
      likes: 189,
      comments: 32,
      shares: 8,
      hashtags: ["#PandaMartDeals", "#SmartTV", "#MovieNight"],
      platform: "TikTok"
    },
    {
      id: 3,
      user: "Grace M.",
      location: "Kisumu",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      caption: "Kitchen makeover complete! These appliances from Panda Mart have made cooking so much easier. Quality products at great prices! 👩‍🍳",
      likes: 156,
      comments: 28,
      shares: 15,
      hashtags: ["#KitchenMakeover", "#PandaMartFinds", "#CookingLife"],
      platform: "Facebook"
    }
  ]

  const diyProjects = [
    {
      id: 1,
      title: "DIY Storage Solutions",
      author: "Emma T.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Creative ways to organize your home using Panda Mart storage baskets and containers",
      likes: 312,
      difficulty: "Easy",
      time: "2 hours",
      materials: ["Storage baskets", "Labels", "Fabric"]
    },
    {
      id: 2,
      title: "Bedroom Makeover on a Budget",
      author: "David L.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      description: "Transform your bedroom with affordable decor items and smart furniture placement",
      likes: 278,
      difficulty: "Medium",
      time: "1 day",
      materials: ["Bedding set", "Wall decor", "Lighting"]
    },
    {
      id: 3,
      title: "Garden Furniture Upcycle",
      author: "Rose W.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      description: "Give new life to old furniture with paint and creativity",
      likes: 195,
      difficulty: "Hard",
      time: "Weekend",
      materials: ["Paint", "Brushes", "Sandpaper"]
    }
  ]

  const challenges = [
    {
      id: 1,
      title: "Home Makeover Challenge",
      description: "Transform any room in your home using Panda Mart products",
      participants: 156,
      prize: "KES 50,000 shopping voucher",
      deadline: "Dec 31, 2024",
      status: "Active",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Unboxing Video Contest",
      description: "Create the most creative unboxing video of your Panda Mart purchase",
      participants: 89,
      prize: "Latest smartphone + accessories",
      deadline: "Jan 15, 2025",
      status: "Active",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "DIY Innovation Challenge",
      description: "Show us your most innovative DIY project using our products",
      participants: 234,
      prize: "KES 25,000 + Feature on our social media",
      deadline: "Completed",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
    }
  ]

  const spotlights = [
    {
      id: 1,
      name: "Jennifer Wanjiku",
      location: "Nairobi",
      story: "Jennifer transformed her small apartment into a cozy home using creative storage solutions and beautiful decor from Panda Mart. Her journey inspired many in our community!",
      image: "https://images.unsplash.com/photo-1494790108755-2616c9c0b8d3?w=300&h=300&fit=crop",
      achievement: "Home Transformation Expert",
      socialHandle: "@jen_homedesign"
    },
    {
      id: 2,
      name: "Peter Kimani",
      location: "Mombasa",
      story: "A tech enthusiast who created the ultimate smart home setup using Panda Mart electronics. His reviews help thousands make informed purchasing decisions.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      achievement: "Tech Reviewer of the Month",
      socialHandle: "@peter_tech_ke"
    },
    {
      id: 3,
      name: "Mary Achieng",
      location: "Kisumu",
      story: "A cooking enthusiast who shares amazing recipes and kitchen tips. Her kitchen makeover with Panda Mart appliances inspired many home cooks.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      achievement: "Community Chef",
      socialHandle: "@mary_cooks_ke"
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'hauls':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hauls.map((haul, index) => (
              <motion.div
                key={haul.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={haul.image}
                    alt="User haul"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-panda-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {haul.platform}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-panda-red-500 to-panda-black-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {haul.user.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-sm">{haul.user}</div>
                      <div className="text-xs text-gray-500">{haul.location}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {haul.caption}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {haul.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-panda-red-500 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {haul.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {haul.comments}
                      </div>
                      <div className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        {haul.shares}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case 'diy':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diyProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">By {project.author}</p>
                  <p className="text-gray-700 text-sm mb-4">{project.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className={`px-2 py-1 rounded ${
                      project.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      project.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {project.difficulty}
                    </span>
                    <span>{project.time}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Heart className="w-4 h-4 mr-1" />
                      {project.likes}
                    </div>
                    <button className="text-panda-red-500 text-sm font-semibold">
                      View Tutorial
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case 'challenges':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xl">{challenge.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      challenge.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {challenge.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{challenge.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-semibold">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Prize:</span>
                      <span className="font-semibold text-panda-red-500">{challenge.prize}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-semibold">{challenge.deadline}</span>
                    </div>
                  </div>
                  
                  <button className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    challenge.status === 'Active'
                      ? 'bg-panda-red-500 hover:bg-panda-red-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}>
                    {challenge.status === 'Active' ? 'Join Challenge' : 'Challenge Ended'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case 'spotlight':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotlights.map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="p-6">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  
                  <h3 className="font-bold text-lg mb-1">{person.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{person.location}</p>
                  
                  <div className="bg-panda-red-100 text-panda-red-700 px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block">
                    {person.achievement}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">{person.story}</p>
                  
                  <div className="text-panda-red-500 text-sm font-semibold">
                    {person.socialHandle}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Panda <span className="text-yellow-300">Community</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Shop, Share, Inspire! Join our vibrant community of Panda Mart enthusiasts
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-white/80">Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1.2K</div>
                <div className="text-white/80">Posts This Month</div>
              </div>
              <div>
                <div className="text-3xl font-bold">25</div>
                <div className="text-white/80">Active Challenges</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-panda-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-panda-black-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Share your Panda Mart finds, get inspired by others, and participate in exciting challenges!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Share Your Find
              </button>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-panda-black-900">
                Follow Us on Social Media
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CommunityPage