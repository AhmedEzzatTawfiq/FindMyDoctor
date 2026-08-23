import React from 'react'
import { Search, Calendar, CheckCircle } from 'lucide-react'

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: <Search className='w-8 h-8 text-white' />,
            title: 'Search a Doctor',
            desc: 'Browse by speciality, location, or doctor name using our powerful search.',
            color: 'from-blue-500 to-indigo-600',
        },
        {
            number: '02',
            icon: <Calendar className='w-8 h-8 text-white' />,
            title: 'Choose a Slot',
            desc: 'Pick the date and time that fits your schedule from real-time availability.',
            color: 'from-indigo-500 to-purple-600',
        },
        {
            number: '03',
            icon: <CheckCircle className='w-8 h-8 text-white' />,
            title: 'Confirm & Done',
            desc: 'Get instant confirmation and reminders — it\'s that simple.',
            color: 'from-purple-500 to-pink-600',
        },
    ]

    return (
        <section className='py-20 px-4 md:px-10'>
            <div className='flex flex-col items-center gap-3 mb-12 text-center'>
                <span className='text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full'>
                    Simple Process
                </span>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
                    How It <span className='text-primary'>Works</span>
                </h2>
                <p className='text-gray-500 max-w-md text-sm md:text-base'>
                    Book your appointment in 3 simple steps — no paperwork, no waiting.
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 relative'>
                {/* Connector line (desktop only) */}
                <div className='hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-0.5 bg-linear-to-r from-blue-300 via-indigo-300 to-purple-300 z-0' />

                {steps.map((step, i) => (
                    <div key={i} className='group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 text-center z-10'>
                        {/* Step number badge */}
                        <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                            <span className={`text-xs font-extrabold text-white bg-linear-to-r ${step.color} px-3 py-1 rounded-full shadow-md`}>
                                {step.number}
                            </span>
                        </div>

                        {/* Icon */}
                        <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 mt-4`}>
                            {step.icon}
                        </div>

                        <h3 className='text-base font-bold text-gray-800 mb-2'>{step.title}</h3>
                        <p className='text-sm text-gray-500 leading-relaxed'>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default HowItWorks
