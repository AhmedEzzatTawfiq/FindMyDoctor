import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from "react-hot-toast"

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const { backendUrl, token, setToken } = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!backendUrl) {
      toast.error('Backend URL is not configured. Set VITE_BACKEND_URL in client/.env')
      return
    }

    if (state === 'Sign Up') {
      if (!name.trim()) {
        toast.error('Please enter your full name')
        return
      }
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters')
        return
      }
    }

    setLoading(true)
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', {
          name: name.trim(),
          email: email.trim(),
          password,
        })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', {
          email: email.trim(),
          password,
        })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Logged in successfully')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 w-full max-w-md flex flex-col gap-6 transition-all hover:shadow-2xl'>
        
        {/* Header */}
        <div className="text-center">
          <h2 className='text-3xl font-extrabold text-gray-900'>{state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-xs text-gray-400 mt-2 font-light">
            {state === 'Sign Up' ? 'Sign up to start booking your trusted doctors' : 'Log in to manage and view your medical bookings'}
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {state === 'Sign Up' && (
            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <input 
                className='border border-gray-200 rounded-2xl w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all font-medium' 
                type="text" 
                placeholder="Full name"
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                required 
              />
            </div>
          )}

          <div className='flex flex-col gap-1.5'>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
            <input 
              className='border border-gray-200 rounded-2xl w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all font-medium' 
              type="email" 
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              required 
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <input
              className='border border-gray-200 rounded-2xl w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all font-medium'
              type="password"
              placeholder="Enter strong password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              minLength={state === 'Sign Up' ? 8 : undefined}
              required
            />
            {state === 'Sign Up' && (
              <span className='text-[10px] text-gray-400 font-light mt-0.5'>Minimum 8 characters containing letters & numbers</span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <button 
          type='submit' 
          disabled={loading}
          className='bg-primary text-white w-full py-3.5 rounded-2xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50'
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {state === 'Sign Up' ? 'Create Account' : 'Log In'}
        </button>

        {/* Switch Link */}
        <div className="text-center text-xs text-gray-500 font-medium border-t pt-4">
          {state === 'Sign Up' ? (
            <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary font-bold cursor-pointer hover:underline'>Login here</span></p>
          ) : (
            <p>New to FindMyDoctor? <span onClick={() => setState('Sign Up')} className='text-primary font-bold cursor-pointer hover:underline'>Create account</span></p>
          )}
        </div>

      </div>
    </form>
  )
}

export default Login
