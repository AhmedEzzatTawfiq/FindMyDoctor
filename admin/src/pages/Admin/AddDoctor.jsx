import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import api from '../../Api/axios'

const AddDoctor = () => {
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        speciality: "",
        education: "",
        experience: "",
        fees: "",
        address: "",
        about: ""
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", formData.name);
            formData.append("email", formData.email);
            formData.append("password", formData.password);
            formData.append("speciality", formData.speciality);
            formData.append("education", formData.education);
            formData.append("experience", formData.experience);
            formData.append("fees", formData.fees);
            formData.append("address", formData.address);
            formData.append("about", formData.about);
            const response = await api.post("/api/add-doctor", formData);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    return (

        <form className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>
            <div className='bg-white p-8 shadow-gray-100 shadow-sm rounded w-full max-w-2xl max-h-[110vh] overflow-y-scroll'>
                <div className='flex gap-4 items-center mb-5'>
                    <label className='cursor-pointer' htmlFor="doc-img">
                        <img onChange={handleImageChange} className='w-16' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={handleImageChange} type="file" id='doc-img' className='cursor-pointer hidden' />
                    <p className='text-sm'>Upload doctor <br />picture</p>
                </div>
                <div className='flex flex-col gap-8 lg:flex-1 items-start'>

                    <div className='flex not-sm:w-full not-sm:flex-col gap-y-5 sm:flex sm:gap-17'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <p>Doctor Name</p>
                            <input onChange={setFormData} value={formData.name} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="text" placeholder='Enter doctor name' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={setFormData} value={formData.email} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="email" placeholder='Your email' />
                        </div>
                    </div>
                    <div className='flex not-sm:w-full not-sm:flex-col gap-y-5 sm:flex sm:gap-17'>
                        <div className='flex flex-col gap-1'>
                            <p>Password</p>
                            <input onChange={setFormData} value={formData.password} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="password" placeholder='Password' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={setFormData} value={formData.speciality} name="" id="" className='outline-0 text-sm text-gray-500 border border-gray-400 pl-1 pr-18 py-2 placeholder:text-sm rounded'>
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
                            <input onChange={setFormData} value={formData.education} className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' type="text" placeholder='Education' />
                        </div>


                        <div className='flex not-sm:w-full flex-col gap-1'>
                            <p>Experience</p>
                            <select name="" id="" className='outline-0 pl-1 pr-33 text-sm text-gray-500 border border-gray-400 px-1 py-2 placeholder:text-sm rounded'>
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
                            <input type="text" placeholder='Your fees' className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p>Address</p>
                            <input type="text" placeholder='Address line 1' className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' />
                            <input type="text" placeholder='Address line 2' className='outline-0 border border-gray-400 px-2 py-1 placeholder:text-sm rounded' />
                        </div>
                    </div>

                    <div className='flex w-full flex-col gap-1'>
                        <p>About</p>
                        <textarea name="" id="" placeholder='Write about yourself' className='outline-0 resize-none w-full border border-gray-400 px-2 py-1 placeholder:text-sm rounded h-30'></textarea>
                    </div>
                    <button onSubmit={handleSubmit} className='bg-primary py-2 px-6 w-fit rounded-full cursor-pointer text-white text-sm'>Add doctor</button>
                </div>
            </div>
        </form>
    )
}

export default AddDoctor