// src/components/users/UserForm.jsx
import React, { useState } from 'react';

export const UserForm = ({ onSubmit, onCancel }) => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      type: userType,
      name: formData.name,
      email: formData.email
    };
    
    if (userType === 'student') {
      userData.studentId = formData.studentId;
    } else {
      userData.department = formData.department;
    }
    
    onSubmit(userData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="student"
              checked={userType === 'student'}
              onChange={(e) => setUserType(e.target.value)}
              className="mr-2"
            />
            Student
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="teacher"
              checked={userType === 'teacher'}
              onChange={(e) => setUserType(e.target.value)}
              className="mr-2"
            />
            Teacher
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {userType === 'student' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add User
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};