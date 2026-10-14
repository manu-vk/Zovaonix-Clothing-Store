
import React, { useContext,useState  } from 'react'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaBox, FaCheckCircle, FaClock, FaTruck, FaBars, FaTimes } from 'react-icons/fa'
import ProfileSideBar from '../../components/profileComponents/ProfileSideBar'

const OrdersHistory = () => {
    const { userOrders, fetchUserOrders } = useContext(AppContext);
    const { cancelOrder,  returnOrder } = useContext(AppContext);
    const [menuOpen, setMenuOpen] = useState(false)

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        processing: 'bg-purple-100 text-purple-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700'
    }

    const statusIcons = {
        pending: <FaClock className='inline mr-2' />,
        confirmed: <FaCheckCircle className='inline mr-2' />,
        processing: <FaBox className='inline mr-2' />,
        shipped: <FaTruck className='inline mr-2' />,
        delivered: <FaCheckCircle className='inline mr-2' />,
        cancelled: <span className='inline mr-2'>✕</span>
    }

    return (
        <div className="md:p-10 p-4 space-y-4">
            
{/* Mobile account menu */}
<div className="mb-4 md:hidden">
    <button
        onClick={() => setMenuOpen(true)}
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm"
    >
        <FaBars />
        My Account
    </button>
</div>

{/* Mobile side drawer */}
{menuOpen && (
    <div className="fixed inset-0 z-50 md:hidden">
        <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
        />

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

            <ProfileSideBar className="w-full" />
        </div>
    </div>
)}

            
            <h2 className="text-primary text-lg font-medium">Orders List</h2>
            {userOrders && userOrders.length > 0 ? (
                userOrders.map((order) => (
                    <div key={order._id} className="flex flex-col gap-4 p-6 max-w-4xl rounded-md border border-gray-300 bg-white hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-sm text-gray-800 max-[309px]:text-xs">Order #{order._id.slice(-8).toUpperCase()}</p>
                                <p className="text-xs text-gray-500 max-[309px]:text-[10px]">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                                {statusIcons[order.status]} {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium text-gray-700 mb-3">Items:</h3>
                            <div className="space-y-2">
                                {order.items && order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm text-gray-600 pl-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-4 grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 max-[309px]:text-[10px]">Payment Method</p>
                                <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 max-[309px]:text-[10px]">Total Amount</p>
                                <p className="font-semibold max-[309px]:text-[15px]">₹{order.totalAmount}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 max-[309px]:text-[10px]">Order Status</p>
                                <p className="font-medium capitalize max-[309px]:text-[15px] pr-2">{order.status}</p>
                            </div>
                        </div>
                        <div className="border-t pt-4 flex flex-wrap gap-2 min-[330px]:gap-3">
                            {['pending', 'confirmed', 'processing'].includes(order.status) && (
                                <button
                                    onClick={() => cancelOrder(order._id)}
                                    className="rounded-md bg-red-500 px-1.5 py-1 text-[10px] text-white min-[330px]:px-2 min-[330px]:py-1.5 min-[330px]:text-xs
                                     min-[640px]:px-4 min-[640px]:py-2 min-[640px]:text-sm"
                                >
                                    Cancel Order
                                </button>
                            )}

                            {order.status === 'delivered' && (
                                <button
                                    onClick={() => returnOrder(order._id)}
                                    className="rounded-md bg-red-500 px-1.5 py-1 text-[10px] text-white min-[330px]:px-2 min-[330px]:py-1.5 min-[330px]:text-xs 
                                    min-[640px]:px-4 min-[640px]:py-2 min-[640px]:text-sm"
                                >
                                    Return Order
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-12 text-center bg-gray-50 rounded-lg">
                    <FaBox className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <p className="text-sm text-gray-400 mt-2">Your orders will appear here once you place them</p>
                </div>
            )}
        </div>
    );
};

export default OrdersHistory;