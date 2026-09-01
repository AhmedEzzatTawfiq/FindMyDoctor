import React from 'react'

const ProfileSkeleton = () => {
  return (
    <div className='max-w-4xl mx-auto my-10 px-4 md:px-6 animate-pulse'>
      <div className='bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden'>

        {/* Header banner skeleton */}
        <div className='h-36 bg-slate-200 relative'>
          <div className='absolute top-4 right-6 h-8 w-32 bg-slate-300/50 rounded-lg' />
        </div>

        {/* Main Content Area */}
        <div className='relative px-6 pb-8 -mt-16 sm:px-10 flex flex-col md:flex-row gap-8'>
          
          {/* Sidebar Skeleton */}
          <div className='flex flex-col items-center text-center md:items-start md:text-left shrink-0 md:w-64'>
            {/* Avatar Circle */}
            <div className='w-32 h-32 rounded-full border-4 border-white shadow-lg bg-slate-300 mb-4' />
            {/* Name Skeleton */}
            <div className='h-7 w-40 bg-slate-200 rounded-xl mb-2' />
            {/* Email Skeleton */}
            <div className='h-4 w-48 bg-slate-200 rounded-lg mb-6' />
            {/* Button Skeleton */}
            <div className='w-full h-10 bg-slate-200 rounded-xl mt-auto border-t border-gray-100 pt-4' />
          </div>

          {/* Right Section Skeleton */}
          <div className='flex-1 flex flex-col gap-8 md:pt-4'>
            
            {/* Contact Info Skeleton */}
            <div>
              <div className='h-5 w-44 bg-slate-200 rounded-md mb-4' />
              <div className='grid sm:grid-cols-2 gap-5'>
                <div className='h-18 bg-slate-100 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between'>
                  <div className='h-3 w-16 bg-slate-200 rounded' />
                  <div className='h-4 w-28 bg-slate-200 rounded' />
                </div>
                <div className='h-18 bg-slate-100 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between'>
                  <div className='h-3 w-24 bg-slate-200 rounded' />
                  <div className='h-4 w-36 bg-slate-200 rounded' />
                </div>
                <div className='sm:col-span-2 h-24 bg-slate-100 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between'>
                  <div className='h-3 w-20 bg-slate-200 rounded' />
                  <div className='h-4 w-3/4 bg-slate-200 rounded' />
                  <div className='h-3 w-1/2 bg-slate-200 rounded' />
                </div>
              </div>
            </div>

            {/* Basic Info Skeleton */}
            <div>
              <div className='h-5 w-44 bg-slate-200 rounded-md mb-4' />
              <div className='grid sm:grid-cols-2 gap-5'>
                <div className='h-18 bg-slate-100 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between'>
                  <div className='h-3 w-16 bg-slate-200 rounded' />
                  <div className='h-4 w-20 bg-slate-200 rounded' />
                </div>
                <div className='h-18 bg-slate-100 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between'>
                  <div className='h-3 w-20 bg-slate-200 rounded' />
                  <div className='h-4 w-24 bg-slate-200 rounded' />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default ProfileSkeleton
