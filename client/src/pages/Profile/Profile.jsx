import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from "axios"
import { toast } from "react-hot-toast"
import ProfileSidebar from '../../components/ui/ProfileSidebar'
import ProfileContactInfo from '../../components/ui/ProfileContactInfo'
import ProfileBasicInfo from '../../components/ui/ProfileBasicInfo'

const Profile = () => {
  const { userData, setUserData, token, backendUrl, getUserData } = useContext(AppContext)

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

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

      if (data.success) {
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

        <div className='h-36 bg-linear-to-r from-primary via-[#7c8aff] to-primary relative'>
          <div className='absolute top-4 right-6 text-white/10 font-black text-5xl select-none tracking-widest'>
            PATIENT
          </div>
        </div>

        <div className='relative px-6 pb-8 -mt-16 sm:px-10 flex flex-col md:flex-row gap-8'>
          <ProfileSidebar
            userData={userData}
            setUserData={setUserData}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            image={image}
            setImage={setImage}
            updateUserData={updateUserData}
            getUserData={getUserData}
          />

          <div className='flex-1 flex flex-col gap-8 md:pt-4'>
            <ProfileContactInfo userData={userData} setUserData={setUserData} isEdit={isEdit} />
            <ProfileBasicInfo userData={userData} setUserData={setUserData} isEdit={isEdit} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile
