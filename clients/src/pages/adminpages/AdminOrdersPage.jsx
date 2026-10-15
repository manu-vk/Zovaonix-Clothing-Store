import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { FaCheckCircle, FaTimesCircle, FaClock, FaTruck, FaBox } from 'react-icons/fa'

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus, deleteOrder, fetchAllOrders } = useContext(AppContext)
  const [selectedStatus, setSelectedStatus] = useState('')

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    return_requested: 'bg-orange-100 text-orange-700',
    returned: 'bg-gray-100 text-gray-700',

  }

  const statusIcons = {
    pending: <FaClock />,
    confirmed: <FaCheckCircle />,
    processing: <FaBox />,
    shipped: <FaTruck />,
    delivered: <FaCheckCircle />,
    cancelled: <FaTimesCircle />,
    return_requested: <span>↩️</span>,
    returned: <span>📦</span>,

  }

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await fetchAllOrders();
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await deleteOrder(orderId)
    }
  }

  return (
    <div className='p-6 w-full'>
      <h1 className='text-3xl font-bold text-[#00354B] mb-8'>
        Orders Management
      </h1>

      {orders.length === 0 ? (
        <div className='bg-white rounded-xl shadow p-12 text-center'>
          <div className='text-gray-400 mb-4 text-4xl'>📦</div>
          <h3 className='text-lg font-medium mb-2'>No orders yet</h3>
          <p className='text-gray-500'>Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gray-50 border-b'>
                  <th className='px-6 py-4 text-left text-sm font-semibold'>Order ID</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold'>Customer</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold'>Items</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold'>Total Amount</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold'>Payment</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold'>Status</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className='border-b hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm font-medium'>
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      <div>
                        <p className='font-medium'>{order.userId?.name || 'N/A'}</p>
                        <p className='text-gray-500 text-xs'>{order.userId?.email || 'N/A'}</p>
                      </div>
                    </td>

                    <td className='px-6 py-4 text-sm'>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={item._id || index}>
                            <p className="font-medium">
                              {item.name || item.productId?.title || 'Product'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Size: {item.size || 'Not specified'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className='px-6 py-4 text-sm font-semibold'>
                      ₹{order.totalAmount}
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      {order.paymentMethod || 'N/A'}
                    </td>
                    <td className='px-6 py-4'>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusColors[order.status] || 'bg-gray-100'}`}
                      >
                        <option value='pending'>Pending</option>
                        <option value='confirmed'>Confirmed</option>
                        <option value='processing'>Processing</option>
                        <option value='shipped'>Shipped</option>
                        <option value='delivered'>Delivered</option>
                        <option value='cancelled'>Cancelled</option>
                        <option value="return_requested">Return Requested</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                    <td className='px-6 py-4 text-sm'>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className='px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage

