// src/components/common/Notification.jsx
import React, { useState, useEffect } from 'react';

export const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 ${types[type]} text-white px-6 py-3 rounded-lg shadow-lg transition-all transform translate-x-0 z-50 animate-slide-in`}>
      <div className="flex items-center space-x-3">
        <span>{icons[type]}</span>
        <span>{message}</span>
        <button onClick={() => setIsVisible(false)} className="ml-4 hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  );
};