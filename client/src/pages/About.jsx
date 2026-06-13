import React from 'react'
import { assets } from '../assets/assets'
import { Zap, Hospital, Sparkles, Target } from 'lucide-react'

const About = () => {

    const values = [
        {
            icon: <Zap className='w-7 h-7 text-white' />,
            title: 'EFFICIENCY',
            desc: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
            gradient: 'from-blue-500 to-indigo-600',
        },
        {
            icon: <Hospital className='w-7 h-7 text-white' />,
            title: 'CONVENIENCE',
            desc: 'Access to a network of trusted healthcare professionals in your area.',
            gradient: 'from-indigo-500 to-purple-600',
        },
        {
            icon: <Sparkles className='w-7 h-7 text-white' />,
            title: 'PERSONALIZATION',
            desc: 'Tailored recommendations and reminders to help you stay on top of your health.',
            gradient: 'from-purple-500 to-pink-600',
        },
    ]

    const teamStats = [
        { value: '100+', label: 'Certified Doctors' },
        { value: '10K+', label: 'Patients Served' },
        { value: '6+', label: 'Specialities' },
        { value: '24/7', label: 'Support' },
    ]

    return (
        <div className='px-4 md:px-10'>

            {/* ── Page Header ── */}
            <div className='text-center pt-14 pb-4'>
                <span className='text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full'>
                    Who We Are
                </span>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mt-4'>
                    About <span className='text-primary'>Us</span>
                </h1>
                <div className='w-12 h-1 bg-primary rounded-full mx-auto mt-3'></div>
            </div>

            {/* ── Story Section ── */}
            <div className='my-14 flex flex-col md:flex-row items-center gap-12'>
                {/* Image */}
                <div className='relative w-full md:max-w-sm lg:max-w-md shrink-0'>
                    <div className='absolute inset-0 bg-linear-to-br from-primary/20 to-indigo-200/40 rounded-3xl translate-x-4 translate-y-4'></div>
                    <img
                        className='relative w-full rounded-3xl object-cover shadow-xl'
                        src={assets.about_image}
                        alt='About FindMyDoctor'
                    />
                    {/* Floating card */}
                    <div className='absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3 border border-gray-100'>
                        <div className='w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center'>
                            <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                            </svg>
                        </div>
                        <div>
                            <p className='text-xs text-gray-500'>Verified Appointments</p>
                            <p className='font-bold text-gray-800 text-sm'>10,000+ Booked</p>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className='flex flex-col gap-6 md:flex-1'>
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-900 leading-snug'>
                        Your trusted partner in managing<br className='hidden md:block' />
                        <span className='text-primary'> your healthcare needs</span>
                    </h2>
                    <p className='text-gray-500 text-sm md:text-base leading-relaxed'>
                        Welcome to <strong className='text-gray-700'>FindMyDoctor</strong> — your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
                    </p>
                    <p className='text-gray-500 text-sm md:text-base leading-relaxed'>
                        We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, FindMyDoctor is here to support you every step of the way.
                    </p>

                    {/* Vision Block */}
                    <div className='bg-linear-to-r from-primary/5 to-indigo-50 border-l-4 border-primary rounded-r-xl px-5 py-4'>
                        <p className='font-bold text-gray-800 mb-1 flex items-center gap-2'><Target className='w-5 h-5 text-primary' /> Our Vision</p>
                        <p className='text-gray-500 text-sm leading-relaxed'>
                            To create a seamless healthcare experience for every user — bridging the gap between patients and healthcare providers so that getting the care you need is simple, fast, and reliable.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Stats Strip ── */}
            <div className='bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-800 rounded-3xl px-8 py-10 mb-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative overflow-hidden'>
                <div className='absolute inset-0 bg-white/5 rounded-3xl pointer-events-none' />
                {teamStats.map((s, i) => (
                    <div key={i} className='flex flex-col items-center gap-1 relative z-10'>
                        <span className='text-3xl md:text-4xl font-extrabold text-white'>{s.value}</span>
                        <span className='text-xs md:text-sm text-indigo-200 font-medium'>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Why Choose Us ── */}
            <div className='mb-24'>
                <div className='text-center mb-10'>
                    <span className='text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full'>
                        Our Promise
                    </span>
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mt-4'>
                        Why <span className='text-primary'>Choose Us?</span>
                    </h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {values.map((v, i) => (
                        <div
                            key={i}
                            className='group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 overflow-hidden cursor-default'
                        >
                            {/* Background gradient on hover */}
                            <div className={`absolute inset-0 bg-linear-to-br ${v.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl`} />

                            <div className='relative z-10 flex flex-col gap-4'>
                                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${v.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    {v.icon}
                                </div>
                                <h3 className='text-base font-bold text-gray-800 tracking-wide group-hover:text-white transition-colors duration-300'>
                                    {v.title}
                                </h3>
                                <p className='text-sm text-gray-500 leading-relaxed group-hover:text-white/80 transition-colors duration-300'>
                                    {v.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default About
