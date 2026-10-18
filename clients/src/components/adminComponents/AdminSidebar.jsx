
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { assets } from '../../assets/assets'

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const navItems = [
        { path: '/admin-dashboard', label: 'Dashboard', icon: assets.dashboardIcon },
        { path: '/admin-products', label: 'Products', icon: assets.productsIcon },
        { path: '/admin-categories', label: 'Categories', icon: assets.categoriesIcon },
        { path: '/admin-customers', label: 'Customers', icon: assets.customersIcon },
        { path: '/admin-orders', label: 'Orders', icon: assets.ordersIcon }
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        onClose()
        navigate('/login')
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64
                    bg-blue-100 rounded-r-2xl shadow-lg p-4
                    overflow-y-auto
                    transform transition-transform duration-300
                    lg:static lg:translate-x-0 lg:rounded-2xl lg:h-fit
                    lg:shadow-sm lg:shrink-0 lg:self-start
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="mb-4 p-2 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Dashboard</h2>

                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-md hover:bg-blue-200"
                        aria-label="Close sidebar"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                location.pathname === item.path
                                    ? 'bg-blue-50 text-primary font-medium border-l-4 border-primary'
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            {item.icon && (
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className="w-5 h-5"
                                />
                            )}
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <div className="border-t mt-2 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full p-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar
