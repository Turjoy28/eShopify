import React from 'react'
import { useState } from 'react'
import { Link } from "react-router-dom"
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import {motion} from "framer-motion"


const SignupPage = () => {
  const loading = true;
  const  [formData, setFormData]  = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
  }



  return (
    <div className='flex flex-col justify-center py-4 sm:px-6 lg:px-8'>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-xs'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='text-center text-lg font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 text-transparent bg-clip-text'>Create account</h2>
      </motion.div>

      <motion.div
        className='mt-3 sm:mx-auto sm:w-full sm:max-w-xs'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className='bg-gray-800/60 backdrop-blur-sm py-4 px-4 shadow-lg shadow-blue-500/10 border border-blue-500/20 rounded-md'>
          <form onSubmit={handleSubmit} className='space-y-2.5'>
            <div>
              <label htmlFor='name' className='block text-[10px] font-medium text-gray-400 mb-0.5'>
                Full name
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none'>
                  <User className='h-3 w-3 text-gray-500' aria-hidden='true' />
                </div>
                <input
                  id='name'
                  type='text'
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='block w-full px-2 py-1 pl-6 bg-gray-700/50 border border-gray-600/50 rounded
									 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition-all'
                  placeholder='John Doe'
                />
              </div>
            </div>

            <div>
              <label htmlFor='email' className='block text-[10px] font-medium text-gray-400 mb-0.5'>
                Email
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none'>
                  <Mail className='h-3 w-3 text-gray-500' aria-hidden='true' />
                </div>
                <input
                  id='email'
                  type='email'
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='block w-full px-2 py-1 pl-6 bg-gray-700/50 border border-gray-600/50
									rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500
									 focus:border-blue-500 text-xs transition-all'
                  placeholder='you@example.com'
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-[10px] font-medium text-gray-400 mb-0.5'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none'>
                  <Lock className='h-3 w-3 text-gray-500' aria-hidden='true' />
                </div>
                <input
                  id='password'
                  type='password'
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='block w-full px-2 py-1 pl-6 bg-gray-700/50 border border-gray-600/50
									rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition-all'
                  placeholder='••••••••'
                />
              </div>
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-[10px] font-medium text-gray-400 mb-0.5'>
                Confirm Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none'>
                  <Lock className='h-3 w-3 text-gray-500' aria-hidden='true' />
                </div>
                <input
                  id='confirmPassword'
                  type='password'
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className='block w-full px-2 py-1 pl-6 bg-gray-700/50 border
									 border-gray-600/50 rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition-all'
                  placeholder='••••••••'
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full flex justify-center py-1 px-3 border border-transparent mt-1
							rounded text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600
							 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className='mr-1.5 h-3 w-3 animate-spin' aria-hidden='true' />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className='mr-1.5 h-3 w-3' aria-hidden='true' />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className='mt-2.5 text-center text-[10px] text-gray-500'>
            Already have an account?{" "}
            <Link to='/login' className='font-medium text-blue-400 hover:text-cyan-400 transition-colors'>
              Login <ArrowRight className='inline h-2.5 w-2.5' />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};


export default SignupPage