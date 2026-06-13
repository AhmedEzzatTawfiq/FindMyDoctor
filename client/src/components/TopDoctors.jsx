import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()

    return (
        <section className='py-20 px-4 md:px-10 bg-linear-to-b from-white to-slate-50'>
            {/* Section Header */}
            <div className='flex flex-col items-center gap-3 mb-12 text-center'>
                <span className='text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full'>
                    Our Experts
                </span>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
                    Top Doctors to <span className='text-primary'>Book</span>
                </h2>
                <p className='text-gray-500 max-w-md text-sm md:text-base'>
                    Browse through our extensive list of trusted, verified healthcare professionals.
                </p>
            </div>

            {/* Doctors Grid */}
            <div className='w-full grid grid-cols-auto gap-5 pt-2'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                        key={index}
                        className='group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-400 hover:-translate-y-2'
                    >
                        {/* Doctor Image */}
                        <div className='relative overflow-hidden bg-linear-to-br from-blue-50 to-indigo-100'>
                            <img
                                className='w-full object-cover group-hover:scale-105 transition-transform duration-500'
                                src={item.image}
                                alt={item.name}
                            />
                            {/* Availability Badge */}
                            <div className='absolute top-3 left-3'>
                                {item.available ? (
                                    <span className='flex items-center gap-1.5 text-xs font-semibold bg-white/90 backdrop-blur-sm text-green-600 px-2.5 py-1 rounded-full shadow-sm'>
                                        <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></span>
                                        Available
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-1.5 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-500 px-2.5 py-1 rounded-full shadow-sm'>
                                        Unavailable
                                    </span>
                                )}
                            </div>
                            {/* Hover overlay */}
                            <div className='absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                <span className='text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30'>
                                    Book Now →
                                </span>
                            </div>
                        </div>

                        {/* Doctor Info */}
                        <div className='p-4'>
                            <p className='text-gray-900 font-semibold text-base leading-snug'>{item.name}</p>
                            <p className='text-primary text-xs font-medium mt-0.5'>{item.speciality}</p>
                            <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
                                
                                <span className='text-xs text-gray-400 font-medium'>{item.experience || '5+ yrs'} Experience</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className='flex justify-center mt-14'>
                <button
                    onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                    className='group flex items-center gap-2 bg-primary text-white px-10 py-3.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300'
                >
                    View All Doctors
                
                </button>
            </div>
        </section>
    )
}

export default TopDoctors
