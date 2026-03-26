// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/books', label: 'Books', icon: '📚' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/transactions', label: 'Transactions', icon: '🔄' },
    { path: '/borrow-return', label: 'Borrow/Return', icon: '📖' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-bold">Smart Library System</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};