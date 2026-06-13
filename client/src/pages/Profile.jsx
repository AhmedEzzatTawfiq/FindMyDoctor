import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from "axios";
import { toast } from "react-hot-toast";
import { Camera, Mail, Phone, MapPin, User, Calendar, Edit2, Save, X, Lock } from 'lucide-react'

const Profile = () => {

  const {userData, setUserData, token, backendUrl, getUserData} = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserData = async () => {

    try {

      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('d_birth', userData.d_birth)
      image && formData.append('image', image)

      const {data} = await axios.post(backendUrl + '/api/user/update-profile', formData,  {headers: {token}})

      if(data.success) {
        toast.success(data.message)
        await getUserData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  return userData && (
    <div className='max-w-4xl mx-auto my-10 px-4 md:px-6'>
      <div className='bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden transition-all duration-300'>
        {/* Banner Background */}
        <div className='h-36 bg-linear-to-r from-primary via-[#7c8aff] to-primary relative'>
          {/* Subtle decoration */}
          <div className='absolute top-4 right-6 text-white/10 font-black text-5xl select-none tracking-widest'>
            PATIENT
          </div>
        </div>

        {/* Profile Content Container */}
        <div className='relative px-6 pb-8 -mt-16 sm:px-10 flex flex-col md:flex-row gap-8'>
          
          {/* Left Column: Avatar & Quick Info */}
          <div className='flex flex-col items-center text-center md:items-start md:text-left shrink-0 md:w-64'>
            {/* Avatar container */}
            <div className='relative w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden group mb-4'>
              {isEdit ? (
                <label htmlFor="image" className='cursor-pointer w-full h-full block relative'>
                  <img className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="Avatar" />
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white'>
                    <Camera size={20} />
                  </div>
                  <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden/>
                </label>
              ) : (
                <img className='w-full h-full object-cover' src={userData.image} alt="Avatar" />
              )}
            </div>

            {/* User Name & Email */}
            {isEdit ? (
              <input 
                className='w-full text-center md:text-left bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xl font-bold text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20' 
                type="text" 
                value={userData.name} 
                onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                placeholder="Full Name"
              />
            ) : (
              <h2 className='text-2xl font-extrabold text-gray-800 tracking-tight'>{userData.name}</h2>
            )}
            
            <p className='text-gray-400 text-sm mt-1.5 mb-6 flex items-center gap-1.5 justify-center md:justify-start'>
              <Mail size={14} className='text-gray-400' />
              {userData.email}
            </p>

            {/* Edit / Save Action Button Group */}
            <div className='w-full flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100'>
              {isEdit ? (
                <div className='flex gap-2 w-full'>
                  <button 
                    onClick={updateUserData}
                    className='flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-[#4d5ce6] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300'
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      getUserData(); // Revert local state to matches in database
                      setIsEdit(false);
                      setImage(false);
                    }}
                    className='flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold py-2.5 px-3.5 rounded-xl transition-all duration-200'
                    title="Cancel changes"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEdit(true)}
                  className='w-full flex items-center justify-center gap-2 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-xs'
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Grid Details sections */}
          <div className='flex-1 flex flex-col gap-8 md:pt-4'>
            
            {/* Contact Information Section */}
            <div>
              <div className='flex items-center gap-2.5 pb-2 border-b border-gray-100 mb-4'>
                <Phone size={18} className='text-primary' />
                <h3 className='font-bold text-gray-800 text-base uppercase tracking-wider'>Contact Information</h3>
              </div>

              <div className='grid sm:grid-cols-2 gap-5'>
                {/* Phone number */}
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

                {/* Email (Read-Only) */}
                <div className='bg-slate-50/50 border border-slate-100 rounded-2xl p-4 opacity-75'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block'>Email Address</span>
                    <Lock size={12} className='text-gray-400' />
                  </div>
                  <p className='text-gray-500 text-sm font-medium'>{userData.email}</p>
                </div>

                {/* Address (Span 2) */}
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

            {/* Basic Information Section */}
            <div>
              <div className='flex items-center gap-2.5 pb-2 border-b border-gray-100 mb-4'>
                <User size={18} className='text-primary' />
                <h3 className='font-bold text-gray-800 text-base uppercase tracking-wider'>Basic Information</h3>
              </div>

              <div className='grid sm:grid-cols-2 gap-5'>
                {/* Gender */}
                <div className='bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50'>
                  <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5'>Gender</span>
                  {isEdit ? (
                    <select 
                      className='w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20' 
                      onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
                      value={userData.gender}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not Selected">Not Selected</option>
                    </select>
                  ) : (
                    <p className='text-gray-700 font-medium text-sm'>{userData.gender || 'Not Selected'}</p>
                  )}
                </div>

                {/* Birthday */}
                <div className='bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50'>
                  <div className='flex items-center gap-1.5 mb-1.5'>
                    <Calendar size={14} className='text-gray-400' />
                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider block'>Birthday</span>
                  </div>
                  {isEdit ? (
                    <input 
                      className='w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20' 
                      type="date" 
                      onChange={(e) => setUserData(prev => ({ ...prev, d_birth: e.target.value }))} 
                      value={userData.d_birth || ''} 
                    />
                  ) : (
                    <p className='text-gray-700 font-medium text-sm'>{userData.d_birth || 'Not Selected'}</p>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile
