import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const ProfilePage = () => {
  const { user, fetchProfile } = useContext(AppContext)

  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      // Save logic here - update user profile via API
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (!user) return <p className='p-6'>Loading profile...</p>

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">

      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-6">
        Home &gt; <span className="text-black font-medium">Profile</span>
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button className="bg-[#4A0015] text-white px-10 py-3 rounded-md font-medium">
          Profile
        </button>

      </div>

      {/* User Info Header */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Logged in as: <span className="font-semibold text-gray-800">{user.email}</span></p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none disabled:cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none disabled:cursor-not-allowed"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Date of Birth
          </label>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none disabled:cursor-not-allowed"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-100 rounded-md px-4 py-3 outline-none disabled:cursor-not-allowed"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        
      </div>

      {/* Edit/Save Button */}
      
<div className="flex justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
  {isEditing && (
    <button
      onClick={() => setIsEditing(false)}
      className="border border-Burgundy-300 text-gray-700 px-4 sm:px-8 py-2 text-sm sm:text-base rounded-md font-medium hover:bg-gray-50 transition"
    >
      Cancel
    </button>
  )}

  <button
    onClick={() => {
      if (isEditing) {
        handleSave()
      } else {
        setIsEditing(true)
      }
    }}
    className="border border-[#083344] text-[#083344] px-4 sm:px-8 py-2 text-sm sm:text-base rounded-md font-medium hover:bg-[#083344] hover:text-white transition"
  >
    {isEditing ? 'Save Changes' : 'Edit Profile'}
  </button>
</div>

    </div>
  )
}

export default ProfilePage