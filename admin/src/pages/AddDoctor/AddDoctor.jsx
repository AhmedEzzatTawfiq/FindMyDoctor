import React, { useContext, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { addDoctor } from '../../services';
import { useQueryClient } from '@tanstack/react-query';

const specializations = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
]

const experienceOptions = Array.from({ length: 10 }, (_, i) => `${i + 1} Year${i > 0 ? 's' : ''}`)

const AddDoctor = () => {
  const queryClient = useQueryClient();
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [specialization, setSpecialization] = useState('General physician');
  const [fees, setFees] = useState('');
  const [degree, setDegree] = useState('');
  const [about, setAbout] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [title, setTitle] = useState('Specialist');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);

  const { aToken } = useContext(AdminContext)

  const handleSubmit = async (e) => {
    e.preventDefault()   

    if (!image) return toast.error('Please upload a doctor photo')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('specialization', specialization)  
      formData.append('fees', Number(fees))
      formData.append('degree', degree)
      formData.append('about', about)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
      formData.append('title', title)
      formData.append('gender', gender)

      const data = await addDoctor(formData);

      if (data.success) {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] })
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashData'] })
        setImage(false)
        setName('')
        setEmail('')
        setPassword('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
        setTitle('Specialist')
        setGender('Male')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="m-5 w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Add New Doctor</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Image upload */}
        <div className="flex items-center gap-4 mb-8">
          <label htmlFor="doc-img" className="cursor-pointer group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-indigo-300 group-hover:border-indigo-500 transition flex items-center justify-center bg-indigo-50">
              {image
                ? <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" />
                : <UploadCloud className="w-8 h-8 text-indigo-400" />
              }
            </div>
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" accept="image/*" id="doc-img" className="hidden" />
          <div>
            <p className="font-medium text-gray-700">Doctor Photo</p>
            <p className="text-xs text-gray-400 mt-0.5">Click to upload (JPG, PNG)</p>
          </div>
        </div>

        {/* Grid fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Doctor Name</label>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="text" placeholder="Full name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              required value={email} onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="email" placeholder="doctor@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              required value={password} onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="password" placeholder="Min 8 characters"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Specialization</label>
            <select
              value={specialization} onChange={(e) => setSpecialization(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Doctor Title</label>
            <select
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="Professor">Professor</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Consultant">Consultant</option>
              <option value="Specialist">Specialist</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <select
              value={gender} onChange={(e) => setGender(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Education / Degree</label>
            <input
              required value={degree} onChange={(e) => setDegree(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="text" placeholder="e.g. MBBS, MD"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Experience</label>
            <select
              value={experience} onChange={(e) => setExperience(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Consultation Fees (EGP)</label>
            <input
              required value={fees} onChange={(e) => setFees(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="number" placeholder="e.g. 300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Address Line 1</label>
            <input
              required value={address1} onChange={(e) => setAddress1(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="text" placeholder="Street / Building"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Address Line 2</label>
            <input
              required value={address2} onChange={(e) => setAddress2(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              type="text" placeholder="City / District"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">About the Doctor</label>
            <textarea
              required value={about} onChange={(e) => setAbout(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none h-28"
              placeholder="Brief biography and expertise…"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-linear-to-r cursor-pointer from-indigo-500 to-purple-600 text-white px-8 py-2.5 rounded-full font-semibold text-sm shadow hover:shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Adding…' : 'Add Doctor'}
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
