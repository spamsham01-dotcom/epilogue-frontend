import { useState } from "react";
import API from "../config/api";
import { useAlert } from "../contexts/AlertContext";
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import '../fonts.css'

export default function Landing() {
  const [showModal, setShowModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const alert = useAlert(); // Add glass alert system
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const endpoint = isLogin 
        ? '/auth/login'
        : '/auth/signup'
      
      const payload = isLogin 
  ? { email: formData.email, password: formData.password }
  : { username: formData.name, email: formData.email, password: formData.password }
      
      const response = await API.post(endpoint, payload)
      
      // Store JWT token in localStorage
      localStorage.setItem('token', response.data.token)
      
      // Redirect to recommendations page
      navigate('/recommendations')
    } catch (error) {
      console.error('Authentication error:', error.response?.data || error.message)
      alert.error(`Authentication failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false)
    }
  }

  const switchToSignup = () => {
    setIsLogin(false)
    setFormData({ email: '', password: '', name: '' })
  }

  const switchToLogin = () => {
    setIsLogin(true)
    setFormData({ email: '', password: '', name: '' })
  }

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="page-shell relative min-h-screen bg-[#020617] flex flex-col px-4 py-10">
      {/* Background Depth Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.85),rgba(2,6,23,1))]"></div>
      
      {/* Subtle Edge Vignette */}
      <div className="pointer-events-none fixed inset-0 z-[9999] bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.35)_100%)]"></div>

      {/* Ambient Background Layers */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 -right-24 h-72 w-72 bg-gradient-to-br from-indigo-500/30 via-violet-500/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-10 h-80 w-80 bg-gradient-to-tr from-blue-700/30 via-slate-900/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 left-1/4 h-96 w-96 bg-gradient-to-tr from-violet-600/20 via-indigo-600/10 to-transparent blur-[100px] rounded-full opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 bg-gradient-to-br from-blue-600/20 via-slate-800/10 to-transparent blur-[100px] rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.12),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.8),_transparent_55%)] mix-blend-screen" />
      </div>

      {/* Decorative Reading Stickers */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="reading-sticker reading-sticker--bookmark top-16 left-6" />
        <div className="reading-sticker reading-sticker--openbook top-24 right-10" />
        <div className="reading-sticker reading-sticker--feather top-1/2 left-12" />
        <div className="reading-sticker reading-sticker--watch top-1/3 right-1/4" />
        <div className="reading-sticker reading-sticker--ticket bottom-16 left-1/3" />
        <div className="reading-sticker reading-sticker--note bottom-10 right-1/4" />
      </div>

      {/* Global Title – top-left on all pages */}
      <div className="app-title">
        <span className="font-lobster">Epilogue</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-16 flex flex-col gap-12">
        {/* Hero – text left, 3D book right */}
        <div className="hero-backdrop relative flex flex-col md:flex-row items-center md:items-center justify-between gap-12">
          
          {/* Volumetric Hero Spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(99,102,241,0.22)_0%,rgba(99,102,241,0.12)_40%,transparent_70%)] blur-[70px] pointer-events-none z-0"></div>

          {/* Hero copy */}
          <div className="text-center md:text-left max-w-xl relative z-10">
            <h2 className="hero-heading text-5xl md:text-6xl text-[#F8FAFC] mb-4 font-normal leading-tight">
              <span className="hero-subline-animated">
                Your reading journey, <span className="text-[#FACC15]">reimagined.</span>
              </span>
              
            </h2>
            <p className="text-xl md:text-2xl text-[#818CF8] mb-8 leading-relaxed">
              Join vibrant book clubs, track your reading progress, and discover your next favorite book with our AI-powered recommendations.
            </p>
          </div>

          {/* 3D Flipping Book - purely visual, positioned right */}
          <div className="w-full md:w-auto flex justify-center md:justify-end relative z-10">
            <div className="hero-book-scene">
              <div className="hero-book">
                <div className="hero-book-cover hero-book-cover--front" />
                <div className="hero-book-spine" />
                <div className="hero-book-cover hero-book-cover--back" />
                <div className="hero-book-pages">
                  <div className="hero-book-page hero-book-page--1" />
                  <div className="hero-book-page hero-book-page--2" />
                  <div className="hero-book-page hero-book-page--3" />
                </div>
                <div className="hero-book-glow" />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Button – centered below hero section (32px from subheading) */}
        <div className="flex justify-center mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="btn-jelly px-16 py-6 text-2xl font-bold uppercase tracking-wide"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              Step Into The Story
            </span>
          </button>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full z-10">
        {/* Card 1 */}
        <div className="glass-card rounded-2xl p-10 hover:border-[#818CF8]/60 transition-all duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="glass-pill w-10 h-10 flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] heading-etched">Join Communities</h3>
          </div>
          <p className="text-[#818CF8] text-lg leading-relaxed">
            Connect with readers who share your taste. Discuss plot twists and characters in real-time.
          </p>
        </div>
        
        {/* Card 2 */}
        <div className="glass-card rounded-2xl p-10 hover:border-[#818CF8]/60 transition-all duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="glass-pill w-10 h-10 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] heading-etched">AI Recommendations</h3>
          </div>
          <p className="text-[#818CF8] text-lg leading-relaxed">
            Turn your favorite movies and genres into your next great read with AI-powered recommendations.
          </p>
        </div>
        
        {/* Card 3 */}
        <div className="glass-card rounded-2xl p-10 hover:border-[#818CF8]/60 transition-all duration-300">
          <div className="mb-6 flex items-center gap-3">
            <div className="glass-pill w-10 h-10 flex items-center justify-center">
              <span className="text-lg">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] heading-etched">Track Progress</h3>
          </div>
          <p className="text-[#818CF8] text-lg leading-relaxed">
            Visualize your reading habits, set goals, and celebrate your literary milestones.
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 px-4">
          <div className="glass-shell rounded-3xl p-10 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="btn-jelly btn-jelly-secondary absolute top-4 right-4 w-10 h-10 flex items-center justify-center p-0 min-w-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title */}
            <h2 className="text-3xl font-bold text-[#F8FAFC] heading-etched mb-8 text-center">
              {isLogin ? 'Welcome Back' : 'Join the Club'}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full bg-[rgba(30,41,59,0.6)] text-[#F8FAFC] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#818CF8] placeholder-[#818CF8]/70 text-lg border border-[rgba(255,255,255,0.1)]"
                    required
                  />
                </div>
              )}
              
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full bg-[rgba(30,41,59,0.6)] text-[#F8FAFC] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#818CF8] placeholder-[#818CF8]/70 text-lg border border-[rgba(255,255,255,0.1)]"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full bg-[rgba(30,41,59,0.6)] text-[#F8FAFC] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#818CF8] placeholder-[#818CF8]/70 text-lg border border-[rgba(255,255,255,0.1)]"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-jelly w-full py-4 rounded-xl text-lg font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Loading...' : (isLogin ? 'Sign In →' : 'Create Account')}
              </button>
            </form>

            {/* Switch Auth Link */}
            <div className="mt-8 text-center">
              <p className="text-[#818CF8] text-lg">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={isLogin ? switchToSignup : switchToLogin}
                  className="btn-jelly px-6 py-2 text-sm font-bold"
                >
                  {isLogin ? 'SIGN UP' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    )}
    </>
  )
}
