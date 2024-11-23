import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaintBrush, FaUsers, FaShoppingCart, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const menuItems = [
    {
      title: 'Manage Artworks',
      icon: <FaPaintBrush className="w-6 h-6" />,
      description: 'Add, edit, or remove artworks from the gallery',
      path: '/admin/artworks'
    },
    {
      title: 'Manage Users',
      icon: <FaUsers className="w-6 h-6" />,
      description: 'View and manage user accounts',
      path: '/admin/users'
    },
    {
      title: 'Orders',
      icon: <FaShoppingCart className="w-6 h-6" />,
      description: 'View and manage customer orders',
      path: '/admin/orders'
    },
    {
      title: 'Analytics',
      icon: <FaChartLine className="w-6 h-6" />,
      description: 'View sales and user analytics',
      path: '/admin/analytics'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your art gallery platform from one central location
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-indigo-50 text-indigo-600">
              {item.icon}
            </div>
            <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
              {item.title}
            </h2>
            <p className="text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">$24,320</p>
          <p className="mt-2 text-sm text-gray-600">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">1,432</p>
          <p className="mt-2 text-sm text-gray-600">+8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Total Artworks</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">286</p>
          <p className="mt-2 text-sm text-gray-600">+24 new this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">12</p>
          <p className="mt-2 text-sm text-gray-600">4 require attention</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
