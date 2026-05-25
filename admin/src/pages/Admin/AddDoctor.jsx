import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
    const [image, setImage] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [speciality, setSpeciality] = useState('General phiscician');
    const [fees, setFees] = useState('');
    const [degree, setDegree] = useState('');
    const [about, setAbout] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    const { backendUrl, aToken } = useContext(AdminContext)

    const handleSubmit = async (e) => {
        e.preventDafault()

        try {
            if (!image) {
                return toast.error('Image not selected')
            }

            const formData = new FormData()
            formData.append("image", image)
            formData.append("name", name)
            formData.append("email", email)
            formData.append("password", password)
            formData.append("experience", experience)
            formData.append("speciality", speciality)
            formData.append("fees", fees)
            formData.append("degree", degree)
            formData.append("about", about)
            formData.append("address", JSON.stringify({ line1: address1, line2: address2 }))

            // Send doctor details to Database
            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {
                headers: { aToken }
            }
            )

            if (data.success) {
                toast.success(data.message)
                setImage(false)
                setName('')
                setEmail('')
                setPassword('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }



        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }





    return (

        <form onSubmit={handleSubmit} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>
            <div className='bg-white p-8 shadow-gray-100 shadow-sm rounded w-full max-w-2xl max-h-[110vh] overflow-y-scroll'>
                <div className='flex gap-4 items-center mb-5'>
                    <label className='cursor-pointer' htmlFor="doc-img">
                        <img onChange={handleImageChange} className='w-16' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => { setImage(e.target.files[0]) }} type="file" id='doc-img' className='cursor-pointer hidden' />
                    <p className='text-sm'>Upload doctor <br />picture</p>
                </div>
                <div className='flex flex-col gap-8 lg:flex-1 items-start'>

                    <div className='flex not-sm:w-full not-sm:flex-col gap-y-5 sm:flex sm:gap-17'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <p>Doctor Name</p>
                            <input required onChange={(e) => { setName(e.target.value) }} value={name} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="text" placeholder='Enter doctor name' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input required onChange={(e) => { setEmail(e.target.value) }} value={email} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="email" placeholder='Your email' />
                        </div>
                    </div>
                    <div className='flex not-sm:w-full not-sm:flex-col gap-y-5 sm:flex sm:gap-17'>
                        <div className='flex flex-col gap-1'>
                            <p>Password</p>
                            <input required onChange={(e) => { setPassword(e.target.value) }} value={password} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="password" placeholder='Password' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => { setSpeciality(e.target.value) }} value={speciality} name="" id="" className='outline-0 text-sm text-gray-500 border border-gray-400 pl-1 pr-18 py-2 placeholder:text-sm rounded'>
                                <option className='' value="">General physician</option>
                                <option value="">Gynecologist</option>
                                <option value="">Dermatologist</option>
                                <option value="">Pediatricians</option>
                                <option value="">Neurologist</option>
                                <option value="">Gastroenterologist</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex not-sm:w-full not-sm:flex-col gap-y-5 sm:flex sm:gap-17'>
                        <div className='flex flex-col gap-1'>
                            <p>Education</p>
                            <input required onChange={(e) => { setDegree(e.target.value) }} value={degree} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="text" placeholder='Education' />
                        </div>


                        <div className='flex not-sm:w-full flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => { setExperience(e.target.value) }} value={experience} name="" id="" className='outline-0 pl-1 pr-33 text-sm text-gray-500 border border-gray-400 px-1 py-2 placeholder:text-sm rounded'>
                                <option value="">1 Year</option>
                                <option value="">2 Years</option>
                                <option value="">3 Years</option>
                                <option value="">4 Years</option>
                                <option value="">5 Years</option>
                                <option value="">6 Years</option>
                                <option value="">7 Years</option>
                                <option value="">8 Years</option>
                                <option value="">9 Years</option>
                                <option value="">10 Years</option>
                            </select>
                        </div>
                    </div>


                    <div className='flex not-sm:w-full not-sm:flex-col gap-y-5 sm:flex sm:gap-17'>
                        <div className='flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => { setFees(e.target.value) }} value={fees} type="text" required placeholder='Your fees' className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => { setAddress1(e.target.value) }} value={address1} required type="text" placeholder='Address line 1' className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' />
                            <input onChange={(e) => { setAddress2(e.target.value) }} value={address2} required type="text" placeholder='Address line 2' className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' />
                        </div>
                    </div>

                    <div className='flex w-full flex-col gap-1'>
                        <p>About</p>
                        <textarea onChange={(e) => { setAbout(e.target.value) }} value={about} required name="" id="" placeholder='Write about yourself' className='outline-0 resize-none w-full border border-gray-400 px-2 py-1 placeholder:text-sm rounded h-30'></textarea>
                    </div>
                    <button type='submit' className='bg-primary py-2 px-6 w-fit rounded-full cursor-pointer text-white text-sm'>Add doctor</button>
                </div>
            </div>
        </form>
    )
}

export default AddDoctor