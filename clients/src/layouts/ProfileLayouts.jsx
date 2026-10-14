// ProfileLayouts.jsx
// import { Outlet } from 'react-router-dom'
// import ProfileSideBar from '../components/profileComponents/ProfileSideBar'

// export default function ProfileLayouts() {
//   return (
//     <div className="flex gap-6">
//       <ProfileSideBar />
//       <div className="flex-1">
//         <Outlet />
//       </div>
//     </div>
//   )
// }


import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ProfileSideBar from '../components/profileComponents/ProfileSideBar'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function ProfileLayouts() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  
  const isProfilePage = location.pathname === '/profile'



  return (
    <div className="flex gap-6">
   <div className="hidden min-[564px]:block">
  <ProfileSideBar />
</div>
     

      <div className="min-w-0 flex-1">
        {/* Mobile toggle — Profile page only */}
        {isProfilePage && (
          <div className="mb-4 md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              <FaBars />
              My Account
            </button>
          </div>
        )}

        <Outlet />
      </div>

      {/* Mobile side drawer */}
      {isProfilePage && menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-2 text-gray-700"
                aria-label="Close menu"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <ProfileSideBar />
          </div>
        </div>
      )}
    </div>
  )
}
