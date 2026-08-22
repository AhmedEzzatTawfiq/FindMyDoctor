import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { BriefcaseMedical } from 'lucide-react'

const AdminLogin = () => {
    const [email, setEmail] = useState('admin')
    const [password, setPassword] = useState('admin1234')
    const [loading, setLoading] = useState(false)
    const formRef = useRef(null)

    const { setAToken, backendUrl } = useContext(AdminContext)

    const handleDemoLogin = () => {
        setEmail('demo@findmydoctor.com')
        setPassword('Demo1234!')

        setTimeout(() => formRef.current?.requestSubmit(), 50)
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setLoading(true)

        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/login',
                { email, password }
            )

            if (data.success) {
                localStorage.setItem('aToken', data.token)
                setAToken(data.token)
                toast.success(data.role === 'demo' ? 'Welcome! You are logged in as a Demo Account.' : 'Welcome, Admin!')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
            <form
                ref={formRef}
                onSubmit={onSubmitHandler}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">

                    {/* Header */}
                    <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-8 pt-8 pb-10 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BriefcaseMedical className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight">
                            FindMyDoctor
                        </h1>

                        <p className="text-indigo-200 text-sm mt-1">
                            Clinic Management Portal
                        </p>
                    </div>

                    {/* Form body */}
                    <div className="px-8 pt-6 pb-8 flex flex-col gap-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Username
                            </label>

                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 transition"
                                type="text"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>

                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 transition"
                                type="password"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}

                            {loading ? 'Logging in…' : 'Login as Admin'}
                        </button>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="w-full border border-indigo-200 text-indigo-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-all duration-200"
                        >
                             Try Demo Account
                        </button>

                        <p className="text-center text-xs text-gray-400">
                            No registration required
                        </p>

                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    © 2025 FindMyDoctor — Admin Portal
                </p>
            </form>
        </div>
    )
}

export default AdminLogin