import React from 'react'
import { Phone, MapPin, Lock } from 'lucide-react'

const ProfileContactInfo = ({ userData, setUserData, isEdit }) => {
  return (
    <div>
      <div className='flex items-center gap-2.5 pb-2 border-b border-gray-100 mb-4'>
        <Phone size={18} className='text-primary' />
        <h3 className='font-bold text-gray-800 text-base uppercase tracking-wider'>Contact Information</h3>
      </div>

      <div className='grid sm:grid-cols-2 gap-5'>
        {/* Phone */}
        <div className='bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50'>
          <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1'>Phone</span>
          {isEdit ? (
            <input
              className='w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
              type="text"
              value={userData.phone}
              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number"
            />
          ) : (
            <p className='text-gray-700 font-medium text-sm'>{userData.phone || 'Not Selected'}</p>
          )}
        </div>

        {/* Email (can not edit) */}
        <div className='bg-slate-50/50 border border-slate-100 rounded-2xl p-4 opacity-75'>
          <div className='flex items-center justify-between mb-1'>
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block'>Email Address</span>
            <Lock size={12} className='text-gray-400' />
          </div>
          <p className='text-gray-500 text-sm font-medium'>{userData.email}</p>
        </div>

        <div className='sm:col-span-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50'>
          <div className='flex items-center gap-1.5 mb-1'>
            <MapPin size={14} className='text-gray-400' />
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block'>Address</span>
          </div>
          {isEdit ? (
            <div className='flex flex-col gap-2 mt-1.5'>
              <input
                className='w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                value={userData.address?.line1 || ''}
                type="text"
                placeholder="Street Address Line 1"
              />
              <input
                className='w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                value={userData.address?.line2 || ''}
                type="text"
                placeholder="Street Address Line 2"
              />
            </div>
          ) : (
            <p className='text-gray-700 font-medium text-sm leading-relaxed'>
              {userData.address?.line1 ? (
                <>
                  {userData.address.line1}
                  {userData.address.line2 && <><br />{userData.address.line2}</>}
                </>
              ) : (
                'No address specified'
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileContactInfo
