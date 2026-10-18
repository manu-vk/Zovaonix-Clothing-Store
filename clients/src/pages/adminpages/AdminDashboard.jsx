
import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import {
  FaBoxOpen,
  FaUsers,
  FaLayerGroup,
  FaClipboardList,
} from "react-icons/fa"


const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { products, categories, testuser } = useContext(AppContext)

  const customers = testuser.filter(user => user.role === "user")

  return (
    <div className="w-full min-w-0 p-3 sm:p-5 lg:p-6">
      <h1 className="mb-5 text-xl font-bold text-[#00354B] sm:mb-8 sm:text-2xl lg:text-3xl">
        Dashboard Overview
      </h1>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5 lg:gap-6">

        {/* Products */}
        <div className="min-w-0 rounded-xl border-l-4 border-[#00354B] bg-white p-4 shadow sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {products.length}
              </h2>
            </div>
            <FaBoxOpen className="shrink-0 text-2xl text-[#00354B] sm:text-3xl" />
          </div>
        </div>

        {/* Categories */}
        <div className="min-w-0 rounded-xl border-l-4 border-green-500 bg-white p-4 shadow sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Categories</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {categories.length}
              </h2>
            </div>
            <FaLayerGroup className="shrink-0 text-2xl text-green-500 sm:text-3xl" />
          </div>
        </div>

        {/* Customers */}
        <div className="min-w-0 rounded-xl border-l-4 border-orange-500 bg-white p-4 shadow sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Customers</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {customers.length}
              </h2>
            </div>
            <FaUsers className="shrink-0 text-2xl text-orange-500 sm:text-3xl" />
          </div>
        </div>

        {/* Orders */}
        <div className="min-w-0 rounded-xl border-l-4 border-red-500 bg-white p-4 shadow sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">Orders</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">0</h2>
            </div>
            <FaClipboardList className="shrink-0 text-2xl text-red-500 sm:text-3xl" />
          </div>
        </div>

      </div>

      {/* Recent Customers */}
      <div className="mt-6 min-w-0 rounded-xl bg-white p-4 shadow sm:mt-10 sm:p-6">

        <h2 className="mb-4 text-lg font-semibold text-[#00354B] sm:mb-5 sm:text-xl">
          Recent Customers
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm sm:text-base">

            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 font-semibold">Phone</th>
              </tr>
            </thead>

            <tbody>
              {customers.slice(0, 5).map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="break-words py-4 pr-4">
                    {user.name}
                  </td>

                  <td className="break-all py-4 pr-4">
                    {user.email}
                  </td>

                  <td className="whitespace-nowrap py-4">
                    {user.phone || '—'}
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  )
}

export default AdminDashboard
