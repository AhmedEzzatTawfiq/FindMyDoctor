import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { MapPin, Phone, Mail, Check, Send } from 'lucide-react'

const Contact = () => {

    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        setFormData({ name: '', email: '', message: '' })
    }

    const contactDetails = [
        {
            icon: <MapPin className='w-5 h-5' />,
            label: 'Our Office',
            value: '00000 Willms Station, Suite 000, Washington, USA',
        },
        {
            icon: <Phone className='w-5 h-5' />,
            label: 'Phone',
            value: '+20 01202770788',
        },
    ]

    return (
        <div className='px-4 md:px-10'>

            {/* Page Header*/}
            <div className='text-center pt-14 pb-4'>
                <span className='text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full'>
                    Get In Touch
                </span>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mt-4'>
                    Contact <span className='text-primary'>Us</span>
                </h1>
                <div className='w-12 h-1 bg-primary rounded-full mx-auto mt-3'></div>
                <p className='text-gray-500 max-w-md mx-auto mt-4 text-sm md:text-base'>
                    Have a question or need assistance? We'd love to hear from you. Reach out and our team will respond shortly.
                </p>
            </div>

            <div className='my-14 flex flex-col lg:flex-row gap-12 mb-28'>

                <div className='flex flex-col gap-8 lg:w-5/12'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-linear-to-br from-primary/20 to-indigo-200/40 rounded-3xl translate-x-3 translate-y-3'></div>
                        <img
                            className='relative w-full rounded-3xl object-cover shadow-lg'
                            src={assets.contact_image}
                            alt='Contact Us'
                        />
                    </div>


                    <div className='flex flex-col gap-4'>
                        {contactDetails.map((item, i) => (
                            <div key={i} className='flex items-start gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300'>
                                <div className='w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0'>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>{item.label}</p>
                                    <p className='text-gray-700 text-sm mt-0.5 font-medium'>{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>

                <div className='lg:flex-1'>
                    <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 h-full'>
                        <h2 className='text-xl font-bold text-gray-900 mb-2'>Send us a message</h2>
                        <p className='text-gray-500 text-sm mb-8'>Fill out the form below and we'll get back to you within 24 hours.</p>

                        {submitted && (
                            <div className='bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 mb-6 flex items-center gap-2 text-sm font-medium'>
                                <Check className='w-4 h-4' />
                                Message sent! We'll get back to you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                            {/* Name */}
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-sm font-semibold text-gray-700'>Full Name</label>
                                <input
                                    type='text'
                                    placeholder='John Doe'
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                                />
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <label className='text-sm font-semibold text-gray-700'>Email Address</label>
                                <input
                                    type='email'
                                    placeholder='you@example.com'
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                                />
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <label className='text-sm font-semibold text-gray-700'>Message</label>
                                <textarea
                                    rows={5}
                                    placeholder='How can we help you?'
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none'
                                />
                            </div>

                            <button
                                type='submit'
                                className='group bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 mt-2'
                            >
                                Send Message
                                <Send className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                            </button>
                        </form>

                        <div className='flex items-center gap-4 mt-8 pt-6 border-t border-gray-100'>
                            <p className='text-xs text-gray-400 font-medium'>Also reach us on:</p>
                            {['Twitter', 'LinkedIn', 'Facebook'].map(s => (
                                <span key={s} className='text-xs text-primary font-semibold cursor-pointer hover:underline'>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
