import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Car, List, TrendingUp } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      name: 'Vehicle Sales Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Analytics & Reports'
    },
    {
      path: '/vehicles',
      name: 'Vehicle List Grid',
      icon: <List className="w-5 h-5" />,
      description: 'Manage Inventory'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">VehiclePro</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Main Menu
        </div>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>System Status: Online</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
