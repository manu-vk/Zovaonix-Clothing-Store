import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'
import { AuthContext } from '../context/Authcontext'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { forgotPass } = useContext(AppContext)
  const { loginUser } = useContext(AuthContext)
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl overflow-hidden">

        <div className="hidden lg:block">
          <div className="relative h-full min-h-[600px] overflow-hidden rounded-[200px_10px_200px_0]">

            <img
              src={assets.clothingBanner1}
              alt="Zovaonix clothing collection"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex flex-col items-center  justify-center  text-center text-white bg-[#5B1830]/55 px-8">
              <p className="text-sm uppercase tracking-[0.3em] mb-4 translate-y-38 ">
                Discover Your Style
              </p>

              <h1 className="text-4xl font-bold mb-4 translate-y-38 ">
                Welcome Back
              </h1>



              <div className="w-16 h-1 bg-white mt-6 rounded-full" />
            </div>

          </div>
        </div>


        <div className="flex flex-col justify-center px-8 sm:px-14 py-14 w-full">

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="translate-x-5 sm:translate-x-0 lg:translate-x-30">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post(
                    'https://zovaonix-backend.onrender.com/api/user/google',
                    // 'http://localhost:5000/api/user/google',
                    { credential: credentialResponse.credential }
                  )

                  localStorage.setItem('token', res.data.token)
                  localStorage.setItem('user', JSON.stringify(res.data.user))

                  window.location.href = '/'
                } catch (error) {
                  console.error(
                    'Google login error:',
                    error.response?.data || error.message
                  )

                  alert(
                    error.response?.data?.message ||
                    'Google login failed. Please try again.'
                  )
                }
              }}
              onError={() => alert('Google sign-in failed. Please try again.')}
              text="signin_with"
              shape="rectangular"
            />

            {/* <button className="flex items-center justify-center gap-3 border-2 border-black py-3 rounded w-full cursor-pointer">
              <img src={assets.facebookAuthIcon} alt="" className="w-6 h-6" />Facebook
            </button> */}
            </div>
          </div>

          <div className="flex items-center my-6 text-sm text-gray-600">
            <div className="flex-1 border-b border-gray-400" />
            <span className="mx-4">Or sign in with email</span>
            <div className="flex-1 border-b border-gray-400" />
          </div>

          <div className="flex items-center gap-4 bg-[#D9D9D9] px-5 py-4 rounded mb-5">
            <img src={assets.authUserIcon} alt="" className="w-6 h-6" />
            <input type="text" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="Enter your username" className="bg-transparent outline-none w-full" />
          </div>

          <div className="flex items-center gap-4 bg-[#D9D9D9] px-5 py-4 rounded mb-3">
            <img src={assets.authLockIcon} alt="" className="w-6 h-6" />
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="bg-transparent outline-none w-full" />
          </div>

          {/* <div className="text-right text-sm mb-6 cursor-pointer" onClick={forgotPass}>Forgot password?</div> */}

          <button className="bg-primary text-white py-4 rounded text-lg font-medium hover:opacity-90 transition cursor-pointer" onClick={() => loginUser(email, password)}>Log In</button>

          <p className="text-center text-base mt-6">Don’t have an account?<Link to="/register" className="font-semibold cursor-pointer ml-1">
            Sign Up
          </Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
