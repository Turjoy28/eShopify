import { useState } from 'react'
import { Link } from "react-router-dom"
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, ShoppingBag, Sparkles } from 'lucide-react'
import { motion } from "framer-motion"
import { useUserStore } from '../stores/useUserStore'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData)
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
      <div className='w-full max-w-md'>
        {/* Header with Logo */}
        <motion.div
          className='text-center mb-8'
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className='flex items-center justify-center gap-3 mb-4'
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className='relative'>
              <ShoppingBag className='h-10 w-10 text-blue-400' strokeWidth={2} />
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className='h-4 w-4 text-cyan-400 absolute -top-1 -right-1' />
              </motion.div>
            </div>
            <span className='text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 text-transparent bg-clip-text'>
              E-ShopCart
            </span>
          </motion.div>
          <h2 className='text-2xl font-semibold text-white mb-2'>Create your account</h2>
          <p className='text-gray-400'>Join us and start shopping today</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className='bg-gray-800/70 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/10 border border-blue-500/20 rounded-2xl'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor='name' className='block text-sm font-medium text-gray-300 mb-2'>
                  Full Name
                </label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <User className='h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors' />
                  </div>
                  <input
                    id='name'
                    type='text'
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='block w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl
                      placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:border-transparent transition-all duration-300 hover:border-gray-500'
                    placeholder='John Doe'
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-2'>
                  Email Address
                </label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors' />
                  </div>
                  <input
                    id='email'
                    type='email'
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='block w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl
                      placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:border-transparent transition-all duration-300 hover:border-gray-500'
                    placeholder='you@example.com'
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
                  Password
                </label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors' />
                  </div>
                  <input
                    id='password'
                    type='password'
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className='block w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl
                      placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:border-transparent transition-all duration-300 hover:border-gray-500'
                    placeholder='••••••••'
                  />
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300 mb-2'>
                  Confirm Password
                </label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors' />
                  </div>
                  <input
                    id='confirmPassword'
                    type='password'
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className='block w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl
                      placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:border-transparent transition-all duration-300 hover:border-gray-500'
                    placeholder='••••••••'
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  type='submit'
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className='w-full flex justify-center items-center gap-2 py-3.5 px-6 mt-2
                    rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600
                    hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25'
                >
                  {loading ? (
                    <>
                      <Loader className='h-5 w-5 animate-spin' />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className='h-5 w-5' />
                      Create Account
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.p
              className='mt-6 text-center text-sm text-gray-400'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Already have an account?{" "}
              <Link
                to='/login'
                className='font-semibold text-blue-400 hover:text-cyan-400 transition-colors duration-300 inline-flex items-center gap-1 group'
              >
                Sign in
                <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform duration-300' />
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage
