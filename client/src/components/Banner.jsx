import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Hospital, Zap, Shield, ArrowRight } from 'lucide-react'

const Banner = () => {
    const navigate = useNavigate()

    const stats = [
        { value: '100+', label: 'Trusted Doctors' },
        { value: '10K+', label: 'Happy Patients' },
        { value: '50+', label: 'Specialities' },
    ]

    return (
        <section className='my-20 mx-4 md:mx-10'>
            <div className='relative bg-linear-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-3xl overflow-hidden px-8 md:px-16 py-14 md:py-20 shadow-2xl'>

                {/* Background decorative blobs */}
                <div className='absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none' />
                <div className='absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none' />
                <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none' />

                <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-10'>
                    {/* Left Content */}
                    <div className='flex flex-col gap-6 md:max-w-lg'>
                        <div className='flex items-center gap-2'>
                            <span className='inline-block w-8 h-0.5 bg-blue-300'></span>
                            <span className='text-xs font-semibold tracking-widest text-blue-200 uppercase'>Book Today</span>
                        </div>
                        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight'>
                            Book Appointment<br />
                            <span className='text-blue-200'>With 100+ Trusted Doctors</span>
                        </h2>
                        <p className='text-indigo-200 text-sm md:text-base font-light leading-relaxed'>
                            Your health is your greatest wealth. Don't delay — connect with a verified specialist and book your appointment in minutes.
                        </p>

                        {/* Stats Row */}
                        <div className='flex gap-8 mt-2'>
                            {stats.map((stat, i) => (
                                <div key={i} className='flex flex-col'>
                                    <span className='text-2xl font-bold text-white'>{stat.value}</span>
                                    <span className='text-xs text-indigo-200'>{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className='flex items-center gap-4 mt-2 flex-wrap'>
                            <button
                                onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                                className='bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-full border border-white/30 hover:text-scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2'
                            >
                                Browse Doctors
                                <ArrowRight className='w-4 h-4' />
                            </button>
                        </div>
                    </div>

                    {/* Right: Floating Feature Cards */}
                    <div className='hidden md:flex flex-col gap-4 w-72'>
                        {[
                            { icon: <Hospital className='w-6 h-6 text-blue-200' />, title: 'Wide Network', desc: 'Access 100+ verified doctors across all specialities' },
                            { icon: <Zap className='w-6 h-6 text-blue-200' />, title: 'Instant Booking', desc: 'Confirm your appointment in under 60 seconds' },
                            { icon: <Shield className='w-6 h-6 text-blue-200' />, title: 'Secure & Private', desc: 'Your health data is always safe with us' },
                        ].map((card, i) => (
                            <div key={i} className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-start gap-4 hover:bg-white/15 transition-all duration-300'>
                                {card.icon}
                                <div>
                                    <p className='text-white font-semibold text-sm'>{card.title}</p>
                                    <p className='text-indigo-200 text-xs mt-0.5'>{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
