import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <section className='py-20 px-4' id='speciality'>
            {/* Section Header */}
            <div className='flex flex-col items-center gap-3 mb-12 text-center'>
                <span className='text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full'>
                    Browse Categories
                </span>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
                    Find by <span className='text-primary'>Speciality</span>
                </h2>
                <p className='text-gray-500 max-w-md text-sm md:text-base'>
                    Browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
                </p>
            </div>

            {/* Speciality Cards */}
            <div className='flex flex-wrap justify-center gap-5 md:gap-6'>
                {specialityData.map((item, index) => (
                    <Link
                        onClick={() => scrollTo(0, 0)}
                        key={index}
                        to={`/doctors/${item.speciality}`}
                        className='group flex flex-col items-center gap-3 cursor-pointer'
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <div className='relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 group-hover:from-primary group-hover:to-indigo-600 transition-all duration-300 overflow-hidden'>
                            <img
                                className='w-11 sm:w-14 transition-all duration-300'
                                src={item.image}
                                alt={item.speciality}
                            />
                        </div>
                        <p className='text-xs sm:text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300 text-center max-w-20'>
                            {item.speciality}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default SpecialityMenu
