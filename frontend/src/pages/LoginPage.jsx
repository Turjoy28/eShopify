import React from 'react'
import { useState } from 'react'
import { Link } from "react-router-dom"
import { LogIn, Mail, Lock, ArrowRight, Loader, ShoppingBag, Sparkles } from 'lucide-react'
import {motion} from "framer-motion"
import { useUserStore } from '../stores/useUserStore'

const LoginPage = () => {
  const[email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const {login, loading} = useUserStore();

  const handleSubmit=(e)=>{
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8 -mt-16'>
      <div className='w-full max-w-[260px]'>
        <motion.div
          className='mb-3'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className='flex items-center justify-center gap-1.5 mb-2'>
            <div className='relative'>
              <ShoppingBag className='h-5 w-5 text-blue-400' strokeWidth={2.5} />
              <Sparkles className='h-2 w-2 text-cyan-400 absolute -top-0.5 -right-0.5' />
            </div>
            <span className='text-base font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 text-transparent bg-clip-text'>
              E-ShopCart
            </span>
          </div>
          <h2 className='text-center text-xs font-semibold text-gray-300'>Welcome back</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
        <div className='bg-gray-800/60 backdrop-blur-sm py-2.5 px-2.5 shadow-md shadow-blue-500/10 border border-blue-500/20 rounded'>
          <form onSubmit={handleSubmit} className='space-y-1.5'>
     

            <div>
              <label htmlFor='email' className='block text-[8px] font-medium text-gray-400 mb-0.5'>
                Email
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none'>
                  <Mail className='h-2 w-2 text-gray-500' aria-hidden='true' />
                </div>
                <input
                  id='email'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full px-1.5 py-0.5 pl-4 bg-gray-700/50 border border-gray-600/50
									rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500
									 focus:border-blue-500 text-[9px] transition-all'
                  placeholder='you@example.com'
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-[8px] font-medium text-gray-400 mb-0.5'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none'>
                  <Lock className='h-2 w-2 text-gray-500' aria-hidden='true' />
                </div>
                <input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='block w-full px-1.5 py-0.5 pl-4 bg-gray-700/50 border border-gray-600/50
									rounded placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-[9px] transition-all'
                  placeholder='••••••••'
                />
              </div>
            </div>

   

            <button
              type='submit'
              className='w-full flex justify-center py-0.5 px-2 border border-transparent mt-1
							rounded text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600
							 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className='mr-1 h-2.5 w-2.5 animate-spin' aria-hidden='true' />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className='mr-1 h-2.5 w-2.5' aria-hidden='true' />
                  Login
                </>
              )}
            </button>
          </form>

          <p className='mt-2 text-center text-[9px] text-gray-500'>
            Not a member?{" "}
            <Link to='/signup' className='font-medium text-blue-400 hover:text-cyan-400 transition-colors'>
              Signup <ArrowRight className='inline h-2 w-2' />
            </Link>
          </p>
        </div>
        </motion.div>
      </div>
    </div>
  );
  
}

export default LoginPage