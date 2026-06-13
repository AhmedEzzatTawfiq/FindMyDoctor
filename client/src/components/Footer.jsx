import React from 'react'
import { NavLink } from 'react-router-dom'
import { BriefcaseMedical } from 'lucide-react'

const Footer = () => {

    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'All Doctors', to: '/doctors' },
        { label: 'About Us', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
    ]

    const socialLinks = [
        {
            name: 'Twitter',
            icon: (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                </svg>
            ),
        },
        {
            name: 'LinkedIn',
            icon: (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
            ),
        },
        {
            name: 'Facebook',
            icon: (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
            ),
        },
    ]

    return (
        <footer className='bg-linear-to-b from-white to-slate-50 border-t border-gray-100 mt-16'>
            <div className='max-w-7xl mx-auto px-6 md:px-10 py-14'>

                {/* Top Row */}
                <div className='flex flex-col sm:grid grid-cols-[2.5fr_1fr_1fr] gap-12 mb-12'>

                    {/* Brand */}
                    <div className='flex flex-col gap-4'>
                        <div className="flex items-center gap-3 select-none">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                                <BriefcaseMedical className='text-white' size={18} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                                FindMyDoctor
                            </h2>
                        </div>
                        <p className='text-gray-500 text-sm leading-relaxed max-w-sm'>
                            Your trusted partner in managing your healthcare needs — browse doctors, book appointments, and take charge of your health.
                        </p>
                        {/* Social Icons */}
                        <div className='flex items-center gap-3 mt-2'>
                            {socialLinks.map(s => (
                                <button key={s.name} title={s.name} className='w-8 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center'>
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className='text-sm font-bold text-gray-800 uppercase tracking-wider mb-5'>Company</p>
                        <ul className='flex flex-col gap-2.5'>
                            {quickLinks.map(link => (
                                <li key={link.label}>
                                    <NavLink
                                        to={link.to}
                                        onClick={() => scrollTo(0, 0)}
                                        className='text-sm text-gray-500 hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group'
                                    >
                                        <span className='w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 rounded-full'></span>
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <p className='text-sm font-bold text-gray-800 uppercase tracking-wider mb-5'>Get In Touch</p>
                        <ul className='flex flex-col gap-3'>
                            <li className='flex items-start gap-2 text-sm text-gray-500'>
                                <svg className='w-4 h-4 text-primary mt-0.5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                </svg>
                                +20 01202770788
                            </li>
                            <li className='flex items-start gap-2 text-sm text-gray-500'>
                                <svg className='w-4 h-4 text-primary mt-0.5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                                findmydoctor@gmail.com
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Divider & Bottom Row */}
                <div className='border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3'>
                    <p className='text-xs text-gray-400 text-center'>
                        © 2026 findmydoctor.com — All Rights Reserved.
                    </p>
                    <div className='flex items-center gap-4'>
                        <span className='text-xs text-gray-400 cursor-pointer hover:text-primary transition-colors'>Privacy Policy</span>
                        <span className='text-gray-200'>|</span>
                        <span className='text-xs text-gray-400 cursor-pointer hover:text-primary transition-colors'>Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
